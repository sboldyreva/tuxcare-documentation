<template>
  <div class="theme-container">
    <a class="skip-link" href="#main-content" :inert="isDrawerOpen || undefined">Skip to content</a>
    <HeaderLayout  :closeSidebarDrawer="pageRef?.closeSidebarDrawer" :isMobileWidth="isMobileWidth"/>
    <Sidebar
        v-if="allPages.length && !pageRef?.isOpenMobileSidebarMenu && !isMobileWidth"
        :items="allPages"
        :closeSidebarDrawer="pageRef?.closeSidebarDrawer"
    >
      <template #top>
        <div v-if="documents" class="sidebar-header">
          <ProductSwitcher :current="currentDocument" :options="documents"/>
        </div>
      </template>
    </Sidebar>
    <!-- While the mobile drawer (a modal dialog) is open, the page behind it is inert. -->
    <Page ref="pageRef"
          :inert="isDrawerOpen || undefined"
          :sidebarItems="sidebarItems"
          :allPages="allPages"
          :isMobileWidth="isMobileWidth"
    />
    <SidebarDrawer
        v-if="isDrawerOpen"
        :all-pages="allPages"
        :documents="documents"
        :currentDocument="currentDocument"
        :closeSidebarDrawer="pageRef?.closeSidebarDrawer"
        :isMobileWidth="isMobileWidth"
    />
    <Footer :inert="isDrawerOpen || undefined"/>
    <div class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
  </div>
</template>

<script setup>
import Footer from '../footer/Footer.vue'
import Sidebar from "../sidebar/Sidebar.vue";
import SidebarDrawer from "../sidebar/SidebarDrawer.vue";
import HeaderLayout from "../header/HeaderLayout.vue";
import Page from "../components/Page.vue";
import ProductSwitcher from "../components/ProductSwitcher.vue";
import {useRoute} from "vue-router";
import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import { usePageData } from "@vuepress/client";
import {pagesData} from "../../.temp/internal/pagesData.js";
import {resolveSidebarItems} from "../util.js";
import {findCurrentProduct} from "../productNav";
import {useRouteAnnouncer} from "../composables/useRouteAnnouncer";

const { documents,MOBILE_BREAKPOINT } = inject('themeConfig')

const pageRef = ref(null);
const route = useRoute();
const page = usePageData()
const allPages = ref([])

const isMobileWidth = ref(false);
const isDrawerOpen = computed(() => !!(allPages.value.length && pageRef.value?.isOpenMobileSidebarMenu && isMobileWidth.value))
// Focus can't move into the inert page while the drawer is open.
const {announcement} = useRouteAnnouncer(() => !isDrawerOpen.value)
const sidebarItems = computed(() => page.value && allPages.value.length ? resolveSidebarItems(page.value, route, allPages.value) : [])

// The product whose docs are open: the one whose section ("/eportal/") holds the page.
const currentDocument = computed(() => findCurrentProduct(documents, route.path))

const handleResize = () => {
  isMobileWidth.value = window.innerWidth <= MOBILE_BREAKPOINT;
};

onMounted(() => {
  Object.values(pagesData).map(f => f().then(res => {
    allPages.value.push(res)
  }))
  window.addEventListener('resize', handleResize);
  isMobileWidth.value = window.innerWidth <= MOBILE_BREAKPOINT;
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>
<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../../styles/theme.styl" lang="stylus"></style>
<style lang="stylus">
@import "../../styles/config.styl";
.sidebar-header
  padding 1.25rem 0.625rem 0.5rem 1.25rem
</style>