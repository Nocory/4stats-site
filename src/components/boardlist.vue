<template>
  <div class="boardlist-component">
    <h4 class="is-size-4 headline is-hidden-mobile">
      Live Board Statistics
    </h4>
    <div class="board-row board-row--header">
      <div v-for="item in [
        {category: 'name', text: 'Board', tooltip: ''},
        {category: 'postsPerMinute', text: 'Posts/min', tooltip: 'Over the last hour'},
        {category: 'threadsPerHour', text: 'Threads/hour', tooltip: 'Over the last hour', classes: ['is-hidden-touch']},
        {category: 'avgPostsPerDay', text: 'Avg.Posts/day', tooltip: 'Over the last 4 weeks. Weighted towards more recent weeks.'},
        {category: 'imagesPerReply', text: 'Images', tooltip: 'Posts with files attached', classes: ['is-hidden-touch','is-hidden-desktop-only']},
        {category: 'relativeActivity', text: 'Activity Now', tooltip: 'Current posts-per-minute relative to the boards usual top ppm rate'},
      ]" :key="item.name" :class="[sortBoardListBy == item.category ? 'category-selected' : '', ...item.classes]" :data-hover-text="item.tooltip" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
    </div>
    <transition-group v-if="combinedBoardStats.imagesPerReply" tag="div" class="">
      <div v-for="boardName in sortedBoardlist" :key="boardName" :id="'board-'+boardName" :class="{'board-selected' : (selectedBoard == boardName)}" class="board-row" @click.stop="boardClicked(boardName)">
        <div :data-hover-text="longBoardNames[boardName]" class="">/{{ boardName }}/</div>
        <div class="">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
        <div class="is-hidden-touch">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
        <div class="">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
        <div class="is-hidden-touch is-hidden-desktop-only">{{ Math.round(boardData[boardName].imagesPerReply * 100) }}%</div>
        <div class="">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
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
	created(){
    
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
}

.board-row{
  position: relative;
  display: flex;
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
  line-height: 1.25rem;
  color: $--color-text-minor;
  &:not(&--header){
    border-top: 1px solid rgba(0,0,0,0.5);
    /*
    &:nth-child(10n+1):not(:first-child){
      border-top: 2px solid rgba(0,0,0,0.85);
    }
    */
  }
  transition: color 0.5s ease, background-color 0.5s ease, transform 0.5s ease;
  
  background-color: $--color-highlight-2;
  &:nth-of-type(2n){
    background-color: $--color-highlight-1;
  }
  &.board-selected{
    background-color: $--color-background-selected;
    color: $--color-text-selected;
    transition: color 0s, background-color 0s;
  }
  
  >div{
    position: relative;
    flex: 2 1 0;
    text-align: right;
    padding: 0 1em 0 0;
    &:first-child{
      flex: 1 1 0;
      text-align: left;
      padding: 0 0 0 1em;
      font-weight: bold;
    }
  }
}

.board-row--header{
  background-color: $--color-highlight-1;
  line-height: 2.25rem;
  >div{
    position: relative;
    white-space: nowrap;

    // underline when category selected
    &::before{
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 3px;
      width: 100%;
      background: $nord6 !important;
      transform: scaleY(0);
      //opacity: 0;
      transform-origin: center bottom;
      transition: transform 0.25s ease;
    }
    &.category-selected::before{
      transform: scaleY(1);
    }
  }
}

////////////////////
// Hover elements //
////////////////////
@include desktop{
  .board-row>div:first-child:hover::after{
    line-height: 2;
    z-index: 999;
    position: absolute;
    content: attr(data-hover-text);
    white-space: nowrap;
    padding: 0 1em;
    left: 100%;
    white-space: nowrap;
    background-color: rgba(0,0,0,0.85);
    color: $--color-text-minor;
  }

  .board-row--header>div:hover::after{
    line-height: 2;
    z-index: 999;
    position: absolute;
    content: attr(data-hover-text);
    white-space: nowrap;
    padding: 0 1em;
    left: 0px;
    top: 125%;
    white-space: nowrap;
    background-color: rgba(0,0,0,0.85);
    color: $--color-text-minor;
    //opacity: 0;
    //animation: 0.25s ease-in-out 0s forwards hoverTextAnim;
  }
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

@keyframes hoverTextAnim {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>