<template>
  <div class="meta-component">
    <div class="component-title">
      Meta
    </div>
    <div class="component-content">
      <div class="component-content__cat">4chan now:</div>
      <div class="component-content__text">{{ combinedBoardStats.postsPerMinute.toFixed(2) }} posts/min.</div>
      <!--<div>New thread every {{ (1 / (combinedBoardStats.threadsPerHour / (60 * 60))).toFixed(2) }} seconds</div>-->
      <!--<div>{{ Math.round((combinedBoardStats.postsPerMinute / combinedBoardStats.topPPM) * 100) }}% activity</div>-->
      <hr>
      <div class="component-content__cat">4chan average:</div>
      <div class="component-content__text">~{{ Math.round(combinedBoardStats.avgPostsPerDay / 1000) }}k posts/day</div>
      <hr>
      <div class="component-content__cat">4stats.io:</div>
      <!--<div v-if="showUserCount">{{ userCount }} user{{userCount == 1 ? '' : 's'}} on site</div>-->
      <div class="component-content__text">{{ userCount }} user{{userCount == 1 ? '' : 's'}} on site</div>
      <div class="component-content__text">Just updated {{ recentlyUpdatedBoard == "s4s" ? "[s4s]" : "/"+recentlyUpdatedBoard+"/" }}</div>
      <div class="component-content__cat" v-if="error">Error -> {{ error }}</div>
    </div>

  </div>
</template>

<script>
import socket from "js/socket"
import { mapState, mapGetters } from 'vuex'
export default {
	data(){
		return{
			recentlyUpdatedBoard: "?",
      error: "",
      showUserCount: JSON.parse(localStorage.getItem("showUserCount")) || false
		}
	},
	computed: {
		...mapState(["userCount"]),
		...mapGetters(['combinedBoardStats'])
	},
	methods: {
    
	},
	created(){
		socket.on("boardUpdate",board => {
			this.recentlyUpdatedBoard = board
    })
    let timeoutID = null
    socket.on("serverError",error => {
      this.error = error
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {this.error = ""},300000)
    })
	}
}
</script>

<style scoped lang="scss">

.meta-component{
  display: flex;
  flex-direction: column;
  @include float-shadow-box;
}

hr{
  background: $--color-text;
  margin: 0.5rem 0;
  width: 10%;
}

.component-content{
  //background: $--background-content-2n;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding: 1rem;
  >div{
    line-height: 1.2;
  }
  &__cat{
    color: $--color-text-alt;
  }
}
</style>