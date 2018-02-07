<template>
  <div class="threadlist-component">
    <div class="box-shadow-wrapper">
      <h4 class="is-size-4 headline is-hidden-mobile">Active threads on /{{ selectedBoard }}/</h4>

      <div class="mobile-headline-wrapper is-hidden-tablet ">
        <h4 class="headline">Swipe to close</h4>
        <div class="back-button" @click="closeThreadSideBar">x</div>
      </div>
      
      <div class="threads-wrapper" v-if="selectedBoard">
        <a v-for="thread in threadData[selectedBoard].slice(0,threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
          <img :src="thread.image" referrerpolicy="same-origin" ref="img" :alt="`${selectedBoard} thread image`" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
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
const pino = require("js/pino")
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
			"enabledBoards",
			"selectedBoard"
		])
	},
	methods: {
		setListHeight(){
			this.listHeight = 36 + this.enabledBoards.length * 21 // max 1544 (32 + 72 * 21) //FIXME: hardcoded pixel value, but at least it reacts immediately
			this.threadsToShow = localStorage.getItem("forceActiveThreadCount") || Math.max(Math.floor(this.listHeight / 128),5)
			document.querySelector(".threads-wrapper").style.minHeight = this.listHeight + "px"
		},
		revealThreadSideBar(doScrollToTop){
			console.log(document.body.clientWidth)
			if(document.body.clientWidth >= 768) return
			console.log("meep")
			pino.trace("revealThreadSideBar")
			document.querySelector(".threadlist-component").classList.add("thread-sidebar-revealed")
			if(doScrollToTop){ //FIXME: temporarily disabled. weird horizontal scrolling going on
				document.querySelector(".nav-component").scrollIntoView({
					behavior: "smooth",
					block: "start"
				})
			}
		},
		closeThreadSideBar(){
			pino.trace("closeThreadSideBar")
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
				this.setListHeight()
			}
		})
    
		this.$store.subscribe(mutation => {
			if(mutation.type == "setSelectedBoard"){
				this.revealThreadSideBar(true)
			}
		})
		//document.addEventListener("touchstart", console.log, false)
		//document.addEventListener("touchend", console.log, false)
    
		const detectSwipe = require("js/detectSwipe")
		detectSwipe(document,this.handleSwipe)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

@include mobile{
  .threadlist-component{

    .mobile-headline-wrapper{
      display: flex;
      align-items: center;
      background: $--colorNavBar;
      position: relative;
      z-index: 4;
      width: 100%;
      font-size: 1.25rem;
      height: 3rem;
      .headline{
        flex-grow: 1;
        white-space: nowrap;
      }
      .back-button{
        background: $nord1;
        color: $oc-gray-0;
        padding: 0 1rem;
        min-height: 100%;
        display: flex;
        align-items: center;
      }
    }

    z-index: 200;
    position: absolute;
    top: -3rem;
    right: 0;
    transform: translateX(calc(100% + 24px));
    transition: transform 0.5s ease-in-out;
    &.thread-sidebar-revealed{
      transform: translateX(0%);
      /*
      &::after{
        border-radius: 4px;
        padding: 0.25rem 1rem;
        background: #333;
        color: #f1f1f1;
        opacity: 0;
        content: "Swipe again to close";
        margin: 0 auto;
        position: absolute;
        top: 48px;
        right: 16px;
        margin: 0 auto;
        animation-duration: 3s;
        animation-name: swipeHint;
        animation-timing-function: ease-in-out;
        z-index: 201;
      }
      */
    }
    .box-shadow-wrapper{
      border-left: 12px solid transparent;
    }
    .threads-wrapper{
      background: $oc-gray-0;
      position: relative;
      z-index: 5;
      box-shadow: -8px 0px 20px -4px rgba(0, 0, 0, 0.75);
    }
  }
}

.threads-wrapper{
  display: flex;
  flex-direction: column;
}

a {
  position: relative;
  min-height: 125px;
  flex: 1 1 0;
  display: flex;
  background: $oc-gray-0;
  overflow: hidden;
  &:not(:last-of-type) {
    border-bottom: 1px solid $nord0;
  }
}

img {
  width: 20%;
  min-width: 125px;
  min-height: 125px;
  max-height: 100%;
  object-fit: cover;
  object-position: center center;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
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