<template>
  <div class="els-steps">
    <div ref="bodyRef" class="els-steps-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { slugify, uniqueId, collectUsedIds } from '../utils/slugify';

const bodyRef = ref<HTMLElement | null>(null);

function anchorSteps() {
  const body = bodyRef.value;
  if (!body) return;

  // Seed from ids already on the page so step anchors never collide with
  // heading anchors or other <ELSSteps> blocks on the same page.
  const used = collectUsedIds();

  // Top-level steps only — leave nested sub-steps (ol ol > li) un-anchored.
  body.querySelectorAll<HTMLLIElement>(':scope > ol > li').forEach((li) => {
    if (li.id) return; // already processed

    const titleEl = li.querySelector('p');
    const title = titleEl?.textContent ?? li.textContent ?? '';
    const id = uniqueId(slugify(title) || 'step', used);
    li.id = id;

    const anchor = document.createElement('a');
    anchor.className = 'header-anchor els-step-anchor';
    anchor.setAttribute('href', `#${id}`);
    anchor.setAttribute('aria-hidden', 'true');
    anchor.setAttribute('tabindex', '-1');
    anchor.textContent = '#';
    // Inline with the step title when present, else at the end of the step.
    (titleEl ?? li).appendChild(anchor);
  });
}

onMounted(() => {
  // Run after VuePress has assigned heading ids.
  setTimeout(anchorSteps, 0);
});
</script>

<style scoped>
.els-steps {
  margin: 1.5rem 0;
  padding-top: 1.25rem;
}

.els-steps-body :deep(ol) {
  list-style: none;
  counter-reset: step-counter;
  margin: 1rem 0;
  padding-left: 0;
}

.els-steps-body :deep(ol > li) {
  counter-increment: step-counter;
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 1.25rem;
  margin-bottom: 0;
  border-left: 2px solid #e0e3e8;
  margin-left: 0.9rem;
  /* Land below the fixed navbar when navigated to via a step anchor. */
  scroll-margin-top: 6rem;
}

/* Anchor affordance: hidden until the step is hovered, like header anchors. */
.els-steps-body :deep(ol > li > p:first-child > a.els-step-anchor) {
  opacity: 0;
  margin-left: 0.35em;
  font-weight: 700;
  color: #0B5CAD;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.els-steps-body :deep(ol > li:hover > p:first-child > a.els-step-anchor) {
  opacity: 1;
}

/* Hover hint on the step itself: title grows slightly and changes color. */
.els-steps-body :deep(ol > li > p:first-child) {
  transition: color 0.15s ease, font-size 0.15s ease;
}

.els-steps-body :deep(ol > li:hover > p:first-child) {
  color: #0B5CAD;
  font-size: 1.05rem;
}

.els-steps-body :deep(ol > li:last-child) {
  border-left-color: transparent;
  padding-bottom: 0;
}

.els-steps-body :deep(ol > li::before) {
  content: counter(step-counter);
  position: absolute;
  left: -1rem;
  top: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #163055;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.els-steps-body :deep(ol > li > p:first-child) {
  font-weight: 600;
  color: #0d1a26;
  margin-top: 0;
}

.els-steps-body :deep(ol > li > p) {
  margin: 0.25rem 0 0.5rem 0;
}

.els-steps-body :deep(ol ol) {
  counter-reset: step-counter;
  margin: 0.5rem 0;
}

.els-steps-body :deep(ol ol > li) {
  margin-left: 0;
  padding-left: 2.5rem;
  border-left-color: #eef0f2;
}

.els-steps-body :deep(ol ol > li::before) {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  left: -0.75rem;
  background: #5c6370;
}

.els-steps-body :deep(div[class*="language-"]),
.els-steps-body :deep(.code-with-copy) {
  margin: 0.5rem 0;
}

.els-steps-body :deep(:not(pre) > code) {
  font-size: 0.85rem;
}
</style>
