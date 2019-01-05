<template>
  <div class="component-nav">
    <div class="container is-fluid">
      <router-link to="/">
        <div class="nav-link site-title">4stats.io</div>
      </router-link>
			
      <div v-if="mostActiveBoard" class="mostActiveBoard is-hidden">
        /<b>{{ mostActiveBoard }}</b>/ is at {{ Math.round(boardData[mostActiveBoard].relativeActivity * 100) }}% activity. Something going on.
      </div>
      <!--
      <router-link to="/" class="is-hidden-touch is-hidden-desktop-only">
        <div class="nav-link">Live</div>
      </router-link>
			-->

      <div class="spacer"/>
      <!--
      <router-link to="/snapshotAnalysisWorkInProgress" class="is-hidden-touch is-hidden-desktop-only">
        <div class="nav-link">Snapshot WIP</div>
      </router-link>
			-->
      <router-link to="/postAnalysis" class="is-hidden-mobile">
        <div class="nav-link">Post-Analysis</div>
      </router-link>

      <router-link to="/archive" class="is-hidden is-hidden-mobile">
        <div class="nav-link">Archive-WIP</div>
      </router-link>
			
      <router-link to="/feedback" class="is-hidden-mobile">
        <div class="nav-link">Feedback/Contact</div>
      </router-link>

      <router-link to="/config">
        <div class="nav-link">Config</div>
      </router-link>
    </div>
		

    <!--
    <router-link :to="this.$route.path != '/config' ? '/config' : '/'">
      <button class="config-button" @click="showConfig = true">
        <template v-if="this.$route.path != '/config'">
          <span class="icon">
            <i class="fa-lg fa-cog"/>
          </span>
          <span class="config-button-text">
            Boards
          </span>
        </template>
        <template v-else>
          <span class="config-button-text">
            Save ✔
          </span>
        </template>
      </button>
    </router-link>
		-->			
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
	computed: {
		...mapState([
			"boardData"
		]),
		...mapGetters(['combinedBoardStats','mostActiveBoard'])
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-nav{
	z-index: 1;
	position: relative;
	background: $--color-navbar;
	color: $--color-text;
	height: 3rem;
}

.container{
	display: flex;
	align-items: stretch;
	height: 100%;
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
}

.mostActiveBoard, .subTitle{
	position: relative;
	display: flex;
	align-items: center;
	padding: 0;
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
	>.nav-link{
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
	>.site-title{
		color: $--color-text;
		font-size: 1.5rem;
	}
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