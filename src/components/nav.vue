<template>
  <div class="component-nav">
    <div class="container is-fluid">
      <router-link to="/">
        <div class="nav-link site-title">4stats.io</div>
      </router-link>
      <div class="spacer"/>
      <router-link to="/feedback">
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
	z-index: 999;
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
	padding: 0 1rem;
	>.nav-link{
		position: relative;
		font-size: 1.25rem;
		color: $--color-text;
		font-weight: bolder;

		//underline
		&::before{
			z-index: 0;
			content:"";
			position: absolute;
			background: transparent;
			bottom: 0%;
			right: 0;
			height: 4px;
			width: 100%;
			transform: skew(-45deg);
		}
	}
	>.site-title{
		color: $--color-text;
		font-weight: lighter;
		@include touch{
			margin-left: 1rem;
		}
		font-size: 1.5rem;
	}
}

.router-link-exact-active>.nav-link{
	&::before{
		background: $--color-link;
	}
}
</style>