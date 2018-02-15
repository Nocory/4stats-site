<template>
  <div class="nav-component">
    <component-config v-if="showConfig" :show-config.sync="showConfig"/>
    <div class="container">
      <div class="title-and-description">
        <div class="site-title">{{ url }}</div>
        <div class="site-description is-hidden-mobile">Currently {{ combinedBoardStats.postsPerMinute.toFixed(2) }} posts/minute with ~{{ Math.round(combinedBoardStats.avgPostsPerDay / 1000) }}k posts/day</div>
      </div>
      <button class="config-button" @click="showConfig = true">
        <span class="icon">
          <i class="fa-lg fa-cog"/>
        </span>
        <span class="config-button-text">
          Boards
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data: () => ({
		//url: location.hostname,
		url: "4stats.io",
		showConfig: false
	}),
	computed: {
		...mapGetters(['combinedBoardStats'])
	},
	components:{
		componentConfig: require("./config.vue").default
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.nav-component{
	position: relative;
	background: $--color-navbar;
	color: $--color-text;
	@include tablet{
		@include float-shadow-box;
	}
}

.container{
	position: relative;
	display: flex;
	align-items: center;
}

.title-and-description{
	display: flex;
	justify-content: flex-start;
	align-items: baseline;
	flex-grow: 1;
}

.site-title{
	position: relative;
	line-height: 1.5;
	@include touch{
		margin-left: 1rem;
	}
	font-size: 2rem;
}

.site-description{
	padding: 0 1rem;
}

.config-button{
	position: relative;
	@include touch{
		margin-right: 1rem;
	}
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0;
	border: none;
	background: transparent;
	color: $--color-text;
	font-weight: bolder;

	//underline
	&::before{
		z-index: 0;
		content:"";
		position: absolute;
		background: $--color-link;
		top: 100%;
		right: 0;
		height: 2px;
		width: 100%;
		transform: skew(-45deg);
	}

	>.icon{
		z-index: 1;
	}

	>.config-button-text{
		font-size: 1.25rem;
		z-index: 1;
		font-family: monospace;
		padding: 0 0 0 0.25rem;
	}
}


</style>