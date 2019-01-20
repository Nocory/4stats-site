<template>
  <div class="component-nav">
    <div class="container">

      <router-link to="/">
        <div class="nav-link site-title">4stats.io</div>
      </router-link>

      <div class="spacer"/>
			
      <router-link to="/postAnalysis" class="is-hidden-below-widescreen">
        <div class="nav-link">Post-Analysis</div>
      </router-link>
			
      <router-link to="/feedback" class="is-hidden-mobile">
        <div class="nav-link">Feedback/Contact</div>
      </router-link>
			
      <router-link to="/config">
        <div class="nav-link">Config</div>
      </router-link>
			
    </div>

  </div>
</template>

<script>
export default {
	
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-nav{
	top: 0px;
	background: $--color-navbar;
	color: $--color-text;
	height: 3rem;
  @include desktop{
    @include float-shadow-box;
	}
	z-index: 1;
}

.container{
	display: flex;
	align-items: stretch;
	height: 100%;
	width: $fullhd;
	max-width: calc(100% - 64px);
	margin: auto;
	/*
	&.is-fluid{
		@include touch{
			margin: 0 1rem;
		}
		@include desktop{
			margin: 0 1rem;
		}
		@include widescreen{
			margin: 0 4rem;
		}
	}
	*/
}

.spacer{
	flex-grow: 1;
}

a{
	position: relative;
	display: flex;
	align-items: center;
	@include tablet{
		padding: 0 1rem;
	}
	&:not(:first-child):not(:last-of-type)::after{
		content: "";
		height: 100%;
		width: 4px;
		background: rgba(255,255,255,0.2);
		position: absolute;
		right: -2px;
		//transform-origin: center center;
		transform: skewX(-20deg);
	}
}

.nav-link{
	position: relative;
	font-size: 1.25rem;
	color: $--color-text;

	//underline
	&::after{
		z-index: 0;
		content:"";
		position: absolute;
		//background: transparent;
		background: $--color-link;
		bottom: 5%;
		right: 0;
		height: 2px;
		width: 100%;
		//transform: skew(-45deg);
		transform: scaleX(0);
		transition: all 0.25s ease-out;
	}
}

.site-title{
	color: $--color-text;
	font-size: 1.5rem;
}

.nav-link:hover::after{
	//background: $--color-link;
		transform: scaleX(1);
	//transform: skew(-45deg);
}

.router-link-exact-active>.nav-link::after{
	//background: $--color-link;
		transform: scaleX(1);
	//transform: skew(-45deg);
}
</style>