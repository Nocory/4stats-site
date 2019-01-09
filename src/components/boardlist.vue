<template>
  <div class="boardlist-component">
    <!--<img src="../static/xmashat.gif" class="partyhat is-hidden-touch">-->
    <div class="boardlist__header">
      <div v-for="item in [
        {category: 'name', text: 'Board', tooltip: ''},
        {category: 'postsPerMinute', text: 'Posts/min', tooltip: 'Over the last 15 minutes'},
        {category: 'threadsPerHour', text: 'Threads/hour', tooltip: 'Over the last hour', classes: ['is-hidden-touch','is-hidden-desktop-only']},
        {category: 'avgPostsPerDay', text: 'Avg.Posts/day', tooltip: 'Over the last 4 weeks. Weighted towards more recent weeks.'},
        {category: 'relativeActivity', text: 'rel. to peak', tooltip: 'Current posts/minute relative to the boards usual peak daily posts/minute', classes: ['is-hidden-touch','is-hidden-desktop-only', 'is-hidden-widescreen-only']},
        {category: 'activityThisToD', text: 'rel. to ToD', tooltip: 'Current posts/minute relative to the boards average posts/minute this time of day over the last 8 weeks', classes: ['is-hidden-touch']},
      ]" :key="item.name" :class="[sortBoardListBy == item.category ? 'category-selected' : '', ...item.classes]" :data-hover-text="item.tooltip" class="tooltip-bottom" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
    </div>
    <transition-group v-if="combinedBoardStats.avgPostsPerDay" tag="div" class="">
      <div v-for="boardName in sortedBoardlist" :key="boardName" :id="'board-'+boardName" :class="{'board-selected' : (selectedBoard == boardName)}" class="boardlist__row" @click.stop="boardClicked(boardName)">
        <!--<div :data-hover-text="longBoardNames[boardName]" class="tooltip-right" v-once>{{ boardName == "s4s" ? "[s4s]" : `/${boardName}/` }}</div>-->
        <div :data-hover-text="longBoardNames[boardName]" class="tooltip-right"><div class="board-has-sticky" v-if="boardData[boardName].hasSticky"></div>{{ boardName == "s4s" ? "[s4s]" : "/"+boardName+"/" }}</div>
        <div class="">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
        <div class="is-hidden-touch is-hidden-desktop-only">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
        <div class="">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
        <div class="is-hidden-touch is-hidden-desktop-only is-hidden-widescreen-only">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
        <div class="is-hidden-touch">{{ boardData[boardName].activityThisToD >= 0 ? Math.round(boardData[boardName].activityThisToD * 100) + "%" : "-" }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
const pino = require("js/pino")
export default {
	data: () => ({
		longBoardNames : require('js/config').boardNames,
		sortBoardListBy: localStorage.getItem("sortBoardListBy") || "avgPostsPerDay",
		isThreadlistReversed: false
	}),
	computed: {
		...mapState([
			"boardData",
			"enabledBoards",
			"selectedBoard"
		]),
		...mapGetters([
			'combinedBoardStats'
		]),
		sortedBoardlist: function(){
			const result = this.enabledBoards.slice()
			if(this.sortBoardListBy == "name"){
				result.sort()
			}else{
				result.sort((a, b) => {
					return this.boardData[b][this.sortBoardListBy] - this.boardData[a][this.sortBoardListBy] + (a>b?0.0001:-0.0001)
				})
			}
			
			if(this.isThreadlistReversed) result.reverse()
			return result
		}
	},
	methods:{
		categoryClicked(sortBy){
			this.isThreadlistReversed = sortBy == this.sortBoardListBy ? !this.isThreadlistReversed : false
			this.sortBoardListBy = sortBy
			localStorage.setItem("sortBoardListBy",sortBy)
		},
		boardClicked(board){
			this.$store.dispatch('boardClicked',board)
		}
	},
	mounted(){
		this.$store.subscribe(mutation => {
			if(mutation.type == "updateBoardData" && mutation.payload.board != this.selectedBoard){
				const element = document.getElementById("board-" + mutation.payload.board)
				if(!element || element.classList.contains("just-updated")) return
        
				element.classList.add("just-updated")
				element.addEventListener(
					"animationend",
					event => {
						element.classList.remove("just-updated")
						pino.debug(event.target, mutation.payload.board, "removed 'just-updated'")
					},{
						once: true,
						passive: true
					})
			}
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.boardlist-component{
  position: relative;
  z-index: 10;
  @include desktop{
    margin: 1rem 0;
    @include float-shadow-box;
  }
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