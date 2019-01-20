<template>
  <div class="threadlist-component">
    <div class="mobile-wrapper">
      <div class="component-title is-hidden-mobile">
        Active threads on /{{ selectedBoard }}/
      </div>

      <div class="mobile-headline-wrapper is-hidden-tablet">
        <h4 class="headline">Active threads on /{{ selectedBoard }}/</h4>
        <div class="back-button" @click="closeThreadSideBar">x</div>
      </div>
      
      <div v-if="selectedBoard" class="threadlist">
        <a v-for="(thread,index) in threadData[selectedBoard].slice(0,elementProperties.threadsToShow)" :key="thread.no" class="thread" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
          <div class="img-wrapper">
            <img class="img-wrapper__img" :src="thread.image" :alt="`${selectedBoard} thread image ${index}`" referrerpolicy="same-origin" @error="$store.commit('replaceThreadThumbnail',{selectedBoard, index})">
          </div>
          
          <div class="text-wrapper">
            <div v-if="thread.sticky" class="text-wrapper__stats">
              <u>Sticky Thread</u> - {{ thread.age > 1000 * 60 * 60 * 24 ? Math.floor(thread.age / (1000 * 60 * 60 * 24)) + 'd' : ''}} {{ Math.floor(thread.age % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + 'h'}} {{ Math.floor(thread.age % (1000 * 60 * 60) / (1000 * 60)) + 'm'}}
            </div>
            <div v-else class="text-wrapper__stats">
              {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies - {{ thread.age > 1000 * 60 * 60 * 24 ? Math.floor(thread.age / (1000 * 60 * 60 * 24)) + 'd' : ''}} {{ Math.floor(thread.age % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + 'h'}} {{ Math.floor(thread.age % (1000 * 60 * 60) / (1000 * 60)) + 'm'}}
            </div>
            <div class="text-wrapper__sub" v-html="thread.sub || '(no title)'"/>
            <div class="text-wrapper__com" v-html="thread.com"/>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import pino from "js/pino"
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
			document.querySelector(".mobile-wrapper").classList.add("thread-sidebar-revealed")
			if(doScrollToTop){
				document.querySelector(".component-nav").scrollIntoView({
					behavior: "smooth",
					block: "start"
				})
			}
		},
		closeThreadSideBar(){
			document.querySelector(".mobile-wrapper").classList.remove("thread-sidebar-revealed")
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

		const componentEl = document.querySelector(".mobile-wrapper")
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
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .mobile-wrapper{
    transition: transform 0.5s ease-out;
    --extraTranslateX: 0%;
    &.is-touching{
      transition: none;
    }

    transform: translateX(calc(100% + 24px + var(--extraTranslateX)));
    &.thread-sidebar-revealed{
      transform: translateX(calc(0%  + var(--extraTranslateX)));
    }
  }

  .mobile-headline-wrapper{
    z-index: 99;
    //position: absolute;
    bottom: 100%;
    left: 0;
    display: flex;
    align-items: center;
    background: $--color-navbar;
    width: 100%;
    height: 3rem;
    font-size: 1.25rem;
    color: $--color-text;
    >.headline{
      flex: 1;
      white-space: nowrap;
      line-height: 100%;
      padding: 0 0 0 1rem;
    }
    >.back-button{
      cursor: pointer;
      background: $nord1;
      color: $oc-gray-0;
      padding: 0 1rem;
      min-height: 100%;
      display: flex;
      align-items: center;
    }
  }
  
  .threadlist{
    position: relative;
    box-shadow: -8px 0px 20px -4px rgba(0, 0, 0, 0.75);
    margin-left: 12px;
  }
}

.threadlist-component{
  @include desktop{
    @include float-shadow-box;
  }
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.mobile-wrapper{
  pointer-events: all;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.threadlist{
  min-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  @include mobile{
    background: $--color-background;
  }
}

.thread {
  position: relative;
  min-height: 120px;
  flex: 1 1 0;
  display: flex;
  color: $--color-text;
  background: $--color-highlight-2;
  &:nth-child(2n){
    background: $--color-highlight-1;
  }
  /*
  @include mobile{
    &:not(:last-of-type) {
      border-bottom: 2px solid $--color-highlight-1;
    }
  }
  */
}

.text-wrapper {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  font-size: 0.75rem;
  line-height: 1.5;
  
  border-bottom: 4px solid transparent;

  &__stats {
    padding: 0rem;
    margin: 0.5rem;
    text-decoration: $oc-gray-4 underline;
  }

  &__sub {
    padding: 0rem;
    margin: 0.5rem;
    font-weight: bold;
    white-space: nowrap;
  }

  &__com {
    padding: 0rem;
    margin: 0.5rem;
    color: $--color-text-minor;
  }
}

.img-wrapper{
  z-index: 1;
  &__img{
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
    &__img{
      width: 125px;
      min-width: 20%;
    }
  }
  @include desktop{
    min-width: 20%;
    &__img{
      max-width: 20%;
      min-width: 20%;
    }
    &:hover>&__img{
      min-width: 20%;
      max-width: 100%;
    }
  }
}
</style>
