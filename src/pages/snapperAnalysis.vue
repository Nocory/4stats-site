<template>
	<div class="postAnalysis-component">
		<div class="explanation">
			These stats cover posts from approximately early January to early June 2019.<br />
			Not all posts from that duration are included due to resource limitations, though I am confident, that &gt;95% of posts were
			captured.<br />
			<br />
			Click a row to highlight the flag in all columns.<br />
			Best viewed on full-hd screens... not going to bother to make this somehow responsive right now.
		</div>
		<div class="flex-container">
			<div class="outer-container" v-for="(board, index) in [[bant, 'bant'], [sp, 'sp'], [int, 'int'], [pol, 'pol']]" :key="board[1]">
				<div class="board-name">/{{ board[1] }}/ --- {{ board[0].posts }} posts</div>
				<div class="inner-container">
					<div class="row header">
						<div
							v-for="item in [
								{ category: 'index', text: '#', tooltip: '' },
								{ category: 'flag', text: 'Flag', tooltip: '', classes: 'wide-field' },
								{ category: 'occurence', text: 'Posts', tooltip: '' },
								{ category: 'percentage', text: '%', tooltip: '' }
							]"
							:key="item.category"
							:class="['row__item', ...item.classes]"
							:data-hover-text="item.tooltip"
							@click.stop="categoryClicked(item.category)"
						>
							{{ item.text }}
						</div>
					</div>
					<transition-group v-if="board[0].flags" tag="div" class="rows component-content">
						<div
							v-for="(flag, index) in board[0].flags"
							:key="flag[0]"
							class="row flag-row"
							:data-hover-text="flag[0]"
							@click.stop="flagHovered(flag[0])"
							:class="{ 'flag-hovered': flag[0] == hoveredFlag }"
						>
							<div class="row__item">{{ index + 1 }}</div>
							<div class="row__item wide-field tooltip--right" :class="{ 'troll-country': troll_flags.includes(flag[0]) }">
								{{ flag[0] }}
							</div>
							<div class="row__item">{{ flag[1] }}</div>
							<div class="row__item">{{ (flag[2] * 100).toFixed(2) }}</div>
						</div>
					</transition-group>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		hoveredFlag: "NONE",
		sortListBy: "flag",
		isListReversed: false,
		bant: require("./snapper_analysis/flags_bant.json"),
		sp: require("./snapper_analysis/flags_sp.json"),
		int: require("./snapper_analysis/flags_int.json"),
		pol: require("./snapper_analysis/flags_pol.json"),
		troll_flags: [
			"Anarcho-Capitalist",
			"Anarchist",
			"Black Nationalist",
			"Confederate",
			"Communist",
			"Catalonia",
			"Democrat",
			"European",
			"Fascist",
			"Gadsden",
			"Gay",
			"Jihadi",
			"Kekistani",
			"Muslim",
			"National Bolshevik",
			"Nazi",
			"Hippie",
			"Pirate",
			"Republican",
			"Templar",
			"Tree Hugger",
			"United Nations",
			"White Supremacist",
			"DEUS VULT",
			"LGBT",
			"Commie",
			"Black Lives Matter"
		]
	}),
	computed: {},
	methods: {
		flagHovered(flag) {
			this.hoveredFlag = flag
		},
		categoryClicked(sortBy) {
			this.isListReversed = sortBy == this.sortListBy ? !this.isListReversed : false
			this.sortListBy = sortBy
		}
	},
	mounted() {}
}
</script>

<style scoped lang="scss">
.postAnalysis-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 10;
	width: 100%;
	@include desktop {
		padding: 1rem;
	}

	@include widescreen {
		padding: 1rem 2rem 2rem;
	}
}

.explanation {
	//text-align: center;
	color: var(--color-text);
	margin-bottom: 1rem;
	padding: 1rem;
	font-size: 0.8em;
	max-width: 512px;
	background-color: var(--background-content-2n);
	@include desktop {
		@include float-shadow-box;
	}
}

.flex-container {
	display: flex;
	flex-wrap: wrap;
}

.board-name {
	background: var(--background-nav);
	color: var(--color-text);
	padding: 0rem 0.5rem;
	line-height: 2.25rem;
	text-align: left;
	font-weight: normal;
	margin-bottom: 1rem;
}

.outer-container {
	padding: 0 1rem;
}

.inner-container {
	position: relative;
	@include desktop {
		@include float-shadow-box;
	}
}

.row {
	white-space: nowrap;
	position: relative;
	display: flex;
	cursor: pointer;
	font-size: 0.8rem;
	color: var(--color-text);
	transition: transform 0.5s ease;
	> .row__item {
		position: relative;
		min-width: 0;
		flex: 1 1 0;
		text-align: right;
		padding: 0 1em 0 0;
		width: 4rem;
		&.troll-country {
			color: hsl(0, 100%, 79%);
			font-style: italic;
		}
		&:first-child {
			text-align: left;
			padding: 0 0 0 1em;
			max-width: 2rem;
		}
	}
	.wide-field {
		width: 10rem;
		flex: none;
		text-align: left;
		padding: 0 0 0 1em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.header {
	z-index: 100;
	line-height: 2.25rem !important;
	background: var(--background-nav) !important;
}

.flag-row {
	line-height: 1.25rem;
	background: var(--background-content);
	transition: 0.2s all ease-out;
	&:nth-of-type(2n) {
		background: var(--background-content-2n);
	}
	border-top: 1px solid var(--border-content);
	&:hover,
	&.flag-hovered {
		background-color: #eee;
		color: #111;
		font-weight: bold;
	}
}
///////////
// Hover //
///////////

[data-hover-text]:hover::after {
	line-height: 2;
	z-index: 999;
	position: absolute;
	content: attr(data-hover-text);
	white-space: nowrap;
	padding: 0 1em;
	white-space: nowrap;
	background-color: rgba(0, 0, 0, 0.85);
	color: var(--color-text);
}

.tooltip--bottom {
	text-decoration: underline dotted;
}

.tooltip--bottom:hover::after {
	left: 0px;
	top: 125%;
}

.tooltip--right:hover::after {
	left: 100%;
}
</style>