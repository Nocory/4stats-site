<template>
  <div id="app">
    <component-nav/>
		
    <div class="router-view">
			<div class="usercount">{{userCount}}</div>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
		
    <component-footer/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	components: {
		componentNav: require("./nav.vue").default,
		componentFooter: require("./footer.vue").default
	},
	computed: {
		...mapState(["userCount"]),
	},
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

.usercount{
	pointer-events: none;
	z-index: 999;
	position: absolute;
	font-weight: bold;
	top: 0;
	left: 8px;
	font-size: 1.25em;
	color: rgba(0,0,0,0.2);
}
</style>