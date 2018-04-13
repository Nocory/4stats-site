<template>
  <div class="index-component">
    <h6 class="connected is-hidden-touch">
      just updated: /{{ recentlyUpdatedBoard }}/<br>
      users on site: {{ connectedUsers }}
    </h6>
    <!--
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

    <div class="is-hidden-mobile section">
      <component-chart v-if="renderChart || forceChart" class="container"/>
      <button v-else class="button" @click="forceChart = true">
        Force-Load Chart Module
      </button>
    </div>
  </div>
	-->
    <div class="container">
      <component-boardlist class="component-boardlist"/>
      <component-threadlist class="component-threadlist"/>
      <component-chart v-if="renderChart || forceChart" class="component-chart"/>
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
	mounted(){
		window.addEventListener("resize",() => {
			this.renderChart = window.innerWidth >= 1216
		},{
			passive: true
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

.index-component {
	position: relative;
	z-index: 10;
	background: $--color-background;

}

.container{
	display: grid;
	position: relative;
	//justify-items: center;

	@include mobile{
		grid-template: 	"boards" auto
										"chart" auto /
										1fr;
		//grid-gap: 0rem;
	}

	@include tablet{
		grid-template: 	"boards threads" max-content
										"chart chart" auto /
										1fr 1fr;
		//grid-gap: 0rem;
		//margin: 0 auto;
	}

	@include desktop{
		padding: 0;
		grid-gap: 1rem;
	}
}

.component-boardlist{
	grid-area: boards;
	min-width: 0;
}

.component-threadlist{
	grid-area: threads;
	min-width: 0;
}

.component-chart{
	grid-area: chart;
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
</style>