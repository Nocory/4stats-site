<template>
  <div class="threadlist-component">
    <h4 class="is-size-4 headline is-hidden-mobile">Active threads on /{{ selectedBoard }}/</h4>

    <div class="mobile-headline-wrapper is-hidden-tablet ">
      <h4 class="headline">Swipe to close</h4>
      <div class="back-button" @click="closeThreadSideBar">x</div>
    </div>
    
    <div v-if="selectedBoard" :style="{ minHeight: elementProperties.listHeight + 'px' }" class="threads-wrapper">
      <a v-for="thread in threadData[selectedBoard].slice(0,elementProperties.threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
        <div class="img-wrapper">
          <img ref="img" :src="thread.image" :alt="`${selectedBoard} thread image`" referrerpolicy="same-origin" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
        </div>
        
        <div class="text-wrapper">
          <div v-if="thread.replies == 9001" class="thread-ppm">
            {{ thread.postsPerMinute.toFixed(2) }} posts/min - <u>Sticky Thread</u> - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
          </div>
          <div v-else class="thread-ppm">
            {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
          </div>
          <div class="thread-title" v-html="thread.sub || '(no title)'"/>
          <div class="thread-comment" v-html="thread.com"/>
        </div>
      </a>
    </div>
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
    
		const detectSwipe = require("js/detectSwipe")
		detectSwipe(document,this.handleSwipe)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

@include mobile{
  .threadlist-component{
    z-index: 20;
    position: absolute;
    top: -3rem;
    right: 0;
    transition: transform 0.5s ease-in-out;

    transform: translateX(calc(100% + 24px));
    &.thread-sidebar-revealed{
      transform: translateX(0%);
    }

    .mobile-headline-wrapper{
      display: flex;
      align-items: center;
      background: $--color-navbar;
      position: relative;
      z-index: 4;
      width: 100%;
      font-size: 1.25rem;
      height: 3rem;
      >.headline{
        flex-grow: 1;
        white-space: nowrap;
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

.threads-wrapper{
  //border-top: 4px solid rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  @include mobile{
    background: $--color-background;
  }
}

a {
  position: relative;
  min-height: 125px;
  flex: 1 1 0;
  display: flex;
  color: $--color-text;
  background: $--color-highlight-1;
  &:nth-child(2n){
    background: $--color-highlight-2;
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
</style>