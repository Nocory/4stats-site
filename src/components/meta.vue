<template>
  <base-component title="Meta" class="base-component">
    <div class="component-content leading-none p-4 leading-tight">
      <div class="font-bold">{{ combinedBoardStats.postsPerMinute.toFixed(2) }}</div>
      <div class="text-sm color-faded">
        posts/min now
      </div>
      <!--<div>New thread every {{ (1 / (combinedBoardStats.threadsPerHour / (60 * 60))).toFixed(2) }} seconds</div>-->
      <!--<div>{{ Math.round((combinedBoardStats.postsPerMinute / combinedBoardStats.topPPM) * 100) }}% activity</div>-->

      <div class="font-bold pt-4">
        ~{{
          Math.round(combinedBoardStats.avgPostsPerDay)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }}
      </div>
      <div class="text-sm color-faded">
        posts/day average
      </div>

      <div class="text-sm pt-4 color-faded">{{ userCount }} user{{ userCount == 1 ? "" : "s" }} on this site</div>
      <div class="text-sm color-faded">Just updated {{ recentlyUpdatedBoard == "s4s" ? "[s4s]" : "/" + recentlyUpdatedBoard + "/" }}</div>
      <div v-if="error" class="pt-4 color-faded">Error -> {{ error }}</div>
    </div>
  </base-component>
</template>

<script>
import socket from "js/socket"
import { mapState, mapGetters } from "vuex"

import baseComponent from "components/baseComponent.vue"
export default {
  components: {
    baseComponent
  },
  data() {
    return {
      recentlyUpdatedBoard: "?",
      error: ""
    }
  },
  computed: {
    ...mapState(["userCount"]),
    ...mapGetters(["combinedBoardStats"])
  },
  created() {
    socket.on("boardUpdate", board => {
      this.recentlyUpdatedBoard = board
    })
    let timeoutID = null
    socket.on("serverError", error => {
      this.error = error
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        this.error = ""
      }, 300000)
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.base-component {
  background: var(--bg2);
}
</style>
