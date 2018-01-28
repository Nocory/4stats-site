<template>
  <div class="component">
    <component-config v-if="showConfig" :show-config.sync="showConfig"/>
    <div class="container">
      <div class="title-and-description">
        <div class="site-title">{{ url }}</div>
        <div class="site-description is-hidden-mobile">Currently {{ getTotalPPM.toFixed(2) }} posts/minute across all boards</div>
      </div>
      <div class="spacer"/>
      <button class="config-button" @click="showConfig = true">
        <span class="icon">
          <i class="fa fa-cog"/>
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
		url: location.hostname,
		showConfig: false
	}),
	computed: {
		...mapGetters([
			'getTotalPPM'
		])
	},
	components:{
		componentConfig: require("./config.vue").default
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component{
	position: relative;
	background: $--colorNavBar;
  //box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.5);
}

.container{
	position: relative;
	display: flex;
	align-items: center;
}

.title-and-description{
	display: flex;
	justify-content: center;
	align-items: baseline;
}

.site-title{
	position: relative;
	@include touch{
		margin-left: 1rem;
		font-size: 1.5rem;
	}
	color: $--colorSiteTitle;
	font-size: 2rem;
}

.title-hat{
	position: absolute;
	top: 7px;
	right: -7px;
	width: 22px;
}

.site-description{
	color: $oc-gray-4;
	padding: 0 1rem;
}

.spacer{
	flex-grow: 1;
}

.config-button{
	@include touch{
		margin-right: 1rem;
	}
	display: flex;
	align-items: center;
	cursor: pointer;
	//font-family: monospace;
	//font-family: "Ubuntu Mono";
	//font-weight: bolder;
	padding: 0.25em 0.5em;
	margin: 0.25em 0;
	font-size: 1rem;
  border-radius: 999px;
	//border: 2px solid #f5ff90;
	border: 2px solid $oc-yellow-5;
  //background: rgb(54, 54, 46);
	background: transparent;
	color: $oc-gray-0;
}

.config-button-text{
	font-size: 1.125rem;
}

.icon{
	margin-right: 0.5em;
}
</style>