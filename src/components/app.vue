<template>
  <div id="app">
    <component-nav/>
    <div class="router-view">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <component-footer/>
  </div>
</template>

<script>
import componentNav from './nav.vue'
import componentFooter from './footer.vue'
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
	font-family: monospace;
	background: $--background-nav;
	background: linear-gradient(60deg, #29323c 0%, #485563 100%);
	background: linear-gradient(60deg, #29323c 0%, #485563 100%);
	background-image: linear-gradient(to top, #29323c 0%, #304352 100%);
	@include mobile{
		touch-action: pan-y;
	}
}

.router-view{
	z-index: 1;
	flex-grow: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>