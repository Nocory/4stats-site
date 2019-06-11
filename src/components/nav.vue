<template>
	<div class="component-nav">
		<div class="container" @click.stop="toggleBurgerMenu(false)">
			<router-link to="/">
				<div class="site-title">4stats.io</div>
			</router-link>
			<div class="nav-links is-hidden-mobile">
				<router-link to="/" class="nav-links__link">
					<div class="nav-links__text">Board-Stats</div>
				</router-link>
				<!--
				<router-link to="/postAnalysis" class="nav-links__link is-hidden-below-widescreen">
					<div class="nav-links__text">Post-Analysis</div>
				</router-link>
				-->
				<router-link to="/feedback" class="nav-links__link">
					<div class="nav-links__text">Feedback/Contact</div>
				</router-link>
				<router-link to="/about" class="nav-links__link">
					<div class="nav-links__text">About</div>
				</router-link>
			</div>
			<div class="spacer"></div>
			<label class="is-hidden-below-widescreen switch" v-if="showThemeToggle">
				<input type="checkbox" v-model="dayMode" @input="setDayMode" />
				<div class="slider">
					<div class="moon-symbol">1</div>
					<div class="sun-symbol">2</div>
				</div>
			</label>
		</div>
		<div class="burger-button is-hidden-tablet" @click.stop="toggleBurgerMenu(undefined)"></div>
	</div>
</template>

<script>
export default {
	data: () => ({
		showThemeToggle: ["localhost", "home.conroy.link", "dev.4stats.io"].includes(location.hostname),
		dayMode: JSON.parse(localStorage.getItem("dayMode")) || false
	}),
	methods: {
		setDayMode(event) {
			localStorage.setItem("dayMode", event.target.checked)
			if (event.target.checked) {
				document.documentElement.classList.add("day-mode")
			} else {
				document.documentElement.classList.remove("day-mode")
			}
		},
		toggleBurgerMenu(showOnMobile) {
			const el = document.querySelector(".nav-links")
			if (showOnMobile === undefined) {
				el.classList.toggle("is-hidden-mobile")
			} else if (showOnMobile) {
				el.classList.remove("is-hidden-mobile")
			} else {
				el.classList.add("is-hidden-mobile")
			}
		}
	},
	mounted() {
		//TODO: the nav bar shouldn't really handle global CSS theme
		if (this.dayMode) {
			document.documentElement.classList.add("day-mode")
		} else {
			document.documentElement.classList.remove("day-mode")
		}
	}
}
</script>

<style scoped lang="scss">
.component-nav {
	position: relative;
	background: var(--background-nav);
	color: var(--color-text);
	height: 3rem;
	z-index: 3;
	@include widescreen {
		@include float-shadow-box;
	}
}

.container {
	//font-weight: lighter;
	display: flex;
	position: relative;
	align-items: center;
	height: 100%;
	width: $fullhd;
	max-width: calc(100% - 1rem);
	margin: auto;
	//border-bottom: 2px solid var(--color-selected-background);
}

.spacer {
	flex-grow: 1;
}

.site-title {
	color: var(--color-text);
	font-size: 1.75rem;
	font-weight: lighter;
	@include tablet {
		padding: 0 1rem;
	}
}

.nav-links {
	display: flex;
	height: 100%;
	@include mobile {
		flex-direction: column;
		position: fixed;
		top: 3rem;
		right: 0;
		background: var(--background-nav);
		height: auto;
	}
	&__link {
		position: relative;
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: var(--color-text);
		opacity: 0.5;
		&.router-link-exact-active {
			opacity: 1;
		}
		@include mobile {
			padding: 2rem;
			font-size: 2rem;
		}
		@include tablet {
			padding: 0 1rem;
		}
		@include desktop {
			padding: 0;
			> .nav-links__text {
				position: relative;
				line-height: 1;
				height: 100%;
				display: flex;
				align-items: center;
				padding: 0 1rem;
				font-weight: bold;
			}
			//@include selected-underline(".router-link-exact-active");
		}
	}
}

.switch {
	cursor: pointer;
	position: fixed;
	z-index: 999;
	top: 1rem;
	right: 20rem;
	display: flex;
	align-items: center;
	width: 3rem;
	> input {
		position: absolute;
		opacity: 0;
		max-width: 0;
		max-height: 0;
	}
	.slider {
		box-sizing: content-box;
		position: relative;
		left: 0;
		width: 100%;
		height: 1.5rem;
		background: $oc-gray-6;
		transition: 0.25s ease-out;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.25rem;
		//border: 1px solid transparent;

		> .moon-symbol {
			color: black;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			font-size: 1.25rem;
			opacity: 1;
			height: 1.2rem;
			width: 1.2rem;
			top: 0.15rem;
			left: 0.15rem;
		}
		> .sun-symbol {
			//text-shadow: 0px 0px 16px rgba(255,255,255,0.25);
			color: black;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			font-size: 1.25rem;
			opacity: 1;
			height: 1.2rem;
			width: 1.2rem;
			top: 0.15rem;
			right: 0.15rem;
		}
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 1.2rem;
		width: 1.2rem;
		top: 0;
		left: 0;
		transform: translate(0.15rem, 0.15rem);
		background: white;
		transition: 0.25s ease-out;
		border-radius: 0.25rem;
	}

	input:checked + .slider {
		//background: rgb(255, 221, 158);
		//border: 1px solid #aaa;
	}

	input:checked + .slider:before {
		transform: translate(calc(3rem - 100% - 0.15rem), 0.15rem);
	}
}

.burger-button {
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	width: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	&:before {
		position: absolute;
		content: "";
		width: 2rem;
		height: 1.5rem;
		border-top: 4px solid var(--color-text);
		border-bottom: 4px solid var(--color-text);
	}
	&:after {
		position: absolute;
		content: "";
		width: 2rem;
		height: 4px;
		background: var(--color-text);
	}
}
</style>