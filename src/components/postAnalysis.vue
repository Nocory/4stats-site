<template>
  <div class="postAnalysis-component">
    <p class="explanation has-text-centered">
      While the main page shows data calculated from the catalog, these numbers are based on individual posts.<br>
      Checking all threads on all boards takes a longer time, so updates are less frequent.<br>
      Stats are calculated from currently visible content and any seen posts made in the last 3 days.<br>
      'Replies/thread' and 'Avg. thread age' values are calculated from visible threads only.<br>
      (not mobile friendly)
    </p>
    <div class="container is-fluid">
      <!--<img src="../static/xmashat.gif" class="partyhat is-hidden-touch">-->
      <div class="boardlist__header">
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
        ]" :key="item.name" :class="[sortListBy == item.category ? 'category-selected' : '', ...item.classes]" :data-hover-text="item.tooltip" class="tooltip-bottom" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
      </div>
      <transition-group v-if="postAnalysis.a" tag="div" class="">
        <div v-for="boardName in sortedList" :key="boardName" class="boardlist__row">
          <div :data-hover-text="longBoardNames[boardName]" class="tooltip-right">/{{ boardName }}/</div>
          <div class="">{{ postAnalysis[boardName].OPLength_mean.toFixed(2) }}</div>
          <div class="">{{ postAnalysis[boardName].replyLength_mean.toFixed(2) }}</div>
          <div class="">{{ (postAnalysis[boardName].OPsWithTitles_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ postAnalysis[boardName].repliesPerThread_mean.toFixed(2) }}</div>
          <!--<div class="">{{ (postAnalysis[boardName].repliesPerIP).toFixed(2) }}</div>-->
          <div class="">{{ forcedAnon.includes(boardName) ? 'forced anon' : (postAnalysis[boardName].postsWithNames_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ (postAnalysis[boardName].repliesWithImages_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ (postAnalysis[boardName].repliesWithText_ratio * 100).toFixed(2)+"%" }}</div>
          <!--<div class="">{{ !postAnalysis[boardName].filesize_mean ? 'OP file only' : Math.round(postAnalysis[boardName].filesize_mean / 1000)+" KB" }}</div>-->
          <!--<div class="">{{ postAnalysis[boardName].visibleFilesize_sum >= 1000000000 ? (postAnalysis[boardName].visibleFilesize_sum / 1000000000).toFixed(2)+" GB" : Math.round(postAnalysis[boardName].visibleFilesize_sum / 1000000)+" MB" }}</div>-->
          <div class="">{{ postAnalysis[boardName].threadAgeStr }}</div>
          <!--<div class="">{{ Math.floor(postAnalysis[boardName].dataAge / (60 * 60))+":"+Math.round((postAnalysis[boardName].dataAge / 60) % 60).toString().padStart(2,"0")+" h" }}</div>-->
          <div class="">{{ postAnalysis[boardName].dataAgeStr }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
const pino = require("js/pino")
const axios = require("axios")
import { mapState, mapGetters } from 'vuex'
export default {
	data: () => ({
    longBoardNames : require('js/config').boardNames,
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
		}
	},
	mounted(){
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
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.postAnalysis-component{
  position: relative;
  z-index: 10;
  background: $--color-background;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.explanation{
  color: $--color-text;
  margin: 1rem 1rem 0;
  padding: 0.5rem;
  font-size: 0.8em;
  max-width: 1024px;
  background-color: $--color-highlight-2;
  border: 2px solid $--color-highlight-1;
  @include desktop{
    @include float-shadow-box;
  }
}

.container{
  height: 100%;
	&.is-fluid{
		@include touch{
			margin: 0 1rem;
      max-width: 100%;
		}
		@include desktop{
      margin: 0 1rem;
      @include float-shadow-box;
      max-width: 95%;
		}
		@include widescreen{
			margin: 1rem 0rem;
		}
  }
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
}

.boardlist__header, .boardlist__row{
  white-space: nowrap;
  position: relative;
  display: flex;
  font-size: 0.8rem;
  color: $--color-text-minor;
  transition: color 0.1s ease, background-color 0.1s ease, transform 0.5s ease;
  >div{
    position: relative;
    flex: 1 1 0;
    text-align: right;
    padding: 0 1em 0 0;
    &:first-child{
      width: 64px;
      flex: none;
      text-align: left;
      padding: 0 0 0 1em;
      font-weight: bold;
    }
    &:not(:first-child){
      min-width: 7.5rem;
    }
    >.board-has-sticky{
      position: absolute;
      top: 20%;
      left: 64px;
      content: url("../static/sticky.gif");
      height: 60%;
      object-fit: cover;
      z-index: 9;
    }
  }
}

.boardlist__header{
  cursor: pointer;
  line-height: 2.25rem;
  background-color: $--color-highlight-1;
  background: rgba(0,0,0,0.8);
  >div{
    //overflow: hidden;
    &::before{
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 3px;
      width: 100%;
      background: $nord6;
      transform: scaleY(0);
      transform-origin: center bottom;
      transition: transform 0.25s ease;
    }
    &.category-selected::before{
      transform: scaleY(1);
    }
  }
}

.boardlist__row{
  line-height: 1.25rem;
  background-color: $--color-highlight-2;
  &:nth-of-type(2n){
    background-color: $--color-highlight-1;
  }
  border-top: 1px solid rgba(0,0,0,0.5);
  &:hover{
    color: $--color-text;
    background-color: $--color-update;
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
  color: $--color-text-minor;
}

.tooltip-bottom:not([data-hover-text=""]){
  text-decoration: underline dotted;
}

[data-hover-text].tooltip-bottom:hover::after{
  left: 0px;
  top: 125%;
}

[data-hover-text].tooltip-right:hover::after{
    left: 100%;
}
</style>