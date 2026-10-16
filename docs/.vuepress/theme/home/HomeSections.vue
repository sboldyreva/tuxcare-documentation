<template>
  <div class="home-sections">
    <section class="home-section" aria-labelledby="home-get-started">
      <h2 id="home-get-started" class="home-section__title">Get started</h2>
      <p class="home-section__lead">Common first steps with TuxCare products.</p>
      <ul class="home-quickstarts">
        <li v-for="item in quickStarts" :key="item.link" class="home-card">
          <span class="home-card__eyebrow">{{ item.product }}</span>
          <RouterLink :to="item.link" class="home-card__link">{{ item.title }}</RouterLink>
          <p class="home-card__text">{{ item.description }}</p>
          <span class="home-card__arrow" aria-hidden="true">&rarr;</span>
        </li>
      </ul>
    </section>

    <section class="home-section" aria-labelledby="home-products">
      <h2 id="home-products" class="home-section__title">Browse by product</h2>
      <div class="home-products">
        <div v-for="group in groups" :key="group.id" class="home-products__group">
          <h3 :id="`home-group-${group.id}`" class="home-products__group-title">{{ group.title }}</h3>
          <ul :aria-labelledby="`home-group-${group.id}`">
            <li v-for="item in group.items" :key="item.link" class="home-product">
              <RouterLink :to="item.link" class="home-product__link">{{ item.title }}</RouterLink>
              <p v-if="item.summary" class="home-product__text">{{ item.summary }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="home-resources">
      <h2 id="home-resources" class="home-section__title">Resources and support</h2>
      <ul class="home-resources">
        <li v-for="item in resources" :key="item.link" class="home-card home-card--compact">
          <a v-if="isExternal(item.link)"
             :href="item.link"
             target="_blank"
             rel="noopener noreferrer"
             class="home-card__link">{{ item.title }}<span class="sr-only"> (opens in new tab)</span></a>
          <RouterLink v-else :to="item.link" class="home-card__link">{{ item.title }}</RouterLink>
          <p class="home-card__text">{{ item.description }}</p>
          <span class="home-card__arrow" aria-hidden="true">{{ isExternal(item.link) ? '↗' : '→' }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import {inject} from "vue";
import {productGroups} from "../productNav";
import {quickStarts, resources} from "../../config-client/homePage";

const {documents} = inject('themeConfig')

const isExternal = (link) => /^https?:\/\//.test(link)

// Same grouping as the sidebar product switcher.
const groups = productGroups(documents)
</script>

<style lang="stylus">
@import '../../styles/config.styl'

$homeMaxWidth = 1170px

.home-sections
  max-width $homeMaxWidth
  margin 0 auto
  padding 3rem 1.5rem 6rem

  ul
    margin 0
    padding 0
    list-style none

.home-section
  & + &
    margin-top 3.5rem

  &__title
    margin 0 0 0.375rem
    padding 0
    border 0
    font-size 1.5rem
    font-weight 600
    line-height 2rem
    color $layoutParagraphColor

  &__lead
    margin 0 0 1.25rem
    font-size 1rem
    line-height 1.5rem
    color $textColor

.home-quickstarts, .home-resources
  display grid
  grid-template-columns repeat(4, 1fr)
  gap 1rem

.home-resources
  grid-template-columns repeat(3, 1fr)
  margin-top 1.25rem

// A card whose title link covers the whole card (see .home-card__link::after).
.home-card
  position relative
  display flex
  flex-direction column
  gap 0.375rem
  padding 1.25rem 1.25rem 2.75rem
  border 1px solid $cardBorderColor
  border-radius 0.5rem
  background white
  transition border-color 0.2s ease, box-shadow 0.2s ease

  &:hover
    border-color $buttonColorBg
    box-shadow 0 4px 16px rgba(22, 48, 85, 0.1)

  &:hover .home-card__arrow
    transform translateX(3px)

  // Ring on the whole card for keyboard focus only.
  &:has(.home-card__link:focus-visible)
    outline 2px solid $accentColor
    outline-offset 2px

  &--compact
    padding-bottom 2.5rem

  &__eyebrow
    font-size 0.75rem
    font-weight 600
    line-height 1rem
    color $accentColor

  &__link
    font-size 1rem
    font-weight 600
    line-height 1.375rem
    color $layoutParagraphColor
    text-decoration none

    &::after
      content ""
      position absolute
      inset 0

  &__text
    margin 0
    font-size $text-default
    line-height 1.3125rem
    color $textColor
    // Above the stretched link so the text can be selected and copied.
    position relative
    z-index 1
    cursor text

  &__arrow
    position absolute
    left 1.25rem
    bottom 1rem
    font-size 1.125rem
    line-height 1
    color $accentColor
    transition transform 0.2s ease

@css {
  @supports selector(:has(*)) {
    .home-card .home-card__link:focus-visible {
      outline: none;
    }
  }
}

.home-products
  display grid
  grid-template-columns repeat(3, 1fr)
  gap 2rem 2.5rem
  margin-top 1.25rem

  &__group-title
    margin 0 0 0.75rem
    padding-bottom 0.5rem
    border-bottom 1px solid $borderColor
    font-size 0.75rem
    font-weight 600
    line-height 1rem
    letter-spacing 0.04em
    text-transform uppercase
    color $gray-500

.home-product
  & + &
    margin-top 0.875rem

  &__link
    font-size 0.9375rem
    font-weight 600
    line-height 1.375rem
    color $colorLink
    text-decoration none

    &:hover
      text-decoration underline

  &__text
    margin 0.125rem 0 0
    font-size $text-default
    line-height 1.25rem
    color $textColor

@media (max-width: 1023px)
  .home-quickstarts, .home-resources
    grid-template-columns repeat(2, 1fr)

  .home-products
    grid-template-columns repeat(2, 1fr)

@media (max-width: $mobileBreakpoint)
  .home-sections
    padding 2rem 1.25rem 4rem

  .home-section + .home-section
    margin-top 2.5rem

  .home-quickstarts, .home-resources, .home-products
    grid-template-columns 1fr
</style>
