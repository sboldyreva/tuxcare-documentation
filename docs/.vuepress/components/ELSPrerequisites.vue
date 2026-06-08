<template>
  <div ref="rootRef" class="prereqs">
    <div class="prereqs-header">
      <h4 ref="headingRef"><slot name="title">Prerequisites</slot></h4>
    </div>
    <div class="prereqs-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { slugify, uniqueId, collectUsedIds } from '../utils/slugify';

const rootRef = ref<HTMLElement | null>(null);
const headingRef = ref<HTMLElement | null>(null);

function anchorPrerequisites() {
  const heading = headingRef.value;
  if (!heading || heading.id) return;

  const used = collectUsedIds();
  const id = uniqueId(slugify(heading.textContent ?? '') || 'prerequisites', used);
  heading.id = id;

  const anchor = document.createElement('a');
  anchor.className = 'header-anchor prereq-anchor';
  anchor.setAttribute('href', `#${id}`);
  anchor.setAttribute('aria-hidden', 'true');
  anchor.setAttribute('tabindex', '-1');
  anchor.textContent = '#';
  heading.appendChild(anchor);
}

onMounted(() => {
  // Run after VuePress has assigned heading ids.
  setTimeout(anchorPrerequisites, 0);
});
</script>

<style scoped>
.prereqs {
  border-radius: 10px;
  border: 1px solid #D9EDFF;
  background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
  /* Land below the fixed navbar when navigated to via the section anchor. */
  scroll-margin-top: 6rem;
}

.prereqs-header h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1b1f27;
}

/* Anchor affordance: hidden until the header is hovered, like header anchors. */
.prereqs-header h4 :deep(a.prereq-anchor) {
  opacity: 0;
  /* Override the global header-anchor float so the # sits inline after the
     wording instead of being pushed to the far left. */
  float: none;
  display: inline;
  vertical-align: middle;
  margin-left: 0.35em;
  font-weight: 700;
  font-size: 1.4em;
  line-height: 1;
  color: #0B5CAD;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.prereqs-header h4:hover {
  cursor: pointer;
  color: #0B5CAD;
}

.prereqs-header h4:hover :deep(a.prereq-anchor) {
  opacity: 1;
}

.prereqs-body :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.prereqs-body :deep(ul li) {
  position: relative;
  padding-left: 1.5rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  font-size: 0.92rem;
  color: #374151;
  line-height: 1.6;
}

.prereqs-body :deep(ul li::before) {
  content: "\2713";
  position: absolute;
  left: 0;
  top: 0.2rem;
  color: #16a34a;
  font-weight: 700;
  font-size: 0.92rem;
  line-height: 1.6;
}

.prereqs-body :deep(p) {
  margin: 0.25rem 0;
  font-size: 0.92rem;
  color: #374151;
}

.prereqs-body :deep(code) {
  background: rgba(37, 99, 235, 0.08);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.prereqs-body :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.prereqs-body :deep(a:hover) {
  text-decoration: underline;
}
</style>
