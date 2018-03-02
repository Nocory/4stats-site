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
export default {
	components: {
		componentNav: require("./nav.vue").default,
		componentFooter: require("./footer.vue").default
	}
}
</script>

<style lang="scss" scoped>
@import "~css/variables.scss";

#app {
	display: flex;
	flex-direction: column;
	overflow: hidden;
  z-index: 0;
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
}

.fade-enter-active, .fade-leave-active {
  transition: transform .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  //opacity: 0;
	transform: scaleY(0);
	transform-origin: top;
}
.fade-enter-to, .fade-leave /* .fade-leave-active below version 2.1.8 */ {
	//opacity: 1;
	transform: scaleY(1);
	transform-origin: top;
}
</style>