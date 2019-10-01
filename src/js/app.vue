<template>
  <div id="app">
    <component-nav />
    <div class="router-view">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <component-footer />
  </div>
</template>

<script>
import componentNav from "components/nav.vue"
import componentFooter from "components/footer.vue"
export default {
  components: {
    componentNav,
    componentFooter
  }
}
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  font-family: var(--font-global);
  background: var(--background-main);
  @include mobile {
    touch-action: pan-y;
  }
}

.router-view {
  z-index: 2;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
