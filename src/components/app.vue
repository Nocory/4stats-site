<template>
	<div id="app">
		<component-nav></component-nav>
		<div class="main">
			<h6 class="connected is-hidden-touch">
				just updated: /{{recentlyUpdatedBoard}}/<br>
				users on site: {{connectedUsers}}
			</h6>
			<div class="container is-fullhd">
				<div class="columns">
					<component-boardlist class="column is-12-mobile is-6-tablet"></component-boardlist>
					<component-threadlist class="column is-12-mobile is-6-tablet"></component-threadlist>
				</div>
			</div>
		</div>

		<div class="section has-text-centered is-hidden-mobile">
			<component-chart class="container" v-if="renderChart || forceChart"></component-chart>
			<button v-else @click="forceChart = true" class="button">
				Force-Load Chart Module<br>
				not reccommended on mobile
			</button>
		</div>
		
		<component-footer></component-footer>
	</div>
</template>

<script>
import socket from "js/socket"
import { mapState } from 'vuex'
export default {
	data: () => ({
		forceChart: false,
		renderChart: window.innerWidth >= 1216, // the bulma breakpoint for desktops
		recentlyUpdatedBoard: "",
		connectedUsers: 0
	}),
	computed: mapState([
		'showConfig'
	]),
	components: {
		componentNav: require("./nav.vue").default,
		componentBoardlist: require("./boardlist.vue").default,
		componentThreadlist: require("./threadlist.vue").default,
		componentChart: () => import('./chart.vue'), // lazy loading for relevant screen-width
		componentFooter: require("./footer.vue").default,
		componentConfig: require("./config.vue").default
	},
	mounted(){
		window.addEventListener("resize",event => {
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

#app {
	overflow: hidden;
  z-index: 0;
  position: relative;
  min-height: 100vh;
	background: $nord1;
	//background: #1d1f21;
	font-family: monospace;
	touch-action: pan-y;
}

.main{
	position: relative;
	@include desktop{
		padding-top: 1rem;
	}
	@include touch{
		padding-top: 0rem;
	}
}

.connected {
	position: absolute;
	top: 4px;
	left: 4px;
  font-size: 10px;
  color: $oc-gray-6;
	opacity: 1;
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