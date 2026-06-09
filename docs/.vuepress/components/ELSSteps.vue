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
    // On the left of the step title (prepended), vertically aligned with it.
    const target = titleEl ?? li;
    target.insertBefore(anchor, target.firstChild);

    // Transparent overlay over the number badge so clicking the number also
    // navigates to the step's anchor and updates the URL.
    const numberLink = document.createElement('a');
    numberLink.className = 'els-step-number';
    numberLink.setAttribute('href', `#${id}`);
    numberLink.setAttribute('aria-hidden', 'true');
    numberLink.setAttribute('tabindex', '-1');
    li.appendChild(numberLink);
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
  padding-left: 1.2rem;
  padding-bottom: 1.25rem;
  margin-bottom: 0;
  border-left: 2px solid #e0e3e8;
  margin-left: 0.9rem;
  /* Land below the fixed navbar when navigated to via a step anchor. */
  scroll-margin-top: 6rem;
}

/* The anchor floats left at its natural position (no negative margin, so it
   never overlaps the number badge), with a fixed width and a minimal gap.
   font-size in rem (not em) keeps it identical to the prerequisites anchor. */
.els-steps-body :deep(ol > li > p:first-child > a.els-step-anchor) {
  opacity: 0;
  font-size: 1rem;
  width: 0.7rem;
  padding-right: 0;
  margin-left: 0;
  transition: opacity 0.15s ease;
}

.els-steps-body :deep(ol > li:hover > p:first-child > a.els-step-anchor) {
  opacity: 1;
}

/* Indent the step's body content (everything below the title) by the anchor's
   reserved width so it aligns with the title wording. margin-left (not padding)
   so code blocks move as a whole and their background aligns too. Exclude the
   absolutely positioned number-overlay link. */
.els-steps-body :deep(ol > li > *:not(:first-child):not(a)) {
  margin-left: 0.7rem;
}

/* Transparent overlay over the number badge — makes the number clickable. */
.els-steps-body :deep(ol > li > a.els-step-number) {
  position: absolute;
  left: -1rem;
  top: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
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
  transition: background 0.15s ease;
}

/* Hover hint on the step: the number badge changes color. */
.els-steps-body :deep(ol > li:hover::before) {
  background: #0B5CAD;
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
  /* top/bottom only — left indent comes from the body-content rule above so
     the code block aligns with the step wording. */
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.els-steps-body :deep(:not(pre) > code) {
  font-size: 0.85rem;
}
</style>
