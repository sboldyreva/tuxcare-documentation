<template>
  <div class="home-hub">
    <p class="home-hub__lead">{{ intro }}</p>

    <section class="home-hub__section" aria-labelledby="home-products-title">
      <h2 id="home-products-title" class="home-hub__heading">What do you want to do?</h2>
      <div class="home-groups">
        <section
            v-for="(group, gi) in groups"
            :key="group.title"
            class="home-group"
            :aria-labelledby="`home-group-${gi}`"
        >
          <h3 :id="`home-group-${gi}`" class="home-group__title">{{ group.title }}</h3>
          <ul class="home-group__list">
            <li v-for="product in group.products" :key="product.link" class="home-product">
              <p class="home-product__task">{{ product.task }}</p>
              <router-link :to="product.link" class="home-product__title">{{ product.title }}<span aria-hidden="true"> &rarr;</span></router-link>
              <p class="home-product__description">{{ product.description }}</p>
              <ul v-if="product.links?.length" class="home-product__links" :aria-label="`${product.title} quick links`">
                <li v-for="item in product.links" :key="item.link">
                  <router-link :to="item.link">{{ item.text }}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </div>
    </section>

    <section class="home-hub__section home-resources" aria-labelledby="home-resources-title">
      <h2 id="home-resources-title" class="home-hub__heading">Resources</h2>
      <ul class="home-resources__list">
        <li v-for="item in resources" :key="item.link">
          <a
              :href="item.link"
              v-bind="isWeb(item.link) ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          >{{ item.text }}<span v-if="isWeb(item.link)" class="sr-only"> (opens in new tab)</span></a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { intro, groups, resources } from "../../config-client/home";

const isWeb = (link) => link.startsWith("http");
</script>

<style lang="stylus">
@import '../../styles/config.styl'

.home-hub
  max-width 1170px
  margin 0 auto 8rem
  padding 0 1.25rem
  color $textColor

  &__lead
    max-width 46rem
    font-size 1.0625rem
    line-height 1.6
    margin 0

  &__section
    margin-top 2.75rem

  &__heading
    font-size 1.25rem
    color $cardParagraphColor
    margin 0 0 1rem
    padding 0
    border-bottom none

.home-hub ul
  list-style none
  margin 0
  padding 0

.home-groups
  columns 3 300px
  column-gap 1.25rem

.home-group
  break-inside avoid
  margin-bottom 1.25rem
  padding 1.25rem
  border 1px solid $cardBorderColor
  border-radius $cardBorderRadius

  &__title
    font-size 0.8125rem
    text-transform uppercase
    letter-spacing 0.06em
    color $gray-500
    margin 0 0 1rem

  &__list > li + li
    margin-top 1rem
    padding-top 1rem
    border-top 1px solid $borderColor

.home-product
  &__task
    font-weight 600
    color $cardParagraphColor
    line-height 1.4
    margin 0 0 0.25rem

  &__title
    font-size $text-default
    font-weight 500
    color $colorLink
    text-decoration none

    &:hover
      color $colorLink
      text-decoration underline

  &__description
    font-size $text-default
    line-height 1.5
    margin 0.25rem 0 0

  &__links
    display flex
    flex-wrap wrap
    gap 0.25rem 1rem
    margin-top 0.5rem !important
    font-size $text-default

    a
      color $colorLink

.home-resources__list
  display flex
  flex-wrap wrap
  gap 0.5rem 1.5rem

  a
    color $colorLink
    font-weight 500

@media (max-width: $mobileBreakpoint)
  .home-hub
    margin-bottom 4rem
</style>
