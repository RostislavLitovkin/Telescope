<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <Blocks class="icon" :size="18" />
        <div>
          <h1>Substrate Metadata Explorer</h1>
          <p>Swagger-inspired pallet reference</p>
        </div>
      </div>

      <button class="download-btn" :disabled="!hasMetadata" @click="downloadMetadata">
        <Download class="icon" :size="16" />
        <span>Download JSON</span>
      </button>
    </header>

    <main v-if="!hasMetadata" class="hero-wrap">
      <section class="hero-card">
        <div class="hero-icon">
          <PlugZap :size="26" />
        </div>
        <h2>Connect to a Substrate chain</h2>
        <p>
          Enter a secure WebSocket endpoint and fetch runtime metadata as JSON.
        </p>

        <form class="connect-form" @submit.prevent="connectToChain">
          <label for="endpoint">WebSocket endpoint</label>
          <div class="endpoint-row">
            <input
              id="endpoint"
              v-model="endpoint"
              placeholder="wss://rpc.polkadot.io"
              autocomplete="off"
              spellcheck="false"
            />
            <button type="submit" :disabled="isLoading">
              <Search :size="16" class="icon" />
              <span>{{ isLoading ? "Connecting..." : "Enter" }}</span>
            </button>
          </div>
          <p v-if="errorMessage" class="status error">
            <TriangleAlert :size="15" class="icon" />
            {{ errorMessage }}
          </p>
        </form>
      </section>
    </main>

    <main v-else class="swagger-layout">
      <aside class="sidebar">
        <section class="chain-meta">
          <h2>
            <Server :size="16" class="icon" />
            Runtime
          </h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{{ chainInfo.chain }}</dd>
            </div>
            <div>
              <dt>Node</dt>
              <dd>{{ chainInfo.nodeName }}</dd>
            </div>
            <div>
              <dt>Node Version</dt>
              <dd>{{ chainInfo.nodeVersion }}</dd>
            </div>
            <div>
              <dt>Metadata</dt>
              <dd>{{ metadataVersion }}</dd>
            </div>
            <div>
              <dt>Pallets</dt>
              <dd>{{ quickStats.palletCount }}</dd>
            </div>
            <div>
              <dt>Calls</dt>
              <dd>{{ quickStats.callCount }}</dd>
            </div>
            <div>
              <dt>Events</dt>
              <dd>{{ quickStats.eventCount }}</dd>
            </div>
            <div>
              <dt>Errors</dt>
              <dd>{{ quickStats.errorCount }}</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>{{ quickStats.storageCount }}</dd>
            </div>
          </dl>
        </section>

        <section class="search-pane">
          <label for="metadataSearch">
            <Sparkles :size="14" class="icon" />
            Smart pallet search
          </label>
          <input
            id="metadataSearch"
            v-model="metadataSearch"
            placeholder="Try: balances transfer, staking rewards, treasury"
            autocomplete="off"
            spellcheck="false"
          />
          <p class="help">Fuzzy, alias-expanded and relevance-ranked over pallets and internals.</p>
        </section>

        <nav class="section-nav" v-if="visiblePallets.length">
          <h3>
            <ScrollText :size="14" class="icon" />
            Pallets
          </h3>
          <button
            v-for="pallet in visiblePallets"
            :key="pallet.name"
            class="section-link"
            @click="scrollToSection(pallet.name)"
          >
            <span>{{ pallet.name }}</span>
            <strong>{{ pallet.calls.length + pallet.events.length + pallet.errors.length }}</strong>
          </button>
        </nav>
      </aside>

      <section class="swagger-content">
        <form class="connect-form inline" @submit.prevent="connectToChain">
          <label for="endpointInline">Endpoint</label>
          <div class="endpoint-row">
            <input
              id="endpointInline"
              v-model="endpoint"
              placeholder="wss://rpc.polkadot.io"
              autocomplete="off"
              spellcheck="false"
            />
            <button type="submit" :disabled="isLoading">
              <RefreshCw :size="16" class="icon" :class="{ spinning: isLoading }" />
              <span>{{ isLoading ? "Refreshing..." : "Reconnect" }}</span>
            </button>
          </div>
          <p v-if="errorMessage" class="status error">
            <TriangleAlert :size="15" class="icon" />
            {{ errorMessage }}
          </p>
          <p v-else class="status ok">
            <CircleCheck :size="15" class="icon" />
            Connected. Pallet catalog loaded.
          </p>
        </form>

        <section class="result-banner" v-if="metadataSearch">
          <Filter :size="15" class="icon" />
          Showing {{ visiblePallets.length }} pallet{{ visiblePallets.length === 1 ? "" : "s" }} for query
          <strong>{{ metadataSearch }}</strong>
        </section>

        <section v-if="!visiblePallets.length" class="empty-result">
          <SearchX :size="18" class="icon" />
          <h3>No pallets match this query</h3>
          <p>Try broader terms like "balance", "staking", "extrinsic" or "storage".</p>
        </section>

        <article
          v-for="pallet in visiblePallets"
          :id="`pallet-${palletAnchorId(pallet.name)}`"
          :key="pallet.name"
          class="pallet-card"
        >
          <PalletPanel :pallet="pallet" :query="metadataSearch" />
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Blocks,
  CircleCheck,
  Download,
  Filter,
  PlugZap,
  RefreshCw,
  ScrollText,
  Search,
  SearchX,
  Server,
  Sparkles,
  TriangleAlert
} from "lucide-vue-next";
import PalletPanel from "~/components/PalletPanel.vue";
import { useMetadataExplorer } from "~/composables/useMetadataExplorer";

const {
  endpoint,
  metadataSearch,
  isLoading,
  errorMessage,
  metadataJson,
  visiblePallets,
  metadataVersion,
  chainInfo,
  quickStats,
  connectToChain,
  downloadMetadata,
  scrollToSection,
  palletAnchorId
} = useMetadataExplorer();

const hasMetadata = computed(() => Boolean(metadataJson.value));
</script>
