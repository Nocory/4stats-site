<template>
  <div class="postAnalysis-component">
    <div class="explanation">
      While the main page shows data calculated from the catalog, these numbers are based on individual posts.<br>
      Checking all threads on all boards takes a longer time, so updates are less frequent.<br>
      Stats are calculated from currently visible content and any seen posts made in the last 3 days.<br>
      'Replies/thread' and 'Avg. thread age' values are calculated from visible threads only.<br>
      (not mobile friendly)
    </div>
    <div class="container">
      <!--<img src="../static/xmashat.gif" class="partyhat is-hidden-touch">-->
      
      <button class="refresh-button" @click="reloadStats(true)">
        <div class="refresh-button__text">&#11118;</div>
      </button>
      
      <div class="header">
        <div v-for="item in [
          {category: 'name', text: 'Board', tooltip: ''},
          {category: 'OPLength_mean', text: 'OP length', tooltip: ''},
          {category: 'replyLength_mean', text: 'Reply length', tooltip: ''},
          {category: 'OPsWithTitles_ratio', text: 'OP has title', tooltip: ''},
          {category: 'repliesPerThread_mean', text: 'Replies/thread', tooltip: 'of currently visible threads'},
          //{category: 'repliesPerIP', text: 'Replies/IP', tooltip: 'of currently visible threads'},
          {category: 'postsWithNames_ratio', text: 'Name used', tooltip: 'Includes trip codes'},
          {category: 'repliesWithImages_ratio', text: 'Reply has img', tooltip: ''},
          {category: 'repliesWithText_ratio', text: 'Reply has txt', tooltip: 'Not counting quoted postnumbers'},
          //{category: 'filesize_mean', text: 'Avg. file size', tooltip: ''},
          //{category: 'visibleFilesize_sum', text: 'Live content', tooltip: 'of currently visible threads'},
          {category: 'threadAgeSeconds_mean', text: 'Avg. thread age', tooltip: 'of currently non-locked visible threads'},
          {category: 'dataAge', text: 'Last checked', tooltip: 'more active boards get checked more frequently'},
        ]" :key="item.name" :class="['header__col', {'header__col--selected' : sortListBy == item.category, 'tooltip--bottom' : item.tooltip}, ...item.classes]" :data-hover-text="item.tooltip" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
      </div>
      <transition-group v-if="postAnalysis.a" tag="div" class="rows component-content">
        <div v-for="boardName in sortedList" :key="boardName" class="row">
          <div class="row__item tooltip--right" :data-hover-text="longBoardNames[boardName]">{{ boardName == "s4s" ? "[s4s]" : "/"+boardName+"/" }}</div>
          <div class="row__item">{{ postAnalysis[boardName].OPLength_mean.toFixed(2) }}</div>
          <div class="row__item">{{ postAnalysis[boardName].replyLength_mean.toFixed(2) }}</div>
          <div class="row__item">{{ (postAnalysis[boardName].OPsWithTitles_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="row__item">{{ postAnalysis[boardName].repliesPerThread_mean.toFixed(2) }}</div>
          <!--<div class="">{{ (postAnalysis[boardName].repliesPerIP).toFixed(2) }}</div>-->
          <div class="row__item">{{ forcedAnon.includes(boardName) ? 'forced anon' : (postAnalysis[boardName].postsWithNames_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="row__item">{{ (postAnalysis[boardName].repliesWithImages_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="row__item">{{ (postAnalysis[boardName].repliesWithText_ratio * 100).toFixed(2)+"%" }}</div>
          <!--<div class="">{{ !postAnalysis[boardName].filesize_mean ? 'OP file only' : Math.round(postAnalysis[boardName].filesize_mean / 1000)+" KB" }}</div>-->
          <!--<div class="">{{ postAnalysis[boardName].visibleFilesize_sum >= 1000000000 ? (postAnalysis[boardName].visibleFilesize_sum / 1000000000).toFixed(2)+" GB" : Math.round(postAnalysis[boardName].visibleFilesize_sum / 1000000)+" MB" }}</div>-->
          <div class="row__item">{{ postAnalysis[boardName].threadAgeStr }}</div>
          <!--<div class="">{{ Math.floor(postAnalysis[boardName].dataAge / (60 * 60))+":"+Math.round((postAnalysis[boardName].dataAge / 60) % 60).toString().padStart(2,"0")+" h" }}</div>-->
          <div class="row__item">{{ postAnalysis[boardName].dataAgeStr }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import config from "js/config"
import { mapState } from 'vuex'
export default {
	data: () => ({
    longBoardNames : config.boardNames,
		postAnalysis : {},
		sortListBy: "name",
    isListReversed: false,
    forcedAnon: ["b","soc","trash"]
	}),
	computed: {
		...mapState([
			"enabledBoards"
		]),
		sortedList: function(){
			const result = this.enabledBoards.slice()
			if(this.sortListBy == "name"){
				result.sort()
			}else{
				result.sort((a, b) => {
					return this.postAnalysis[b][this.sortListBy] - this.postAnalysis[a][this.sortListBy] + (a>b?0.00001:-0.00001)
        })
        if(this.sortListBy == "dataAge") result.reverse()
			}
			
			if(this.isListReversed) result.reverse()
			return result
		}
	},
	methods:{
		categoryClicked(sortBy){
			this.isListReversed = sortBy == this.sortListBy ? !this.isListReversed : false
			this.sortListBy = sortBy
    },
    reloadStats(animateButton = false){
      if(animateButton){
        const element = document.querySelector(".refresh-button__text")
				if(!element || element.classList.contains("refresh-button__text--clicked")) return
        
				element.classList.add("refresh-button__text--clicked")
				element.addEventListener(
					"animationend",
					event => {
						element.classList.remove("refresh-button__text--clicked")
					},{
						once: true,
						passive: true
					})
      }

      axios.get("https://api.4stats.io/allPostAnalysis")
      //axios.get("http://localhost:8080/allBoardStats")
        .then(res => {
          const nowUnix = Date.now() / 1000
          for(let board in res.data){
            res.data[board].dataAge = nowUnix - res.data[board].created_unix
            res.data[board].dataAgeStr = res.data[board].dataAge < 60 * 60 ?
              Math.floor(res.data[board].dataAge / 60) + "m" : 
              Math.floor(res.data[board].dataAge / (60 * 60)) + ":" + (Math.floor(res.data[board].dataAge / 60) % 60).toString().padStart(2,"0") + "h"
              
            res.data[board].repliesPerIP = res.data[board].repliesPerThread_mean / res.data[board].IPsPerThread_mean

            res.data[board].threadAgeStr = ""
            if(res.data[board].threadAgeSeconds_mean >= 60 * 60 * 24){
              res.data[board].threadAgeStr = Math.floor(res.data[board].threadAgeSeconds_mean / (60 * 60 * 24))+"d "
            }
            res.data[board].threadAgeStr += Math.floor(res.data[board].threadAgeSeconds_mean % (60 * 60 * 24) / (60 * 60)).toString().padStart(res.data[board].threadAgeSeconds_mean >= 60 * 60 * 10 ? 2 : 1,"0") + ":" + (Math.floor(res.data[board].threadAgeSeconds_mean % (60 * 60) / 60)).toString().padStart(2,"0") + "h"
            /*
            res.data[board].threadAgeSeconds_mean < 60 * 60 * 24 ?
              Math.floor(res.data[board].dataAge / 60) + "m" : 
              Math.floor(res.data[board].threadAgeSeconds_mean / (60 * 60)) + ":" + (Math.floor(res.data[board].threadAgeSeconds_mean / 60) % 60).toString().padStart(2,"0") + "h"
            */
          }
          this.postAnalysis = res.data
        })
        .catch(console.error)
    }
	},
	mounted(){
    this.reloadStats()
	}
}
</script>

<style scoped lang="scss">

.postAnalysis-component{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  width: 100%;
  >.partyhat{
    z-index: 9999;
    object-fit: contain;
		position: absolute;
		top: -56px;
		left: -36px;
		width: 80px;
    transform: rotate(-22deg);
    pointer-events: none;
  }
	@include desktop{
		padding: 1rem;
	}

	@include widescreen{
		padding: 1rem 2rem 2rem;
	}
}

.explanation{
  text-align: center;
  color: $--color-text;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 0.8em;
  max-width: 1024px;
  background-color: $--background-content;
  border: 2px solid $--background-content;
  @include desktop{
    @include float-shadow-box;
  }
}

.container{
  position: relative;
  &>.partyhat{
    z-index: 9999;
    object-fit: contain;
    position: absolute;
    top: -56px;
    left: -36px;
    width: 80px;
    transform: rotate(-22deg);
    pointer-events: none;
  }
  @include desktop{
    @include float-shadow-box;
  }
}

.refresh-button{
  border-radius: 4px;
  border-style: solid;
  cursor: pointer;
  position: absolute;
  height: 2rem;
  width: 2rem;
  left: calc(100% - 2.5rem);
  top: -2.5rem;
  @include float-shadow-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $--background-content;
  &__text{
    font-weight: bold;
    color: $--color-text;
    &--clicked{
      animation-duration: 1s;
      animation-name: postAnalysisRefreshAnim;
      animation-timing-function: ease-in-out;
    }
  }
}

@keyframes postAnalysisRefreshAnim {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.header, .row{
  white-space: nowrap;
  position: relative;
  display: flex;
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
  color: $--color-text-alt;
  transition: transform 0.5s ease;
  >div{
    position: relative;
    min-width: 0;
    flex: 1 1 0;
    text-align: right;
    padding: 0 1em 0 0;
    width: 8rem;
    &:first-child{
      max-width: 64px;
      flex: none;
      text-align: left;
      padding: 0 0 0 1em;
      font-weight: bold;
    }
  }
}

.header{
  position: sticky;
	top: 0;
  z-index: 100;
  line-height: 2.25rem;
  background: $--background-title;
  &__col{
    &::before{
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 3px;
      width: 100%;
      background: $--color-selected-background;
      transform: scaleY(0);
      transform-origin: center bottom;
      transition: transform 0.25s ease;
    }
    &--selected::before{
      transform: scaleY(1);
    }
  }
}

.row{
  line-height: 1.25rem;
  &:nth-of-type(2n){
    background: $--background-content-2n;
  }
  border-top: 1px solid rgba(0,0,0,0.5);
  &:hover{
    background-color: $--color-hover;
  }
}

///////////
// Hover //
///////////

[data-hover-text]:hover::after{
  line-height: 2;
  z-index: 999;
  position: absolute;
  content: attr(data-hover-text);
  white-space: nowrap;
  padding: 0 1em;
  white-space: nowrap;
  background-color: rgba(0,0,0,0.85);
  color: $--color-text-alt;
}

.tooltip--bottom{
  text-decoration: underline dotted;
}

.tooltip--bottom:hover::after{
  left: 0px;
  top: 125%;
}

.tooltip--right:hover::after{
    left: 100%;
}
</style>