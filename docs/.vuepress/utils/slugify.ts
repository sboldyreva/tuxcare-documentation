/**
 * Shared slug helper for anchor ids.
 *
 * Mirrors the rule used by VuePress markdown anchors in `config.ts`
 * (strip ® / ™, lowercase, spaces -> "-") so component-generated anchors
 * (steps, prerequisites) behave exactly like heading anchors. Additionally
 * strips characters that aren't url/id-safe and collapses repeated hyphens.
 */
export function slugify(str: string): string {
  return str
    .replace(/®/g, '')
    .replace(/™/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // drop non url-safe chars
    .replace(/\s+/g, '-')         // spaces -> hyphens
    .replace(/-+/g, '-')          // collapse repeats
    .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens
}

/**
 * Returns `base` if unused, otherwise appends -1, -2, ... until unique.
 * Records the chosen id in `used` (mutates the set). Same dedupe behavior
 * as markdown-it-anchor so step/prereq ids never collide with each other
 * or with heading anchors already present on the page.
 */
export function uniqueId(base: string, used: Set<string>): string {
  const safeBase = base || 'section';
  let id = safeBase;
  let i = 0;
  while (used.has(id)) {
    i += 1;
    id = `${safeBase}-${i}`;
  }
  used.add(id);
  return id;
}

/**
 * Seeds a "used ids" set from every element already carrying an id within
 * the given root (defaults to the whole document). Lets runtime-generated
 * anchors avoid colliding with VuePress heading anchors and other blocks.
 */
export function collectUsedIds(root: ParentNode = document): Set<string> {
  const used = new Set<string>();
  root.querySelectorAll('[id]').forEach((el) => {
    const id = el.getAttribute('id');
    if (id) used.add(id);
  });
  return used;
}
