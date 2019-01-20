<template>
  <div class="index-component">
		<component-boardlist/>
		<component-threadlist/>
		<div class="right is-hidden-below-widescreen">
			<div class="right-wrapper">
				<component-meta/>
				<component-info/>
			</div>
		</div>
		<component-chart class="is-hidden-below-desktop" v-if="this.$route.path == '/'"/>
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
	data: () => ({}),
	components: {
		componentBoardlist,
		componentThreadlist,
		componentMeta,
		componentInfo,
		componentChart: () => import(/* webpackChunkName: "chart" */'./chart.vue')
	}
}
</script>

<style lang="scss" scoped>
@import "~css/variables.scss";

.really-makes-you-think-doesnt-it{
	z-index: -1;
	position: absolute;
	bottom: -5rem;
	right: 0;
	width: 20%;
	filter: drop-shadow(0px 8px 8px rgba(0,0,0,0.25));
}

.index-component {
	position: relative;
	z-index: 2;
	display: grid;
	width: 100%;
	@include mobile{
		grid-template: 	"boards" 	auto /
										1fr;
		grid-gap: 0rem;
	}

	@include tablet{
		grid-template: 	"boards threads" 	auto
										"boards threads" 	auto /
										1fr 		1fr;
		grid-gap: 0rem;
		max-width: 100%;
	}

	@include desktop{
		grid-template: 	"boards threads" 	auto
										"boards threads" 	auto
										"chart 	chart" 		auto /
										1fr 		1fr;
		grid-gap: 1rem;
		max-width: calc(100% - 32px);
		padding: 1rem 0;
	}

	@include widescreen{
		grid-template: 	"boards threads right" 	auto
										"boards threads right" 	auto
										"chart 	chart 	right" 	auto /
										1fr 		1fr 		.618fr;
		grid-gap: 1rem;
		width: $fullhd;
		max-width: calc(100% - 64px);
		padding: 1rem 0 2rem;
	}
}

.boardlist-component{
	grid-area: boards;
	min-width: 100%;
}

.threadlist-component{
	grid-area: threads;
	min-width: 100%;
}

.chart-component{
	grid-area: chart;
}

.right{
	grid-area: right;
	min-width: 100%;
	>.right-wrapper{
		position: sticky;
		top: 1rem;
		>div:not(:first-child){
			margin-top: 1rem;
		}
	}
}
</style>