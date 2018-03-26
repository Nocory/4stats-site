<template>
  <div class="component">
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

.component {
	position: relative;
	z-index: 10;
	background: $--color-background;
}

.main{
	position: relative;
	z-index: 10;
	@include touch{
		padding: 1rem 0;
	}
	@include mobile{
		padding: 0;
	}
	
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