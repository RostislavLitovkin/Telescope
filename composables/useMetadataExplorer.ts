import Fuse from "fuse.js";
import type { ApiPromise as ApiPromiseType } from "@polkadot/api";

const CONNECTION_TIMEOUT_MS = 20000;
const RPC_TIMEOUT_MS = 15000;

type ChainInfo = {
  chain: string;
  nodeName: string;
  nodeVersion: string;
};

type FieldView = {
  name: string;
  typeId: number | null;
  typeLabel: string;
};

type VariantView = {
  name: string;
  index: number;
  docs: string;
  fields: FieldView[];
};

type StorageView = {
  name: string;
  modifier: string;
  typeLabel: string;
  docs: string;
};

type ConstantView = {
  name: string;
  typeId: number | null;
  typeLabel: string;
  docs: string;
  valuePreview: string;
};

type TypeView = {
  name: string;
  typeId: number | null;
  typeLabel: string;
  docs: string;
};

export type PalletView = {
  name: string;
  index: number;
  docs: string;
  calls: VariantView[];
  events: VariantView[];
  errors: VariantView[];
  storage: StorageView[];
  constants: ConstantView[];
  associatedTypes: TypeView[];
  viewFunctions: TypeView[];
};

type PalletSearchDoc = {
  name: string;
  docs: string;
  contents: string;
  pallet: PalletView;
};

const smartAliases: Record<string, string[]> = {
  tx: ["extrinsic", "call", "transaction"],
  balance: ["balances", "account", "currency", "fee"],
  event: ["events", "emit"],
  error: ["errors", "dispatcherror"],
  stake: ["staking", "validator", "nominator"],
  storage: ["map", "doublemap", "storage"],
  governance: ["democracy", "referenda", "council", "treasury"],
  type: ["lookup", "portable", "composite", "variant"],
  pallet: ["module", "runtime", "section"]
};

const normalize = (text: string) => text.trim().toLowerCase();

const expandQuery = (raw: string) => {
  const terms = normalize(raw).split(/\s+/).filter(Boolean);
  const expanded = new Set<string>(terms);

  for (const term of terms) {
    const aliases = smartAliases[term] || [];
    for (const alias of aliases) {
      expanded.add(alias);
    }
  }

  return [...expanded].join(" ");
};

const docToText = (docs: unknown) => {
  if (Array.isArray(docs)) {
    return docs.filter((item) => typeof item === "string").join(" ").trim();
  }

  return typeof docs === "string" ? docs : "";
};

const truncate = (value: string, size = 120) => {
  if (value.length <= size) return value;
  return `${value.slice(0, size)}...`;
};

const sanitizeAnchor = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
};

const normalizeEndpointInput = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { value: "", error: "Endpoint is required." };
  }

  let normalized = trimmed;

  // If the app is served on HTTPS, auto-upgrade ws:// inputs to wss://.
  if (/^ws:\/\//i.test(normalized) && typeof window !== "undefined" && window.location.protocol === "https:") {
    normalized = normalized.replace(/^ws:\/\//i, "wss://");
  }

  if (!/^wss?:\/\//i.test(normalized)) {
    return { value: "", error: "Endpoint must start with ws:// or wss://" };
  }

  try {
    const url = new URL(normalized);
    if (!["ws:", "wss:"].includes(url.protocol)) {
      return { value: "", error: "Endpoint protocol must be ws:// or wss://" };
    }

    if (typeof window !== "undefined" && window.location.protocol === "https:" && url.protocol === "ws:") {
      return {
        value: "",
        error: "This site is served over HTTPS. Use a secure wss:// endpoint."
      };
    }

    return { value: url.toString(), error: "" };
  } catch {
    return { value: "", error: "Endpoint URL is invalid." };
  }
};

export const useMetadataExplorer = () => {
  const endpoint = ref("wss://rpc.polkadot.io");
  const metadataSearch = ref("");
  const isLoading = ref(false);
  const errorMessage = ref("");
  const metadataJson = ref<Record<string, unknown> | null>(null);
  const apiRef = ref<ApiPromiseType | null>(null);
  const chainInfo = ref<ChainInfo>({
    chain: "Unknown",
    nodeName: "Unknown",
    nodeVersion: "Unknown"
  });

  const metadataVersion = computed(() => {
    if (!metadataJson.value) return "n/a";

    if (metadataJson.value.asLatest) {
      return "asLatest";
    }

    const metadata = metadataJson.value.metadata;
    if (!metadata || typeof metadata !== "object") {
      return "unknown";
    }

    const versions = Object.keys(metadata as Record<string, unknown>)
      .filter((key) => /^v\d+$/i.test(key))
      .sort((a, b) => Number(b.slice(1)) - Number(a.slice(1)));

    return versions[0] || "unknown";
  });

  const metadataCore = computed<Record<string, unknown> | null>(() => {
    if (!metadataJson.value) return null;

    if (metadataJson.value.asLatest && typeof metadataJson.value.asLatest === "object") {
      return metadataJson.value.asLatest as Record<string, unknown>;
    }

    const metadata = metadataJson.value.metadata;
    if (!metadata || typeof metadata !== "object") return null;

    const version = metadataVersion.value;
    if (version === "unknown" || version === "n/a") return null;

    const versionRoot = (metadata as Record<string, unknown>)[version];
    return versionRoot && typeof versionRoot === "object"
      ? (versionRoot as Record<string, unknown>)
      : null;
  });

  const lookupById = computed(() => {
    const map = new Map<number, Record<string, unknown>>();
    const lookupRoot = metadataCore.value?.lookup as Record<string, unknown> | undefined;
    const types = (lookupRoot?.types as unknown[]) || [];

    for (const item of types) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const id = record.id;
      if (typeof id === "number") {
        map.set(id, record);
      }
    }

    return map;
  });

  const resolveTypeLabel = (typeId: number | null) => {
    if (typeId === null) return "Unknown";

    const lookup = lookupById.value.get(typeId);
    const type = lookup?.type as Record<string, unknown> | undefined;
    const path = (type?.path as string[]) || [];
    const shortName = path.length ? path.join("::") : `Type#${typeId}`;

    const def = (type?.def as Record<string, unknown>) || {};
    const kind = Object.keys(def)[0] || "unknown";

    return `${shortName} (${kind})`;
  };

  const resolveFields = (fields: unknown): FieldView[] => {
    if (!Array.isArray(fields)) return [];

    return fields.map((field, index) => {
      const record = (field && typeof field === "object") ? (field as Record<string, unknown>) : {};
      const typeId = typeof record.type === "number" ? record.type : null;
      const typeName = typeof record.typeName === "string" ? record.typeName : "";

      return {
        name: typeof record.name === "string" && record.name ? record.name : `arg${index}`,
        typeId,
        typeLabel: typeName || resolveTypeLabel(typeId)
      };
    });
  };

  const resolveVariantsFromType = (typeRef: unknown): VariantView[] => {
    const record = (typeRef && typeof typeRef === "object") ? (typeRef as Record<string, unknown>) : {};
    const typeId = typeof record.type === "number" ? record.type : null;
    if (typeId === null) return [];

    const lookup = lookupById.value.get(typeId);
    const type = lookup?.type as Record<string, unknown> | undefined;
    const def = (type?.def as Record<string, unknown>) || {};
    const variant = (def.variant as Record<string, unknown>) || {};
    const variants = (variant.variants as unknown[]) || [];

    return variants.map((item, index) => {
      const payload = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      return {
        name: typeof payload.name === "string" ? payload.name : `Variant${index}`,
        index: typeof payload.index === "number" ? payload.index : index,
        docs: docToText(payload.docs),
        fields: resolveFields(payload.fields)
      };
    });
  };

  const parseStorageType = (storageType: unknown): string => {
    if (!storageType || typeof storageType !== "object") return "Unknown";
    const record = storageType as Record<string, unknown>;

    if (typeof record.plain === "number") {
      return `Plain ${resolveTypeLabel(record.plain)}`;
    }

    if (record.map && typeof record.map === "object") {
      const map = record.map as Record<string, unknown>;
      const key = typeof map.key === "number" ? resolveTypeLabel(map.key) : "Unknown";
      const value = typeof map.value === "number" ? resolveTypeLabel(map.value) : "Unknown";
      return `Map<${key}, ${value}>`;
    }

    if (record.nmap && typeof record.nmap === "object") {
      const nmap = record.nmap as Record<string, unknown>;
      const value = typeof nmap.value === "number" ? resolveTypeLabel(nmap.value) : "Unknown";
      return `NMap<..., ${value}>`;
    }

    return "Unknown";
  };

  const toPalletView = (source: Record<string, unknown>): PalletView => {
    const storageRoot = (source.storage as Record<string, unknown>) || {};
    const storageItems = (storageRoot.items as unknown[]) || [];

    const constants = ((source.constants as unknown[]) || []).map((item) => {
      const entry = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      const typeId = typeof entry.type === "number" ? entry.type : null;
      const rawValue = typeof entry.value === "string" ? entry.value : JSON.stringify(entry.value ?? "");
      return {
        name: typeof entry.name === "string" ? entry.name : "constant",
        typeId,
        typeLabel: resolveTypeLabel(typeId),
        docs: docToText(entry.docs),
        valuePreview: truncate(rawValue || "")
      };
    });

    const associatedTypes = ((source.associatedTypes as unknown[]) || []).map((item) => {
      const entry = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      const typeId = typeof entry.type === "number" ? entry.type : null;
      return {
        name: typeof entry.name === "string" ? entry.name : "type",
        typeId,
        typeLabel: resolveTypeLabel(typeId),
        docs: docToText(entry.docs)
      };
    });

    const viewFunctions = ((source.viewFunctions as unknown[]) || []).map((item) => {
      const entry = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      const typeId = typeof entry.type === "number" ? entry.type : null;
      return {
        name: typeof entry.name === "string" ? entry.name : "viewFunction",
        typeId,
        typeLabel: resolveTypeLabel(typeId),
        docs: docToText(entry.docs)
      };
    });

    const storage = storageItems.map((item) => {
      const entry = (item && typeof item === "object") ? (item as Record<string, unknown>) : {};
      return {
        name: typeof entry.name === "string" ? entry.name : "storageItem",
        modifier: typeof entry.modifier === "number" ? `modifier:${entry.modifier}` : String(entry.modifier ?? "default"),
        typeLabel: parseStorageType(entry.type),
        docs: docToText(entry.docs)
      };
    });

    return {
      name: typeof source.name === "string" ? source.name : "Pallet",
      index: typeof source.index === "number" ? source.index : 0,
      docs: docToText(source.docs),
      calls: resolveVariantsFromType(source.calls),
      events: resolveVariantsFromType(source.events),
      errors: resolveVariantsFromType(source.errors),
      storage,
      constants,
      associatedTypes,
      viewFunctions
    };
  };

  const allPallets = computed<PalletView[]>(() => {
    const pallets = (metadataCore.value?.pallets as unknown[]) || [];
    return pallets
      .filter((item) => item && typeof item === "object")
      .map((item) => toPalletView(item as Record<string, unknown>))
      .sort((a, b) => a.index - b.index);
  });

  const palletSearchDocs = computed<PalletSearchDoc[]>(() =>
    allPallets.value.map((pallet) => {
      const contents = [
        pallet.docs,
        ...pallet.calls.map((item) => `${item.name} ${item.docs}`),
        ...pallet.events.map((item) => `${item.name} ${item.docs}`),
        ...pallet.errors.map((item) => `${item.name} ${item.docs}`),
        ...pallet.storage.map((item) => `${item.name} ${item.typeLabel} ${item.docs}`),
        ...pallet.constants.map((item) => `${item.name} ${item.typeLabel} ${item.docs}`),
        ...pallet.associatedTypes.map((item) => `${item.name} ${item.typeLabel} ${item.docs}`),
        ...pallet.viewFunctions.map((item) => `${item.name} ${item.typeLabel} ${item.docs}`)
      ].join(" ");

      return {
        name: pallet.name,
        docs: pallet.docs,
        contents,
        pallet
      };
    })
  );

  const fuseIndex = computed(() =>
    new Fuse(palletSearchDocs.value, {
      includeScore: true,
      shouldSort: true,
      threshold: 0.33,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: "name", weight: 0.4 },
        { name: "docs", weight: 0.2 },
        { name: "contents", weight: 0.4 }
      ]
    })
  );

  const visiblePallets = computed<PalletView[]>(() => {
    if (!metadataSearch.value.trim()) {
      return allPallets.value;
    }

    const expanded = expandQuery(metadataSearch.value);
    return fuseIndex.value.search(expanded, { limit: 120 }).map((result) => result.item.pallet);
  });

  const quickStats = computed(() => {
    const pallets = allPallets.value;
    const callCount = pallets.reduce((sum, pallet) => sum + pallet.calls.length, 0);
    const eventCount = pallets.reduce((sum, pallet) => sum + pallet.events.length, 0);
    const errorCount = pallets.reduce((sum, pallet) => sum + pallet.errors.length, 0);
    const storageCount = pallets.reduce((sum, pallet) => sum + pallet.storage.length, 0);

    return {
      palletCount: pallets.length,
      callCount,
      eventCount,
      errorCount,
      storageCount
    };
  });

  const disconnectCurrent = async () => {
    if (!apiRef.value) return;

    try {
      await apiRef.value.disconnect();
    } catch {
      // Ignore disconnect failures; reconnect flow will continue.
    } finally {
      apiRef.value = null;
    }
  };

  const connectToChain = async () => {
    errorMessage.value = "";

    const normalizedInput = normalizeEndpointInput(endpoint.value);
    if (normalizedInput.error) {
      errorMessage.value = normalizedInput.error;
      return;
    }

    endpoint.value = normalizedInput.value;

    isLoading.value = true;

    try {
      await disconnectCurrent();

      const { cryptoWaitReady } = await import("@polkadot/util-crypto");
      await withTimeout(
        cryptoWaitReady(),
        RPC_TIMEOUT_MS,
        "Timed out while initializing crypto libraries."
      );

      const { ApiPromise, WsProvider } = await import("@polkadot/api");
      const provider = new WsProvider(endpoint.value, 1000);
      const api = await withTimeout(
        ApiPromise.create({ provider, noInitWarn: true }),
        CONNECTION_TIMEOUT_MS,
        "Timed out while opening websocket connection."
      );

      await withTimeout(
        api.isReady,
        CONNECTION_TIMEOUT_MS,
        "Timed out while waiting for node API readiness."
      );

      const [chain, nodeName, nodeVersion] = await withTimeout(
        Promise.all([api.rpc.system.chain(), api.rpc.system.name(), api.rpc.system.version()]),
        RPC_TIMEOUT_MS,
        "Connected, but system info request timed out."
      );

      apiRef.value = api;
      chainInfo.value = {
        chain: chain.toString(),
        nodeName: nodeName.toString(),
        nodeVersion: nodeVersion.toString()
      };

      const metadata = await withTimeout(
        Promise.resolve(api.runtimeMetadata.toJSON() as Record<string, unknown>),
        RPC_TIMEOUT_MS,
        "Connected, but metadata decoding timed out."
      );
      metadataJson.value = metadata;
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : "Unknown connection error";
      const message = /1006|websocket|disconnected|closing/i.test(rawMessage)
        ? `${rawMessage}. The endpoint may block browser origins, be offline, or require a different websocket URL.`
        : rawMessage;

      errorMessage.value = `Connection failed: ${message}`;
      metadataJson.value = null;
      await disconnectCurrent();
    } finally {
      isLoading.value = false;
    }
  };

  const downloadMetadata = () => {
    if (!metadataJson.value) return;

    const payload = JSON.stringify(metadataJson.value, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${normalize(chainInfo.value.chain).replace(/\s+/g, "-") || "chain"}-metadata-${timestamp}.json`;
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const scrollToSection = (key: string) => {
    const target = document.getElementById(`pallet-${sanitizeAnchor(key)}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  onBeforeUnmount(async () => {
    await disconnectCurrent();
  });

  return {
    endpoint,
    metadataSearch,
    isLoading,
    errorMessage,
    metadataJson,
    metadataVersion,
    chainInfo,
    quickStats,
    visiblePallets,
    connectToChain,
    downloadMetadata,
    scrollToSection,
    palletAnchorId: sanitizeAnchor
  };
};
