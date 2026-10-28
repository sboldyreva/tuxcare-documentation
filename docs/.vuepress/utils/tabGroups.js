import { reactive } from 'vue'

// Shared across every TableTabs instance on the page: blocks that offer the
// same set of tabs (RPM/DEB/APK, Built-in/Loadable, …) answer one question
// once instead of asking it again at every section.
// Written only from client-side interaction, so SSR never touches it.
const choices = reactive({})

const storageKey = (group) => `tuxcare-docs:table-tabs:${group}`

export function groupChoice(group) {
  return choices[group]
}

export function setGroupChoice(group, value) {
  choices[group] = value
  try {
    window.localStorage.setItem(storageKey(group), value)
  } catch {
    /* private mode or blocked storage: syncing within the page still works */
  }
}

export function storedGroupChoice(group) {
  try {
    return window.localStorage.getItem(storageKey(group))
  } catch {
    return null
  }
}
