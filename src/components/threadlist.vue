<template>
  <div class="threadlist-component">
    <div class="box-shadow-wrapper">
      <h4 class="title is-size-4 headline">Active threads on /{{ selectedBoard }}/</h4>
      <div class="threads-wrapper" v-if="selectedBoard">
        <a v-for="thread in threadData[selectedBoard].slice(0,threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
          <img :src="thread.image" referrerpolicy="same-origin" ref="img" alt="404 desu senpai" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
          <div class="text-wrapper">
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
const pino = require("../js/pino")
import { mapState } from 'vuex'
export default {
	data(){
		return{
			listHeight: 0,
			threadsToShow: 8,
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
			pino.debug("setListHeight")
			let boardsWrapper = document.querySelector(".boardlist-wrapper")
			//console.log("ele1",boardsWrapper)
			this.listHeight = boardsWrapper.clientHeight
			this.threadsToShow = localStorage.getItem("forceActiveThreadCount") || Math.max(Math.floor(this.listHeight / 150),4)
			//console.log(this.threadsToShow)
			let threadsWrapper = document.querySelector(".threads-wrapper")
			//console.log("ele2",threadsWrapper)
			threadsWrapper.style.minHeight = this.listHeight + "px"
		},
		revealThreadSideBar(doScrollToTop){
			pino.debug("revealThreadSideBar")
			document.querySelector(".threadlist-component").classList.add("thread-sidebar-revealed")
			if(doScrollToTop){
				document.querySelector(".threadlist-component>.box-shadow-wrapper>.headline").scrollIntoView({
					behavior: "smooth",
					block: "nearest"
				})
			}
		},
		closeThreadSideBar(){
			pino.debug("closeThreadSideBar")
			document.querySelector(".threadlist-component").classList.remove("thread-sidebar-revealed")
		},
		handleSwipe(direction){
			if(direction == "right") this.closeThreadSideBar()
			if(direction == "left") this.revealThreadSideBar(false)
		}
	},
	mounted(){
		this.setListHeight()
		this.$store.subscribe(mutation => {
			if(mutation.type == "setEnabledBoards" || mutation.type == "setInitialData"){
				setTimeout(this.setListHeight,2000) //FIXME: not very elegant
			}
		})
    
		this.$store.subscribe(mutation => {
			if(mutation.type == "boardClicked"){
				this.revealThreadSideBar(true)
			}
		})
		//document.addEventListener("touchstart", console.log, false)
		//document.addEventListener("touchend", console.log, false)
    
		const detectSwipe = require("../js/detectSwipe")
		detectSwipe(document,this.handleSwipe)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

@include mobile{
  .threadlist-component{
    .title{
      position: relative;
      z-index: 4;
      background: $nord0;
    }
    z-index: 200;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(calc(100% + 24px));
    transition: transform 0.5s ease-in-out;
    &.thread-sidebar-revealed{
      transform: translateX(0%);
      &::after{
        border-radius: 4px;
        padding: 0.25rem 1rem;
        background: #333;
        color: #f1f1f1;
        opacity: 0;
        content: "Swipe again to close";
        margin: 0 auto;
        position: absolute;
        bottom: 16px;
        left: 0px;
        animation-duration: 3s;
        animation-name: swipeHint;
        animation-timing-function: ease-in-out;
        z-index: 201;
      }
    }
    .box-shadow-wrapper{
      border-left: 12px solid transparent;
    }
    .threads-wrapper{
      background: $oc-gray-0;
      position :relative;
      z-index: 5;
      box-shadow: -8px 0px 20px -4px rgba(0, 0, 0, 0.75);
    }
  }
}

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

  &>.thread-ppm {
    padding: 0.25rem;
    font-size: 0.75rem;
    color: $nord0;
    margin: 0;
  }

  &>.thread-title {
    padding: 0.25rem;
    font-size: 0.75rem;
    font-weight: bolder;
    margin: 0;
    white-space: nowrap;
  }

  &>.thread-comment {
    padding: 0.25rem;
    font-size: 0.75rem;
  }

  &>.overlay{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, transparent 75%, $oc-gray-0 100%);
  }
}



@keyframes swipeHint {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>