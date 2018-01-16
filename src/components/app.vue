<template>
	<div id="app">
		<component-nav></component-nav>
		<component-config v-if="showConfig"></component-config>
		<div class="main">
			<h6 class="connected is-hidden-mobile">
				{{serverMessage}}<br>
				users: {{serverConnectedClients}}
			</h6>
			<div class="container is-fullhd">
				<div class="columns has-text-centered">
					<component-boardlist class="column is-12-mobile is-6-tablet is-narrow-desktop"></component-boardlist>
					<component-threadlist class="column is-12-mobile is-6-tablet is-auto-desktop"></component-threadlist>
				</div>
			</div>
		</div>

		<div class="section has-text-centered">
			<component-chart class="container" v-if="renderChart || forceChart"></component-chart>
			<button v-else @click="forceChart = true" class="button">
				Load Chart Module<br>
				not reccommended on mobile
			</button>
		</div>

		<!--<component-feedback></component-feedback>-->
		<component-footer></component-footer>
	</div>
</template>

<script>
import socket from "../js/socket"
import { mapState } from 'vuex'
export default {
	data: () => ({
		showDebugInfo: localStorage.getItem("showDebugInfo") || "",
		forceChart: false,
		renderChart: window.innerWidth >= 1216, // the bulma breakpoint for desktops
		serverMessage: "",
		serverConnectedClients: 0
	}),
	computed: mapState([
		'showConfig'
	]),
	components: {
		componentNav: require("./nav.vue").default,
		componentBoardlist: require("./boardlist.vue").default,
		componentThreadlist: require("./threadlist.vue").default,
		//componentChart: require("./chart.vue").default,
		componentChart: () => import('./chart.vue'), // lazy loading for relevant screens
		componentFooter: require("./footer.vue").default,
		componentFeedback: require("./feedback.vue").default,
		componentConfig: require("./config.vue").default
	},
	mounted(){
		window.addEventListener("resize",event => {
			this.renderChart = window.innerWidth >= 1216
		})
		socket.on("serverStatus",(message,connectedClients)=>{
			this.serverMessage = message
			this.serverConnectedClients = connectedClients
		})
	}
}
</script>

<style lang="scss" scoped>
@import "~css/variables.scss";

#app {
  z-index: 0;
  position: relative;
  min-height: 100vh;
	background: $nord0;
	//background: $oc-gray-8;
	//font-family: "Ubuntu Mono";
	font-family: monospace;
}

.main{
	position: relative;
	@include desktop{
		padding-top: 1.5rem;
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
		//padding-top: 2rem;
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