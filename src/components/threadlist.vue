<template>
  <div class="threadlist-component">
    <div class="component__header is-hidden-mobile">
      Active threads on /{{ selectedBoard }}/
    </div>

    <div class="mobile-headline-wrapper is-hidden-tablet ">
      <h4 class="headline">Active threads on /{{ selectedBoard }}/</h4>
      <div class="back-button" @click="closeThreadSideBar">x</div>
    </div>
    
    <div v-if="selectedBoard" class="threads-wrapper">
      <a v-for="thread in threadData[selectedBoard].slice(0,elementProperties.threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
        <div class="img-wrapper">
          <img ref="img" :src="thread.image" :alt="`${selectedBoard} thread image`" referrerpolicy="same-origin" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
        </div>
        
        <div class="text-wrapper">
          <div v-if="thread.sticky" class="thread-ppm">
            <u>Sticky Thread</u> - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
          </div>
          <div v-else class="thread-ppm">
            {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours
          </div>
          <div class="thread-title" v-html="thread.sub || '(no title)'"/>
          <div class="thread-comment" v-html="thread.com"/>
        </div>
      </a>
    </div>
    <!--<div class="swipe-hint"/>-->
  </div>
</template>

<script>
const pino = require("js/pino")
import { mapState } from 'vuex'
export default {
	data(){
		return{
      
		}
	},
	computed: {
		...mapState([
			"threadData",
			"enabledBoards",
			"selectedBoard"
		]),
		elementProperties : function(){
			const newListHeight = 36 + this.enabledBoards.length * 21
			return {
				listHeight: newListHeight,
				threadsToShow: localStorage.getItem("forceActiveThreadCount") || Math.max(Math.floor(newListHeight / 128),5)
			}
		}
	},
	methods: {
		revealThreadSideBar(doScrollToTop){
			if(Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >= 768) return
			pino.debug("revealThreadSideBar")
			document.querySelector(".threadlist-component").classList.add("thread-sidebar-revealed")
			if(doScrollToTop){
				document.querySelector(".component-nav").scrollIntoView({
					behavior: "smooth",
					block: "start"
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
	created(){
    
	},
	mounted(){
		this.$store.subscribe(mutation => {
			if(mutation.type == "setSelectedBoard"){
				this.revealThreadSideBar(true)
			}
		})
		/*
		const threadlistTouch = require("js/threadlistTouch")
    threadlistTouch(document,this.handleSwipe)
    */

		const componentEl = document.querySelector(".threadlist-component")
		let start = [0,0]

		document.addEventListener('touchstart', function(e){
			start = [e.touches[0].clientX,e.touches[0].clientY]
			componentEl.classList.add("is-touching")
		},{
			passive: true
		}, false)
    
		document.addEventListener('touchmove', function(e){
			const delta = [e.touches[0].clientX - start[0],e.touches[0].clientY - start[1]]
			let extraTranslateX = delta[0] / window.innerWidth * 100
      
			extraTranslateX = Math.max(-100,extraTranslateX)
			if(componentEl.classList.contains("thread-sidebar-revealed")){
				extraTranslateX = Math.max(0,extraTranslateX)
			}
			componentEl.style.setProperty("--extraTranslateX",extraTranslateX + "%")
		},{
			passive: true
		},false)
    
		document.addEventListener('touchend', e => {
			componentEl.classList.remove("is-touching")
			componentEl.style.setProperty("--extraTranslateX",0 + "%")
			const delta = [e.changedTouches[0].clientX - start[0],e.changedTouches[0].clientY - start[1]]
      
			const absX = Math.abs(delta[0])
			const absy = Math.abs(delta[1])

			if(absX < 64 && absy < 64)return
			if(absX > absy * 2.5){
				if(delta[0] > 0){
					this.handleSwipe("right")
				}else{
					this.handleSwipe("left")
				}
			}
		},{
			passive: true
		},false)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";



@include mobile{
  .threadlist-component{
    --extraTranslateX: 0%;

    z-index: 9999;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-out;
    &.is-touching{
      transition: none;
    }

    transform: translateX(calc(100% + 24px + var(--extraTranslateX)));
    &.thread-sidebar-revealed{
      transform: translateX(calc(0%  + var(--extraTranslateX)));
    }

    .mobile-headline-wrapper{
      position: fixed;
      bottom: 100%;
      left: 0;
      display: flex;
      align-items: center;
      background: $--color-navbar;
      z-index: 9999;
      width: 100%;
      height: 3rem;
      font-size: 1.25rem;
      >.headline{
        flex-grow: 1;
        white-space: nowrap;
        line-height: 100%;
        padding: 0;
      }
      >.back-button{
        background: $nord1;
        color: $oc-gray-0;
        padding: 0 1rem;
        min-height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .threads-wrapper{
      box-shadow: -8px 0px 20px -4px rgba(0, 0, 0, 0.75);
      margin-left: 12px;
    }
  }
}

.threadlist-component{
  display: flex;
  flex-direction: column;
  @include desktop{
    margin: 1rem 0;
    @include float-shadow-box;
  }
}

.component__header{
  background: rgba(0,0,0,0.8);
  color: $oc-gray-4;
  padding: 0rem 0.5rem;
  line-height: 2.25rem;
  text-align: left;
  font-weight: bold;
}

.threads-wrapper{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  @include mobile{
    background: $--color-background;
  }
}

a {
  position: relative;
  min-height: 120px;
  flex: 1 1 0;
  display: flex;
  color: $--color-text;
  background: $--color-highlight-2;
  &:nth-child(2n){
    background: $--color-highlight-1;
  }

  @include mobile{
    &:not(:last-of-type) {
      border-bottom: 2px solid $--color-highlight-1;
    }
  }
  
  >.img-wrapper{
    z-index: 1;
    >img{
      pointer-events: none;
      position: absolute;
      top:0;
      left:0;
      height: 100%;
      object-fit: cover;
    }
    @include touch{
      min-width: 125px;
      width: 20%;
      >img{
        width: 125px;
        min-width: 20%;
      }
    }
    @include desktop{
      min-width: 20%;
      >img{
        max-width: 20%;
        min-width: 20%;
        //transition: all 0.2s ease-out;
      }
      &:hover>img{
        min-width: 20%;
        max-width: 100%;
      }
    }
  }

  >.text-wrapper {
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    font-size: 0.75rem;
    line-height: 1.5;
    
    border-bottom: 4px solid transparent;

    >.thread-ppm {
      padding: 0rem;
      margin: 0.5rem;
      text-decoration: $oc-gray-4 underline;
    }

    >.thread-title {
      padding: 0rem;
      margin: 0.5rem;
      font-weight: bold;
      white-space: nowrap;
    }

    >.thread-comment {
      padding: 0rem;
      margin: 0.5rem;
      color: $--color-text-minor;
    }
  }
}

.swipe-hint{
  z-index: 999;
  position: fixed;
  display: flex;
  top: 80vh;
  width: 100%;
  justify-content: center;
  color: yellow;
  opacity: 0;
  &::after{
    content: "Swipe to close";
    color: white;
    background: rgba(0,0,0,0.85);
    padding: 0.5rem 1rem;
    border-radius: 999px;
  }
  .thread-sidebar-revealed>&{
    animation-duration: 5s;
    animation-name: swipeHintAnim;
    animation-timing-function: ease;
  }
}

@keyframes swipeHintAnim {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  40% {
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