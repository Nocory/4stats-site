<template>
  <div class="component-nav">
    <div class="container" @click.stop="toggleBurgerMenu(false)">
      <router-link to="/">
        <div class="site-title">4stats.io</div>
      </router-link>
			<div class="nav-links is-hidden-mobile">
				<router-link to="/" class="nav-links__link">
					<div>Main</div>
				</router-link>
				<router-link to="/postAnalysis" class="nav-links__link is-hidden-below-widescreen">
					Post-Analysis
				</router-link>
				<router-link to="/feedback" class="nav-links__link">
					<div>Feedback/Contact</div>
				</router-link>
				<router-link to="/config" class="nav-links__link">
					<div>Config</div>
				</router-link>
			</div>
    </div>
		<div class="burger-button is-hidden-tablet" @click.stop="toggleBurgerMenu(undefined)"></div>
  </div>
</template>

<script>
export default {
	methods: {
		toggleBurgerMenu(showOnMobile){
			const el = document.querySelector(".nav-links")
			if(showOnMobile === undefined){
				el.classList.toggle("is-hidden-mobile")
			}else if(showOnMobile){
				el.classList.remove("is-hidden-mobile")
			}else{
				el.classList.add("is-hidden-mobile")
			}
		}
	}
}
</script>

<style scoped lang="scss">

.component-nav{
	position: relative;
	background: $--background-nav;
	color: $--color-text;
	height: 3rem;
  @include desktop{
    @include float-shadow-box;
	}
	z-index: 2;
}

.container{
	display: flex;
	position: relative;
	align-items: center;
	height: 100%;
	width: $fullhd;
	max-width: calc(100% - 64px);
	margin: auto;
}

.spacer{
	flex-grow: 1;
}

.site-title{
	color: $--color-text;
	font-size: 1.5rem;
	@include tablet{
		padding: 0 1rem;
	}
}

.nav-links{
	display: flex;
	height: 100%;
	@include mobile{
		flex-direction: column;
		position: fixed;
		top: 3rem;
		right: 0;
		background: $--background-nav;
		height: auto;
	}
	&__link{
		position: relative;
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: $--color-text-alt;
		@include mobile{
			padding: 2rem;
			font-size: 2rem;
		}
		@include tablet{
			padding: 0 1rem;
		}
		@include desktop{
			&:hover{
				color: $oc-gray-6;
			}
		}
		&.router-link-exact-active{
			color: $--color-text !important;
			font-weight: bold;
		}
	}
}

.burger-button{
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	width: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	&:before{
		position: absolute;
		content: "";
		width: 2rem;
		height: 1.5rem;
		border-top: 4px solid $--color-text;
		border-bottom: 4px solid $--color-text;
	}
	&:after{
		position: absolute;
		content: "";
		width: 2rem;
		height: 4px;
		background: $--color-text;
	}
}
</style>