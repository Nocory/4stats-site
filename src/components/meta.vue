<template>
  <div class="meta-component">
    <div class="component__header is-hidden-mobile">
      Meta
    </div>
    <div class="stats-wrapper">
      <div class="cat">4chan now:</div>
      <div>{{ combinedBoardStats.postsPerMinute.toFixed(2) }} posts/min.</div>
      <!--<div>{{ Math.round((combinedBoardStats.postsPerMinute / combinedBoardStats.topPPM) * 100) }}% activity</div>-->
      <hr>
      <div class="cat">4chan average:</div>
      <div>~{{ Math.round(combinedBoardStats.avgPostsPerDay / 1000) }}k posts/day</div>
      <hr>
      <div class="cat">4stats.io:</div>
      <div>{{ connectedUsers }} user{{connectedUsers == 1 ? '' : 's'}} on site</div>
      <div>Just updated /{{ recentlyUpdatedBoard }}/</div>
    </div>

  </div>
</template>

<script>
const socket = require("js/socket")
import { mapGetters } from 'vuex'
export default {
	data(){
		return{
			recentlyUpdatedBoard: "",
			connectedUsers: 0
		}
	},
	computed: {
		...mapGetters(['combinedBoardStats'])
	},
	methods: {
    
	},
	created(){
		socket.on("userCount",userCount => {
			this.connectedUsers = userCount
		})
		socket.on("boardUpdate",board => {
			this.recentlyUpdatedBoard = board
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.meta-component{
  display: flex;
  flex-direction: column;
  @include float-shadow-box;
  
  margin: 1rem 0;
  //--meta-y-offset: 0px;
  //transform: translateY(var(--meta-y-offset));
  //transition: all 1s ease-out;
}

hr{
  background: rgba(255,255,255,0.5);
  margin: 0.5rem 0;
  width: 10%;
}

.component__header{
  background: rgba(0,0,0,0.8);
  color: $oc-gray-4;
  padding: 0rem 0.5rem;
  line-height: 2.25rem;
  text-align: left;
  font-weight: bold;
}

.stats-wrapper{
  display: flex;
  flex-direction: column;
  background: $--color-highlight-2;
  color: $--color-text;
  padding: 1rem;
  color: $oc-gray-0;
  >div{
    line-height: 1.2;
  }
}

.cat{
  color: $oc-gray-6;
}
</style>