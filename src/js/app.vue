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
//import baseComponent from "components/baseComponent.vue"
export default {
  components: {
    componentNav,
    componentFooter
    //baseComponent
  }
}
</script>

<style lang="scss" scoped>
#app {
  @include mobile {
    overflow-x: hidden;
  }
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  font-family: var(--font-global);
  @include mobile {
    touch-action: pan-y;
  }
  background-image: linear-gradient(to top left, #446d85 0%, #4e7e99 100%);
  background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
  background-image: linear-gradient(to bottom left, hsl(90, 22%, 88%) 0%, hsl(0, 44%, 88%) 100%);
  background: var(--app-bg);
  //background: black;
  /*
  background-image: url("../static/bg/toni-cuenca-CvFARq2qu8Y-unsplash (1).jpg");
  background-size: cover;
  background-position: center;
  */
}

.router-view {
  //backdrop-filter: brightness(1.25) contrast(0.8) blur(4px);
  z-index: 2;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  //background: darkslategrey;
}
</style>
