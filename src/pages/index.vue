<template>
	<div class="index-component">
		<component-boardlist />
		<component-threadlist />
		<div v-if="renderRight" class="right is-hidden-below-widescreen">
			<div class="right-wrapper">
				<component-meta />
				<component-info />
				<!--<component-sideImage />-->
			</div>
			<img class="really-makes-you-think-doesnt-it is-hidden-touch" src="~/thunk.png" />
		</div>
		<component-chart v-if="renderChart" class="is-hidden-below-tablet" />
	</div>
</template>

<script>
import componentBoardlist from "components/boardlist.vue"
import componentThreadlist from "components/threadlist.vue"
import componentSideImage from "components/sideImage.vue"
export default {
	data: () => ({
		renderChart: window.innerWidth >= 768,
		renderRight: window.innerWidth >= 1224
	}),
	components: {
		componentBoardlist,
		componentThreadlist,
		componentMeta: () => import(/* webpackChunkName: "sidebar" */ "components/meta.vue"),
		componentInfo: () => import(/* webpackChunkName: "sidebar" */ "components/info.vue"),
		componentSideImage: () => import(/* webpackChunkName: "sidebar" */ "components/sideImage.vue"),
		componentChart: () => import(/* webpackChunkName: "chart" */ "components/chart.vue")
	},
	mounted() {
		window.addEventListener("resize", this.documentResize, {
			passive: true
		})
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.documentResize, {
			passive: true
		})
	},
	methods: {
		documentResize() {
			this.renderChart = window.innerWidth >= 768
			this.renderRight = window.innerWidth >= 1224
		}
	}
}
</script>

<style lang="scss" scoped>
.index-component {
	position: relative;
	display: grid;
	width: 100%;
	@include mobile {
		grid-template:
			"boards" auto /
			1fr;
		grid-gap: 0rem;
	}

	@include tablet {
		grid-template:
			"boards threads" auto
			"boards threads" auto
			"chart chart" auto /
			1fr 1fr;
		grid-gap: 0rem;
		max-width: 100%;
	}

	@include desktop {
		grid-template:
			"boards threads" auto
			"boards threads" auto
			"chart 	chart" auto /
			1fr 1fr;
		width: $fullhd;
		grid-gap: 0rem;
		max-width: calc(100%);
	}

	@include widescreen {
		grid-template:
			"boards threads right" auto
			"boards threads right" auto
			"chart 	chart 	right" auto /
			1fr 1fr 0.5fr;
		grid-gap: 1rem;
		max-width: calc(100% - 2rem);
		padding: 1rem 0 2rem;
	}
}

.boardlist-component {
	grid-area: boards;
	min-width: 100%;
}

.threadlist-component {
	grid-area: threads;
	min-width: 100%;
}

.chart-component {
	grid-area: chart;
}

.right {
	grid-area: right;
	min-width: 100%;
	position: relative;
	> .right-wrapper {
		position: sticky;
		top: 1rem;
		> div:not(:first-child) {
			margin-top: 1rem;
		}
	}

	> .really-makes-you-think-doesnt-it {
		z-index: -1;
		position: absolute;
		bottom: -6rem;
		right: -0rem;
		width: 100%;
		filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
	}
}
</style>