<template>
  <div class="component">
    <div class="box-shadow-wrapper">
      <h4 class="title is-size-4 headline">Active threads on /{{ selectedBoard }}/</h4>
      <div class="threads-wrapper" v-if="selectedBoard">
        <a v-for="(thread,index) in threadData[selectedBoard].slice(0,threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
          <img :src="thread.image" referrerpolicy="same-origin" ref="img" alt="404 desu senpai" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
          <div class="text-wrapper has-text-left ">
            <div class="thread-ppm" v-if="thread.replies == 9001">
              {{ thread.postsPerMinute.toFixed(2) }} posts/min - <u>Sticky Thread</u> - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
            </div>
            <div class="thread-ppm" v-else>
              {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
            </div>
            <div class="thread-title" v-html="thread.sub"/>
            <div class="thread-comment" v-html="thread.com"/>
            <div class="overlay"/>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	data(){
		return{
			listHeight: 0,
			threadsToShow: 2,
		}
	},
	computed: {
		...mapState([
			"threadData",
			"selectedBoard"
		])
	},
	methods: {
		setListHeight(){
			setTimeout(() => {
				this.$nextTick(function () {
					let boardsWrapper = document.querySelector(".boardlist-wrapper")
					//console.log("ele1",boardsWrapper)
					this.listHeight = boardsWrapper.clientHeight
					this.threadsToShow = Math.max(Math.floor(this.listHeight / 150),4)
					let threadsWrapper = document.querySelector(".threads-wrapper")
					//console.log("ele2",threadsWrapper)
					threadsWrapper.style.minHeight = this.listHeight + "px"
				})
			},500)
		}
	},
	created(){
		this.$store.subscribe(mutation => {
			if(mutation.type == "setEnabledBoards" || mutation.type == "setInitialData"){
				this.setListHeight()
			}
		})
	},
	mounted(){
		this.setListHeight()
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.box-shadow-wrapper{
  //box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
}

.threads-wrapper{
  //box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
}

a {
  position: relative;
  min-height: 125px;
  max-height: 200px;
  flex: 1 1 0;
  display: flex;
  background: $oc-gray-0;
}

a:not(:last-of-type) {
  border-bottom: 1px solid $nord0;
}

.img-wrapper {
  max-width: 20%;
}

img {
  width: 20%;
  min-width: 125px;
  min-height: 125px;
  max-height: 100%;
  object-fit: cover;
  object-position: center center;
}

.text-wrapper {
  width: 100%;
  overflow: hidden;
  color: #333;
  line-height: 1;
  position: relative;

  .overlay{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, transparent 75%, $oc-gray-0 100%);
  }
}

.thread-ppm {
  padding: 0.25rem;
  font-size: 0.75rem;
  color: $nord0;
  margin: 0;
}

.thread-title {
  padding: 0.25rem;
  font-size: 1rem;
  font-weight: bolder;
  margin: 0;
  white-space: nowrap;
}

.thread-comment {
  padding: 0.25rem;
  font-size: 0.75rem;
}
</style>