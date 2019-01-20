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
  position: relative;
  min-height: 100vh;
	font-family: monospace;
	@include mobile{
		touch-action: pan-y;
	}
}

.router-view{
	z-index: 2;
	flex-grow: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	//background-image: linear-gradient(0deg, rgb(18, 43, 77) 0px, rgb(83, 120, 149));
	background-image: linear-gradient(to top, rgb(18, 43, 77) 0%, #6b8cce 100%, #a2b6df 100%);
}
</style>