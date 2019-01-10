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
@import "~css/variables.scss";

#app {
	display: flex;
	flex-direction: column;
	overflow: hidden;
  position: relative;
  min-height: 100vh;
	font-family: monospace;
	@include mobile{
		touch-action: pan-y;
	}
}

.router-view{
	flex-grow: 1;
	position: relative;
	display: flex;
	flex-direction: column;
}
</style>