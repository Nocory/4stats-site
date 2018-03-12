<template>
  <div class="component-index">
    <div class="main section">
      <h6 class="connected is-hidden-touch">
        just updated: /{{ recentlyUpdatedBoard }}/<br>
        users on site: {{ connectedUsers }}
      </h6>
      <div class="container is-fullhd">
        <div class="columns">
          <component-boardlist class="column is-12-mobile is-6-tablet"/>
          <component-threadlist class="column is-12-mobile is-6-tablet"/>
        </div>
      </div>
    </div>

    <div class="has-text-centered is-hidden-mobile chart-wrapper section">
      <component-chart class="container" v-if="renderChart || forceChart"/>
      <button v-else @click="forceChart = true" class="button">
        Force-Load Chart Module<br>
        not reccommended on mobile
      </button>
    </div>
  </div>
</template>

<script>
const socket = require("js/socket")
export default {
	data: () => ({
		forceChart: false,
		renderChart: window.innerWidth >= 1216, // the bulma breakpoint for desktops
		recentlyUpdatedBoard: "",
		connectedUsers: 0
	}),
	components: {
		componentBoardlist: require("./boardlist.vue").default,
		componentThreadlist: require("./threadlist.vue").default,
		componentChart: () => import('./chart.vue')
	},
	created(){

	},
	mounted(){
		window.addEventListener("resize",() => {
			this.renderChart = window.innerWidth >= 1216
		})
		socket.on("userCount",userCount => {
			this.connectedUsers = userCount
		})
		socket.on("boardUpdate",board => {
			this.recentlyUpdatedBoard = board
		})
	}
}
</script>

<style lang="scss" scoped>
@import "~css/variables.scss";

.component-index {
	position: relative;
	z-index: 10;
	//background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
	//background: linear-gradient(60deg, #29323c 0%, #567563 100%);
	//background-image: linear-gradient(160deg, #2b5876 0%, #567563 100%);
	//background-image: linear-gradient(135deg, #234861 0%, #3f5548 100%);
	background: $--color-background;
}

.main{
	position: relative;
	z-index: 10;
	//margin-bottom: 4rem;
	//background: $--color-background;
}

.chart-wrapper{
	//background-image: linear-gradient(45deg, #8baaaa 0%, #ae8b9c 100%);
	//background: $nord1;
}

.connected {
	position: absolute;
	top: 4px;
	left: 4px;
  font-size: 10px;
  color: $oc-gray-4;
	opacity: 1;
	&:hover{
		opacity: 1;
	}
	&:after{
		position: absolute;
		left: 0;
		top: 200%;
		//content: "works now?";
	}
}

.header{
	position: relative;
	display: flex;
	justify-content: space-between;
}

.columns{
	position: relative;
	@include touch{
		margin: 0;
	}
	@include desktop{
		margin: 0 -0.5rem;
	}
}

.column{
	@include touch{
		padding: 0rem;
	}
	@include desktop{
		padding: 0 0.5rem;
	}
}
</style>