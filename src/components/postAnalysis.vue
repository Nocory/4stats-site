<template>
  <div class="postAnalysis-component">
    <p class="explanation has-text-centered">
      While the main page shows data calculated from the catalog, these numbers are based on individual posts.<br>
      Checking all threads on all boards takes a longer time, so updates are less frequent.<br>
      Stats are calculated from currently visible content and any seen posts made in the last 3 days.<br>
      (not mobile friendly
    </p>
    <div class="container is-fluid">
      <img src="../static/xmashat.gif" class="partyhat is-hidden-touch">
      <div class="boardlist__header">
        <div v-for="item in [
          {category: 'name', text: 'Board', tooltip: ''},
          {category: 'OPLength_mean', text: 'OP length', tooltip: ''},
          {category: 'replyLength_mean', text: 'Reply length', tooltip: ''},
          {category: 'OPsWithTitles_ratio', text: 'OP has title', tooltip: ''},
          {category: 'postsWithNames_ratio', text: 'Name used', tooltip: ''},
          {category: 'postsWithImages_ratio', text: 'Reply has image', tooltip: ''},
          {category: 'postsWithText_ratio', text: 'Reply has text', tooltip: ''},
          {category: 'sentimentScore_mean', text: 'Sentiment Score', tooltip: ''},
          {category: 'sentimentComparative_mean', text: 'Sentiment Comp.', tooltip: ''},
          {category: 'threadAgeSeconds_mean', text: 'Avg. thread age', tooltip: ''},
          {category: 'dataAgeHours', text: 'Last checked', tooltip: ''},
        ]" :key="item.name" :class="[sortListBy == item.category ? 'category-selected' : '', ...item.classes]" :data-hover-text="item.tooltip" class="tooltip-bottom" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
      </div>
      <transition-group v-if="postAnalysis.a" tag="div" class="">
        <div v-for="boardName in sortedList" :key="boardName" :id="'board-'+boardName" class="boardlist__row">
          <div :data-hover-text="longBoardNames[boardName]" class="tooltip-right">/{{ boardName }}/</div>
          <div class="">{{ postAnalysis[boardName].OPLength_mean.toFixed(2) }}</div>
          <div class="">{{ postAnalysis[boardName].replyLength_mean.toFixed(2) }}</div>
          <div class="">{{ (postAnalysis[boardName].OPsWithTitles_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ forcedAnon.includes(boardName) ? 'forced anon' : (postAnalysis[boardName].postsWithNames_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ (postAnalysis[boardName].postsWithImages_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ (postAnalysis[boardName].postsWithText_ratio * 100).toFixed(2)+"%" }}</div>
          <div class="">{{ (postAnalysis[boardName].sentimentScore_mean).toFixed(2) }}</div>
          <div class="">{{ (postAnalysis[boardName].sentimentComparative_mean).toFixed(4) }}</div>
          <div class="">{{ Math.floor(postAnalysis[boardName].threadAgeSeconds_mean / (60 * 60 * 24))+"d "+((postAnalysis[boardName].threadAgeSeconds_mean / (60 * 60)) % 24).toFixed(1).padStart(4,"⠀")+"h" }}</div>
          <div class="">{{ (postAnalysis[boardName].dataAgeHours).toFixed(2)+" h" }}</div>
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
					return this.postAnalysis[b][this.sortListBy] - this.postAnalysis[a][this.sortListBy] + (a>b?0.0001:-0.0001)
				})
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
      .then(res => {
        const nowUnix = Date.now() / 1000
        for(let board in res.data){
          res.data[board].dataAgeHours = (nowUnix - res.data[board].created_unix) / (60 * 60)
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
      max-width: 80%;
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
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
  color: $--color-text-minor;
  transition: color 0.5s ease, background-color 0.5s ease, transform 0.5s ease;
  >div{
    overflow: hidden;
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
      min-width: 8rem;
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
  line-height: 2.25rem;
  background-color: $--color-highlight-1;
  background: rgba(0,0,0,0.8);
  >div{
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
  &.board-selected>div{
    background-color: $--color-background-selected;
    color: $--color-text-selected;
    //transition: color 0s, background-color 0s;
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

[data-hover-text].tooltip-bottom:hover::after{
  left: 0px;
  top: 125%;
}

[data-hover-text].tooltip-right:hover::after{
    left: 100%;
}

////////////////
// Animations //
////////////////

.just-updated>div {
  animation-duration: 3s;
  animation-name: updateAnim;
  animation-timing-function: ease-out;
  z-index: 99;
}

@keyframes updateAnim {
  0% {
    background-color: transparent;
  }
  10% {
    background-color: $--color-update;
  }
  55% {
    background-color: $--color-update;
  }
  100% {
    background-color: transparent;
  }
}
</style>