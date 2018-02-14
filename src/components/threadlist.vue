<template>
  <div class="threadlist-component">
    <h4 class="is-size-4 headline is-hidden-mobile">Active threads on /{{ selectedBoard }}/</h4>

    <div class="mobile-headline-wrapper is-hidden-tablet ">
      <h4 class="headline">Swipe to close</h4>
      <div class="back-button" @click="closeThreadSideBar">x</div>
    </div>
    
    <div class="threads-wrapper" v-if="selectedBoard">
      <a v-for="thread in threadData[selectedBoard].slice(0,threadsToShow)" :key="thread.no" :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`" target="_blank" rel="noopener">
        <div class="img-wrapper">
          <img :src="thread.image" referrerpolicy="same-origin" ref="img" :alt="`${selectedBoard} thread image`" @error="thread.image='https://s.4cdn.org/image/error/404/404-DanKim.gif'">
        </div>
        
        <div class="text-wrapper">
          <div class="thread-ppm" v-if="thread.replies == 9001">
            {{ thread.postsPerMinute.toFixed(2) }} posts/min - <u>Sticky Thread</u> - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
          </div>
          <div class="thread-ppm" v-else>
            {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies - {{ (thread.age / (1000 * 60 * 60)).toFixed(1) }} hours ago
          </div>
          <div class="thread-title" v-if="thread.sub" v-html="thread.sub"/>
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
			if(document.body.clientWidth >= 768) return
			pino.debug("revealThreadSideBar")
			document.querySelector(".threadlist-component").classList.add("thread-sidebar-revealed")
			if(doScrollToTop){
				document.querySelector(".nav-component").scrollIntoView({
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
    
		const detectSwipe = require("js/detectSwipe")
		detectSwipe(document,this.handleSwipe)
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

@include mobile{
  .threadlist-component{
    z-index: 200;
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
      background: $--colorNavBar;
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
  display: flex;
  flex-direction: column;
}

a {
  position: relative;
  min-height: 125px;
  flex: 1 1 0;
  display: flex;
  background: transparent;
  color: $oc-gray-2;

  @include tablet{
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.5);
    &:not(:last-of-type) {
      margin-bottom: 0.5rem;
    }
  }

  @include mobile{
    &:not(:last-of-type) {
      border-bottom: 2px solid #222;
    }
  }
  
  >.img-wrapper{
    z-index: 123;
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
    line-height: 1.5;
    position: relative;
    background: #282a2e;
      font-size: 0.75rem;

    >.thread-ppm {
      padding: 0.25rem;
      margin: 0;
    }

    >.thread-title {
      padding: 0.25rem;
      font-weight: bolder;
      margin: 0;
      white-space: nowrap;
    }

    >.thread-comment {
      padding: 0.25rem;
    }
  }
}
</style>