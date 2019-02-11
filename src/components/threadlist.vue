<template>
  <div class="threadlist-component">
    <div class="mobile-wrapper">
      <div class="component-title">
        <div class="headline">Active threads on /{{ selectedBoard }}/</div>
        <div class="back-button is-hidden-tablet" @click="closeThreadSideBar">x</div>
      </div>
      <div v-if="selectedBoard" class="threadlist component-content">
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
					this.closeThreadSideBar()
				}else{
					this.revealThreadSideBar(false)
				}
			}
		},{
			passive: true
		},false)
	}
}
</script>

<style scoped lang="scss">
@include mobile{
  .threadlist-component{
    z-index: 11;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }



  .mobile-wrapper{
    transform: translateX(calc(100% + 24px + var(--extraTranslateX)));
    &.thread-sidebar-revealed{
      transform: translateX(calc(0%  + var(--extraTranslateX)));
    }
  }

  .component-title{
    display: flex;
    align-items: center;
    width: 100%;
    height: 3rem;
    font-size: 1.25rem;
    color: var(--color-text);
    >.headline{
      flex: 1;
      white-space: nowrap;
      line-height: 100%;
      padding: 0 0 0 1rem;
    }
    >.back-button{
      cursor: pointer;
      font-weight: bold;
      font-size: 2rem;
      color: var(--color-text);
      min-width: 3rem;
      min-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .threadlist{
    box-shadow: -8px 0px 20px -4px rgba(0, 0, 0, 0.75);
    margin-left: 12px;
  }
}

.threadlist-component{
  @include desktop{
    @include float-shadow-box;
  }
  pointer-events: none;
}

.mobile-wrapper{
  pointer-events: all;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  transition: transform 0.5s ease-out;
  --extraTranslateX: 0%;
  &.is-touching{
    transition: none;
  }
}

.threadlist{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.thread {
  position: relative;
  min-height: 120px;
  flex: 1 1 0;
  display: flex;
  color: var(--color-text);
  border-top: 1px solid var(--border-content);
  background: var(--background-content);
  &:nth-child(2n){
    background: var(--background-content-2n);
  }
}

.text-wrapper {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  font-size: 0.75rem;
  line-height: 1.5;
  
  border-bottom: 4px solid transparent;

  &__stats {
    color: var(--color-text-faded);
    padding: 0rem;
    margin: 0.5rem;
    text-decoration: var(--color-text-faded) underline;
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
