<template>
  <div class="component-nav">
    <div class="container is-fluid">
      <router-link to="/">
        <div class="nav-link site-title">4stats.io</div>
      </router-link>
      <div class="spacer"/>
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
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters(['combinedBoardStats'])
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
	padding: 0 1rem;
	height: 3rem;
}

.container{
	display: flex;
	align-items: stretch;
	height: 100%;
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