<template>
  <details class="pallet-panel">
    <summary>
      <div class="pallet-summary">
        <div class="pallet-title-wrap">
          <h3 v-html="highlight(pallet.name)"></h3>
          <p>{{ pallet.docs || "No pallet documentation available." }}</p>
        </div>
        <div class="pallet-chip-row">
          <span class="chip calls">Calls {{ pallet.calls.length }}</span>
          <span class="chip events">Events {{ pallet.events.length }}</span>
          <span class="chip errors">Errors {{ pallet.errors.length }}</span>
          <span class="chip storage">Storage {{ pallet.storage.length }}</span>
          <span class="chip constants">Constants {{ pallet.constants.length }}</span>
          <span class="chip types">Types {{ pallet.associatedTypes.length }}</span>
        </div>
      </div>
      <ChevronDown class="icon chevron" :size="18" />
    </summary>

    <div class="pallet-body">
      <details class="group" v-if="pallet.calls.length">
        <summary>
          <h4><SquareTerminal :size="14" class="icon" /> Calls</h4>
          <span class="group-count">{{ pallet.calls.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list">
          <article v-for="item in pallet.calls" :key="`call-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>index {{ item.index }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
            <table v-if="item.fields.length" class="field-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in item.fields" :key="`${item.name}-${field.name}-${field.typeId}`">
                  <td>{{ field.name }}</td>
                  <td>{{ field.typeLabel }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </details>

      <details class="group" v-if="pallet.events.length">
        <summary>
          <h4><BellRing :size="14" class="icon" /> Events</h4>
          <span class="group-count">{{ pallet.events.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list">
          <article v-for="item in pallet.events" :key="`event-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>index {{ item.index }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
            <table v-if="item.fields.length" class="field-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in item.fields" :key="`${item.name}-${field.name}-${field.typeId}`">
                  <td>{{ field.name }}</td>
                  <td>{{ field.typeLabel }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </details>

      <details class="group" v-if="pallet.errors.length">
        <summary>
          <h4><TriangleAlert :size="14" class="icon" /> Errors</h4>
          <span class="group-count">{{ pallet.errors.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list">
          <article v-for="item in pallet.errors" :key="`error-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>index {{ item.index }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
            <table v-if="item.fields.length" class="field-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in item.fields" :key="`${item.name}-${field.name}-${field.typeId}`">
                  <td>{{ field.name }}</td>
                  <td>{{ field.typeLabel }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </details>

      <details class="group" v-if="pallet.storage.length">
        <summary>
          <h4><Database :size="14" class="icon" /> Storage</h4>
          <span class="group-count">{{ pallet.storage.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list compact">
          <article v-for="item in pallet.storage" :key="`storage-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>{{ item.modifier }}</small>
            </header>
            <p class="item-doc">{{ item.typeLabel }}</p>
            <p v-if="item.docs" class="item-doc subtle">{{ item.docs }}</p>
          </article>
        </div>
      </details>

      <details class="group" v-if="pallet.constants.length">
        <summary>
          <h4><Binary :size="14" class="icon" /> Constants</h4>
          <span class="group-count">{{ pallet.constants.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list compact">
          <article v-for="item in pallet.constants" :key="`constant-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>{{ item.typeLabel }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
            <code class="preview">{{ item.valuePreview }}</code>
          </article>
        </div>
      </details>

      <details class="group" v-if="pallet.associatedTypes.length || pallet.viewFunctions.length">
        <summary>
          <h4><Shapes :size="14" class="icon" /> Types and View Functions</h4>
          <span class="group-count">{{ pallet.associatedTypes.length + pallet.viewFunctions.length }}</span>
          <ChevronDown class="icon group-chevron" :size="16" />
        </summary>
        <div class="item-list compact">
          <article v-for="item in pallet.associatedTypes" :key="`associated-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>{{ item.typeLabel }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
          </article>
          <article v-for="item in pallet.viewFunctions" :key="`view-${item.name}`" class="item-card">
            <header>
              <span class="item-name" v-html="highlight(item.name)"></span>
              <small>{{ item.typeLabel }}</small>
            </header>
            <p v-if="item.docs" class="item-doc">{{ item.docs }}</p>
          </article>
        </div>
      </details>
    </div>
  </details>
</template>

<script setup lang="ts">
import {
  BellRing,
  Binary,
  ChevronDown,
  Database,
  Shapes,
  SquareTerminal,
  TriangleAlert
} from "lucide-vue-next";
import type { PalletView } from "~/composables/useMetadataExplorer";

const props = defineProps<{
  pallet: PalletView;
  query: string;
}>();

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlight = (value: string) => {
  const query = props.query.trim().toLowerCase();
  if (!query) return value;

  const terms = query
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp);

  if (!terms.length) return value;

  const matcher = new RegExp(`(${terms.join("|")})`, "gi");
  return value.replace(matcher, "<mark>$1</mark>");
};
</script>
