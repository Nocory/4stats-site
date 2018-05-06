<template>
  <div class="index-component">
    <div class="container is-fluid">
      <component-boardlist/>
      <component-threadlist/>
      <component-chart v-if="renderChart || forceChart"/>
      <div class="right is-hidden-touch">
        <component-meta/>
        <component-info/>
      </div>
    </div>
    <img class="really-makes-you-think-doesnt-it is-hidden-touch" src="~/thunk.png">
  </div>
</template>

<script>
export default {
	data: () => ({
		forceChart: false,
		renderChart: window.innerWidth >= 768, // the bulma breakpoint for tablets
		recentlyUpdatedBoard: "",
		connectedUsers: 0,
		rightIsFixed: false
	}),
	components: {
		componentBoardlist: require("./boardlist.vue").default,
		componentThreadlist: require("./threadlist.vue").default,
		componentMeta: require("./meta.vue").default,
		componentInfo: require("./info.vue").default,
		componentChart: () => import('./chart.vue')
	},
	methods:{
		setRightElRelative(){
			//console.log("rel")
			const rightComponent = document.querySelector(".right")
			if(!rightComponent) return
			rightComponent.style.position = "relative"
			rightComponent.style.top = "inherit"
			rightComponent.style.left = "inherit"
			rightComponent.style.width = "inherit"
			this.rightIsFixed = false
		},
		setRightElFixed(){
			//console.log("fixing")
			if(window.scrollY < 48) return
			const rightComponent = document.querySelector(".right")
			if(!rightComponent) return
			const boundingRect = rightComponent.getBoundingClientRect()
			rightComponent.style.position = "fixed"
			rightComponent.style.top = 0+"px"
			rightComponent.style.left = boundingRect.left+"px"
			rightComponent.style.width = boundingRect.width+"px"
			this.rightIsFixed = true
		}
	},
	mounted(){
		window.addEventListener("resize",() => {
			this.renderChart = window.innerWidth >= 768
			this.setRightElRelative()
			this.setRightElFixed()
		},{
			passive: true
		})

		window.addEventListener("scroll",() => {
			//console.log(e)
			if(window.scrollY >= 48 && !this.rightIsFixed){
				this.setRightElFixed()
			}
			if(window.scrollY < 48 && this.rightIsFixed){
				this.setRightElRelative()
			}
		},{
			passive: true
		})

		this.setRightElFixed()
		/*
		const rightComponent = document.querySelector(".right")
		window.addEventListener("scroll",e => {
			console.log(window.scrollY + "px")
			//rightComponent.style.top = window.scrollY + "px"
			rightComponent.style.setProperty("--meta-y-offset",window.scrollY + "px")
		},{
			passive: true
		})
		*/
		/*
		const rightComponent = document.querySelector(".right")
		const boundingRect = rightComponent.getBoundingClientRect()

		console.log(boundingRect)

		rightComponent.style.position = "fixed"
		rightComponent.style.top = boundingRect.top+"px"
		rightComponent.style.left = boundingRect.left+"px"
		rightComponent.style.width = boundingRect.width+"px"
		*/
	}
}
</script>

<style lang="scss" scoped>
@import "~css/variables.scss";

.really-makes-you-think-doesnt-it{
	z-index: -999;
	position: absolute;
	bottom: -5rem;
	right: 0;
	width: 20%;
	filter: drop-shadow(0px 8px 8px rgba(0,0,0,0.25));
}

.index-component {
	position: relative;
	z-index: 2;
	background: $--color-background;
	@include desktop{
		padding-bottom: 2rem;
	}
	//height: 100%;
}

.container{
	flex: 2;
	display: grid;
	position: relative;

	@include mobile{
		grid-template: 	"boards" auto
										"chart" auto /
										1fr;
	}

	@include tablet{
		grid-template: 	"boards threads" 512px
										"boards threads" max-content
										"chart chart" auto /
										1fr 1fr;
	}

	@include desktop{
		grid-template: 	"boards threads right" 512px
										"boards threads right" max-content
										"chart chart right" auto /
										1fr 1fr 0.618fr;
	}

	@include desktop{
		padding: 0;
		grid-gap: 1rem;
	}
}

.boardlist-component{
	grid-area: boards;
	min-width: 0;
}

.threadlist-component{
	grid-area: threads;
	min-width: 0;
}

.chart-component{
	grid-area: chart;
}

.right{
	grid-area: right;
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