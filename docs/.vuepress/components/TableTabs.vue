<script setup>
import { ref, computed, useSlots, onMounted, watch, nextTick, useId } from 'vue'
import { groupChoice, setGroupChoice, storedGroupChoice } from '../utils/tabGroups'

const slots = useSlots()
const tabKeys = Object.keys(slots)
const activeTab = ref(tabKeys[0] ?? '')
const currentTab = computed(() => activeTab.value)
const wrapperRef = ref(null)
// Unique per instance (SSR-safe) so the <label for> pairing works and several
// TableTabs on one page never share an id.
const selectId = `tabletabs-${useId()}`

function formatKey(key) {
  return key.replace(/[__]/g, ' ')
}

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  // Accessible name used when there is no visible label.
  ariaLabel: {
    type: String,
    default: ''
  },
  labels: {
    type: Object,
    default: () => ({})
  },
  // Kept for backward compatibility with pages that pass :bottom-line="false".
  // The block now has its own border, so no extra rule is drawn.
  bottomLine: {
    type: Boolean,
    default: true
  },
  // Force the segmented button row. Short tab sets get it automatically;
  // this only matters for a set the heuristic would put in a select.
  buttons: {
    type: Boolean,
    default: false
  },
  // Force the select. Escape hatch for a short tab set that should still
  // collapse into a dropdown.
  dropdown: {
    type: Boolean,
    default: false
  }
})

function tabLabel(key) {
  return props.labels[key] || formatKey(key)
}

// Showing every option beats hiding them behind a dropdown, as long as the row
// stays on one line in the content column (~847 px). Longer or more numerous
// sets (PHP versions, command lists) keep the select.
const autoButtons = computed(() => {
  if (tabKeys.length < 2 || tabKeys.length > 4) return false
  const labels = tabKeys.map(tabLabel)
  const total = labels.reduce((sum, l) => sum + l.length, 0)
  const longest = labels.reduce((max, l) => Math.max(max, l.length), 0)
  return total <= 80 && longest <= 34
})

const useButtons = computed(() => !props.dropdown && (props.buttons || autoButtons.value))

// Same choice, asked once per page: every TableTabs with the same set of tabs
// (RPM/DEB/APK, Built-in/Loadable, …) shares one value, and the value is
// remembered across pages.
const groupKey = tabKeys.join('|')

const tabRefs = ref([])

function onTabKeydown(event, index) {
  let next = null
  if (event.key === 'ArrowRight') next = (index + 1) % tabKeys.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabKeys.length) % tabKeys.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabKeys.length - 1
  if (next === null) return
  event.preventDefault()
  activeTab.value = tabKeys[next]
  nextTick(() => tabRefs.value[next]?.focus())
}

// Without a visible label, name the control after the section it sits in
// (the nearest preceding heading), falling back to a generic name.
const fallbackName = ref('Select table view')
const selectName = computed(() => props.label ? undefined : (props.ariaLabel || fallbackName.value))
const groupName = computed(() => props.label || props.ariaLabel || fallbackName.value)

function nearestHeadingText(el) {
  let node = el
  while (node && node !== document.body) {
    let sib = node.previousElementSibling
    while (sib) {
      if (/^H[1-6]$/.test(sib.tagName)) {
        return sib.textContent.replace(/^#\s*/, '').trim()
      }
      sib = sib.previousElementSibling
    }
    node = node.parentElement
  }
  return ''
}

onMounted(() => {
  if (!props.label && !props.ariaLabel && wrapperRef.value) {
    const heading = nearestHeadingText(wrapperRef.value)
    if (heading) fallbackName.value = `${heading}: select table view`
  }

  // A deep link wins over the remembered choice.
  const hash = decodeURIComponent(window.location.hash.slice(1))
  if (tabKeys.includes(hash)) {
    activeTab.value = hash
    nextTick(() => {
      const el = wrapperRef.value
      if (el) {
        const offset = 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
    return
  }

  const remembered = groupChoice(groupKey) ?? storedGroupChoice(groupKey)
  if (tabKeys.includes(remembered)) activeTab.value = remembered
})

// Follow the other blocks of this group when one of them changes.
watch(() => groupChoice(groupKey), (value) => {
  if (tabKeys.includes(value)) activeTab.value = value
})

watch(activeTab, (newVal) => {
  if (!newVal) return
  setGroupChoice(groupKey, newVal)
  // Only the long sets still own the URL hash: the short ones are now button
  // rows, and having a dozen of them rewrite the hash broke heading anchors.
  if (!useButtons.value) {
    history.replaceState(null, '', `#${encodeURIComponent(newVal)}`)
  }
})
</script>

<template>
  <div ref="wrapperRef" class="table-tabs">
    <div class="tab-header">
      <label v-if="label && !useButtons" :for="selectId" class="label-text">
        {{ label }}
      </label>
      <span v-else-if="label" class="label-text">
        {{ label }}
      </span>

      <div v-if="useButtons" class="tab-buttons" role="tablist" :aria-label="groupName">
        <button
          v-for="(key, index) in tabKeys"
          :key="key"
          :ref="(el) => { if (el) tabRefs[index] = el }"
          :id="`${selectId}-tab-${index}`"
          type="button"
          role="tab"
          :aria-selected="activeTab === key ? 'true' : 'false'"
          :aria-controls="`${selectId}-panel`"
          :tabindex="activeTab === key ? 0 : -1"
          :class="{ active: activeTab === key }"
          @click="activeTab = key"
          @keydown="onTabKeydown($event, index)"
        >
          {{ tabLabel(key) }}
        </button>
      </div>

      <select
        v-else
        :id="selectId"
        v-model="activeTab"
        class="tab-select"
        :aria-label="selectName"
        :aria-controls="`${selectId}-panel`"
      >
        <option v-for="key in tabKeys" :key="key" :value="key">
          {{ tabLabel(key) }}
        </option>
      </select>
    </div>

    <div
      class="tab-content"
      :id="`${selectId}-panel`"
      :role="useButtons ? 'tabpanel' : undefined"
      :aria-labelledby="useButtons ? `${selectId}-tab-${tabKeys.indexOf(activeTab)}` : undefined"
    >
      <slot :name="currentTab" />
    </div>
  </div>
</template>


<style scoped>
/* The control and the content it switches are one bordered block, so the start
   and the end of the switchable region are always visible. Neutral on purpose:
   a tinted panel reads as a callout next to .tip / .warning blocks. */
.table-tabs {
  background: #fff;
  border: 1px solid #dde2e8;
  border-radius: 10px;
  overflow: hidden;
  margin: 1.25rem 0;
  scroll-margin-top: 4rem;
}

.tab-header {
  display: flex; align-items: center; gap: .55rem; flex-wrap: wrap;
  background: #f6f8fa;
  border-bottom: 1px solid #e4e8ed;
  padding: .5rem .85rem;
}

.label-text {
  color: #5c6a7a;
  font-size: .75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.tab-content {
  padding: .85rem .85rem .35rem;
}

.tab-content :deep(p:first-child),
.tab-content :deep(ul:first-child),
.tab-content :deep(ol:first-child),
.tab-content :deep(h4:first-child),
.tab-content :deep(h5:first-child) {
  margin-top: 0;
}

/* A nested block keeps a white header so the two levels stay distinguishable. */
.tab-content :deep(.table-tabs) {
  margin: .75rem 0;
}

.tab-content :deep(.table-tabs > .tab-header) {
  background: #fff;
}

.tab-select {
  appearance: none; -webkit-appearance: none; cursor: pointer;
  font-size: .85rem; font-weight: 600; color: #163055;
  background: #fff url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="%23163055" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
    no-repeat right .7rem center;
  padding: .35rem 2.1rem .35rem .65rem;
  border: 1px solid #c3cad3; border-radius: 6px;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.tab-select:hover { border-color: #0b5cad; box-shadow: 0 1px 3px rgba(22, 48, 85, .14); }

/* Outline (not box-shadow only) so the ring survives forced-colors mode and
   reaches 3:1 against the light header (WCAG 2.4.7, 1.4.11). */
.tab-select:focus-visible {
  outline: 2px solid #0b5cad; outline-offset: 2px;
  border-color: #0b5cad;
}

@media (forced-colors: active) {
  .tab-select:focus-visible { outline-color: Highlight; }
}

/* Segmented toggle, same language as the WhatsNext version switcher and the
   CodeTabs row (light pill, active tab white with a dark underline bar). */
.tab-buttons {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  background: #e9edf2;
  border-radius: 7px;
  padding: 3px;
}

.tab-buttons button {
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 5px;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: #55606e;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tab-buttons button:hover {
  color: #1b1f27;
}

/* Selected state needs a non-colour cue with >= 3:1 contrast (WCAG 1.4.11). */
.tab-buttons button.active {
  background: #fff;
  color: #12243d;
  box-shadow: inset 0 -2px 0 #163055, 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tab-buttons button:focus-visible {
  outline: 2px solid #0b5cad;
  outline-offset: 1px;
}

/* box-shadow is dropped in forced-colors mode; keep a visible selected cue. */
@media (forced-colors: active) {
  .tab-buttons button.active {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
}

.tab-content :deep(.els-steps) {
  margin-top: 0.5rem;
  padding-top: 0;
}

.tab-content :deep(table) {
  margin-top: 0;
}
</style>
