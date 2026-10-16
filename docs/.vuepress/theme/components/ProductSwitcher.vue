<template>
  <div ref="root"
       class="product-switcher"
       :class="{'product-switcher--open': open}"
       @keydown.esc="onEscape"
       @focusout="onFocusOut">
    <button type="button"
            ref="trigger"
            class="product-switcher__trigger"
            :aria-expanded="open"
            :aria-controls="panelId"
            @click="toggle"
            @keydown.down.prevent="openAndFocus(0)"
            @keydown.up.prevent="openAndFocus(-1)">
      <span class="product-switcher__current">
        <span class="sr-only">TuxCare docs, current product: </span>
        <span v-if="currentGroup" class="product-switcher__eyebrow">{{ currentGroup.title }}</span>
        <span v-if="current" class="product-switcher__title">{{ current.title }}</span>
        <!-- Pages outside any product (e.g. /tuxcare/) have no current product. -->
        <span v-else class="product-switcher__title product-switcher__title--placeholder">Choose product docs</span>
      </span>
      <svg class="product-switcher__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <!-- Stays in the DOM (v-show) so aria-controls always points to it. -->
    <div v-show="open"
         :id="panelId"
         ref="panel"
         class="product-switcher__panel"
         :style="panelStyle"
         @keydown="onPanelKeydown">
      <div v-for="group in groups" :key="group.id" class="product-switcher__group">
        <p :id="`${panelId}-${group.id}`" class="product-switcher__group-title">{{ group.title }}</p>
        <ul :aria-labelledby="`${panelId}-${group.id}`">
          <li v-for="item in group.items" :key="item.link">
            <RouterLink :to="item.link"
                        class="product-switcher__item"
                        :class="{'product-switcher__item--current': item.link === current?.link}"
                        :aria-current="item.link === current?.link ? 'true' : undefined"
                        @click="close(false)">
              <span class="product-switcher__item-title">{{ item.title }}</span>
              <span v-if="item.summary" class="product-switcher__item-summary">{{ item.summary }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {productGroups} from "../productNav";

const props = defineProps({
  // The product whose docs are shown (see findCurrentProduct), or null.
  current: {
    type: Object,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  // Keeps ids unique when the desktop sidebar and the mobile drawer both render one.
  idPrefix: {
    type: String,
    default: 'product-switcher'
  }
})

const panelId = `${props.idPrefix}-panel`
const open = ref(false)
const root = ref(null)
const trigger = ref(null)
const panel = ref(null)

const groups = computed(() => productGroups(props.options))
const currentGroup = computed(() => groups.value.find(group => group.items.some(item => item.link === props.current?.link)))

// On desktop the panel is wider than the sidebar, which clips overflow, so it is
// fixed-positioned under the button. In the mobile drawer it opens in place (CSS).
const panelStyle = ref({})
const DESKTOP_QUERY = '(min-width: 768px)'
const placePanel = () => {
  if (!open.value || !trigger.value || !window.matchMedia(DESKTOP_QUERY).matches) {
    panelStyle.value = {}
    return
  }
  const rect = trigger.value.getBoundingClientRect()
  const top = rect.bottom + 6
  panelStyle.value = {
    top: `${top}px`,
    left: `${rect.left}px`,
    maxHeight: `${window.innerHeight - top - 16}px`,
  }
}
watch(open, placePanel)

const getLinks = () => [...(panel.value?.querySelectorAll('a') || [])]

const toggle = () => {
  open.value = !open.value
}

const close = (restoreFocus = false) => {
  if (!open.value) return
  open.value = false
  if (restoreFocus) trigger.value?.focus()
}

// Arrow keys on the button open the list and move to the first (0) or last (-1) product.
const openAndFocus = async (index) => {
  open.value = true
  await nextTick()
  getLinks().at(index)?.focus()
}

// Arrow keys / Home / End move between products; Tab keeps its normal order.
const onPanelKeydown = (event) => {
  const links = getLinks()
  const index = links.indexOf(document.activeElement)
  const target = {
    ArrowDown: links[index + 1] || links[0],
    ArrowUp: links[index - 1] || links[links.length - 1],
    Home: links[0],
    End: links[links.length - 1],
  }[event.key]
  if (!target) return
  event.preventDefault()
  target.focus()
}

// Escape closes the list and stays on the button; it does not reach the mobile
// drawer, which would close as well.
const onEscape = (event) => {
  if (!open.value) return
  event.stopPropagation()
  close(true)
}

// Close when keyboard focus leaves the switcher. A null relatedTarget (a click on
// non-focusable space) is left to the outside-click handler.
const onFocusOut = (event) => {
  if (event.relatedTarget && !root.value?.contains(event.relatedTarget)) close()
}

const onDocumentClick = (event) => {
  if (!root.value?.contains(event.target)) close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('resize', placePanel)
  // The sidebar scrolls on its own; keep the panel under the button.
  document.addEventListener('scroll', placePanel, true)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', placePanel)
  document.removeEventListener('scroll', placePanel, true)
})
</script>

<style lang="stylus">
@import '../../styles/config.styl'

.product-switcher
  position relative

  &__trigger
    display flex
    align-items center
    justify-content space-between
    gap 0.75rem
    width 100%
    min-height 3rem
    padding 0.4375rem 0.875rem 0.4375rem 0.75rem
    border 1px solid $selectBorderColor
    border-radius $selectBorderRadius
    background white
    font inherit
    color $layoutParagraphColor
    text-align left
    cursor pointer

    &:hover
      border-color darken($selectBorderColor, 15%)

    &:focus-visible
      outline 2px solid $accentColor
      outline-offset 2px

  &__current
    display flex
    flex-direction column
    min-width 0

  &__eyebrow
    font-size 0.75rem
    line-height 1rem
    color $gray-500

  &__title
    font-size 0.9375rem
    font-weight 600
    line-height 1.25rem
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  // #6b7280 on white is 4.8:1 (WCAG 1.4.3).
  &__title--placeholder
    font-weight 500
    color #6b7280

  &__chevron
    flex none
    color $gray-500
    transition transform 200ms

  &--open &__chevron
    transform rotate(180deg)

  &__panel
    position fixed
    z-index 1000
    width 36rem
    max-width calc(100vw - 2.5rem)
    overflow-y auto
    column-count 2
    column-gap 0
    padding 0.5rem 0
    background white
    border 1px solid $selectBorderColor
    border-radius $selectBorderRadius
    box-shadow 0 0.75rem 1.5rem rgba(13, 30, 48, 0.16)

  &__group
    padding 0.25rem 0 0.5rem
    break-inside avoid

    ul
      margin 0
      padding 0
      list-style none

  &__group-title
    margin 0
    padding 0.5rem 1rem 0.25rem
    font-size 0.6875rem
    font-weight 600
    line-height 1rem
    letter-spacing 0.04em
    text-transform uppercase
    color $gray-500

  &__item
    display flex !important
    flex-direction column
    gap 0.125rem
    padding 0.4375rem 1rem 0.4375rem 0.875rem
    border-left 2px solid transparent
    color $layoutParagraphColor
    text-decoration none

    &:hover
      background $sidebarBgColor

    &:focus-visible
      outline 2px solid $accentColor
      outline-offset -2px

    &--current
      border-left-color $accentColor
      background $alice-blue

  &__item-title
    font-size 0.875rem
    font-weight 500
    line-height 1.25rem

  &__item--current &__item-title
    color $accentColor
    font-weight 600

  &__item-summary
    font-size 0.75rem
    line-height 1rem
    color $gray-500

// In the mobile drawer the list opens in place and pushes the docs menu down.
@media (max-width: $mobileBreakpoint)
  .product-switcher__panel
    position static
    width auto
    column-count 1
    margin-top 0.375rem
    box-shadow none

  .product-switcher__group + .product-switcher__group
    border-top 1px solid $borderColor
</style>
