<template>
  <div class="tree-node">
    <template v-if="isPrimitive(node)">
      <code class="primitive" :class="valueTypeClass">{{ formatPrimitive(node) }}</code>
    </template>

    <template v-else-if="Array.isArray(node)">
      <details open>
        <summary>
          <ChevronDown class="icon" :size="14" />
          <span class="key">Array</span>
          <span class="meta">{{ node.length }} items</span>
        </summary>
        <div class="children">
          <div v-for="(item, index) in node" :key="`${path}.${index}`" class="entry">
            <span class="entry-key">{{ index }}</span>
            <MetadataTree :node="item" :path="`${path}.${index}`" :query="query" />
          </div>
        </div>
      </details>
    </template>

    <template v-else>
      <details open>
        <summary>
          <ChevronDown class="icon" :size="14" />
          <span class="key">Object</span>
          <span class="meta">{{ objectKeys.length }} fields</span>
        </summary>
        <div class="children">
          <div v-for="key in objectKeys" :key="`${path}.${key}`" class="entry">
            <span class="entry-key" v-html="highlightMatch(key, query)"></span>
            <MetadataTree
              :node="(node as Record<string, unknown>)[key]"
              :path="`${path}.${key}`"
              :query="query"
            />
          </div>
        </div>
      </details>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

const props = defineProps<{
  node: unknown;
  path: string;
  query: string;
}>();

const objectKeys = computed(() =>
  props.node && typeof props.node === "object" && !Array.isArray(props.node)
    ? Object.keys(props.node as Record<string, unknown>)
    : []
);

const isPrimitive = (value: unknown) =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const formatPrimitive = (value: unknown) => {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  return String(value);
};

const valueTypeClass = computed(() => {
  if (typeof props.node === "string") return "string";
  if (typeof props.node === "number") return "number";
  if (typeof props.node === "boolean") return "boolean";
  return "null";
});

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatch = (value: string, query: string) => {
  if (!query.trim()) return value;

  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp);

  if (!terms.length) return value;

  const matcher = new RegExp(`(${terms.join("|")})`, "gi");
  return value.replace(matcher, "<mark>$1</mark>");
};
</script>
