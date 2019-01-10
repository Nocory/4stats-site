<template>
  <div class="index-component">
    <div class="container is-fluid">
      <component-boardlist/>
      <component-threadlist/>
      <component-chart v-if="this.$route.path == '/' && chartPreference != -1 && (renderChart || chartPreference == 1)"/>
      <div class="right is-hidden-touch is-hidden-desktop-only">
				<div class="right-wrapper">
					<component-meta/>
					<component-info/>
				</div>
      </div>
    </div>
    <img class="really-makes-you-think-doesnt-it is-hidden-touch" src="~/thunk.png">
  </div>
</template>

<script>
import { mapState } from 'vuex'
import componentBoardlist from './boardlist.vue'
import componentThreadlist from './threadlist.vue'
import componentMeta from './meta.vue'
import componentInfo from './info.vue'
export default {
	data: () => ({
		renderChart: window.innerWidth >= 768, // the bulma breakpoint for tablets
		rightIsFixed: false
	}),
	computed: {
		...mapState([
			"chartPreference"
		])
	},
	components: {
		componentBoardlist,
		componentThreadlist,
		componentMeta,
		componentInfo,
		componentChart: () => import('./chart.vue')
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
		grid-template: 	"boards threads" 512px
										"boards threads" max-content
										"chart chart" auto /
										1fr 1fr;
		padding: 0;
		margin: 0 1rem;
		grid-gap: 1rem;
	}

	@include widescreen{
		grid-template: 	"boards threads right" 512px
										"boards threads right" max-content
										"chart chart right" auto /
										1fr 1fr 0.618fr;
		padding: 0;
		margin: 0 4rem;
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
	>.right-wrapper{
		position: sticky;
		top: 1rem;
	}
}
</style>