<template>
  <div class="boardlist-component">
    <!--<img src="../static/xmashat.gif" class="partyhat is-hidden-touch">-->
    <div class="header">
      <div v-for="item in [
        {category: 'name', text: 'Board', tooltip: ''},
        {category: 'postsPerMinute', text: 'Posts/min', tooltip: 'Over the last 15 minutes'},
        {category: 'threadsPerHour', text: 'Threads/hour', tooltip: 'Over the last hour', classes: ['is-hidden-below-widescreen']},
        {category: 'avgPostsPerDay', text: 'Avg.Posts/day', tooltip: 'Over the last 4 weeks. Weighted towards more recent weeks.'},
        {category: 'relativeActivity', text: 'Activity Now', tooltip: 'Current activity relative to the boards usual daily posts/minute peak', classes: ['']},
        {category: 'activityThisToD', text: 'rel. to ToD', tooltip: 'Current activity relative to the boards average posts/minute this time of day over the last 8 weeks', classes: ['is-hidden-below-fullhd']},
      ]" :key="item.name" :class="['header__col',{'header__col--selected' : sortBoardListBy == item.category, 'tooltip--bottom' : item.tooltip}, ...item.classes]" :data-hover-text="item.tooltip" @click.stop="categoryClicked(item.category)">{{ item.text }}</div>
    </div>
    <transition-group v-if="combinedBoardStats.avgPostsPerDay" tag="div" class="rows component-content">
      <div v-for="boardName in sortedBoardlist" :key="boardName" :id="'board-'+boardName" :class="{'row--selected' : (selectedBoard == boardName)}" class="row" @click.stop="boardClicked(boardName)">
        <div v-once :data-hover-text="longBoardNames[boardName]" class="tooltip--right">{{ boardName == "s4s" ? "[s4s]" : "/"+boardName+"/" }}</div>
        <div class="">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
        <div class="is-hidden-below-widescreen">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
        <div class="">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
        <div class="">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
        <div class="is-hidden-below-fullhd">{{ boardData[boardName].activityThisToD >= 0 ? Math.round(boardData[boardName].activityThisToD * 100) + "%" : "-" }}</div>
        <img class="row--has-sticky" v-if="boardData[boardName].hasSticky" src="../static/sticky.gif">
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import pino from "js/pino"
import config from 'js/config'
export default {
	data: () => ({
		longBoardNames : config.boardNames,
		sortBoardListBy: localStorage.getItem("sortBoardListBy") || "avgPostsPerDay",
		reverseOrder: false
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
			
			if(this.reverseOrder) result.reverse()
			return result
		}
	},
	methods:{
		categoryClicked(sortBy){
			this.reverseOrder = sortBy == this.sortBoardListBy ? !this.reverseOrder : false
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

.boardlist-component{
  position: relative;
  z-index: 10;
  @include desktop{
    @include float-shadow-box;
  }
  >.partyhat{
    z-index: 100;
    object-fit: contain;
		position: absolute;
		top: -56px;
		left: -36px;
		width: 80px;
    transform: rotate(-22deg);
    pointer-events: none;
  }
}

.header, .row{
  position: relative;
  display: flex;
  cursor: pointer;
  font-size: 0.8rem;
  color: $--color-text;
  transition: transform 0.5s ease;
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
  }
}

.header{
  z-index: 100;
  height: 2.25rem;
  align-items: stretch;
  background: $--background-title;
  &__col{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    &:first-child{
      width: 64px;
      flex: none;
      justify-content: flex-start;
      padding: 0 0 0 1em;
      font-weight: bold;
    }
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
  &--selected{
    background-color: $--color-selected-background !important;
    color: $--color-selected-text;
  }
  &--has-sticky{
    position: absolute;
    top: 12.5%;
    left: 64px;
    height: 75%;
    object-fit: cover;
    z-index: 99;
    background-color: transparent;
  }
}

///////////
// Hover //
///////////

[data-hover-text]:hover::after{
  line-height: 2;
  z-index: 101;
  position: absolute;
  content: attr(data-hover-text);
  padding: 0.25rem 1rem;
  white-space: nowrap;
  background-color: rgba(0,0,0,0.85);
  //border: 1px solid $--color-text;
  @include float-shadow-box;
  color: $--color-text;
  @include touch{
    display: none;
  }
}

.tooltip--bottom{
  text-decoration: underline dotted;
  &:hover::after{
    left: 0px;
    top: 125%;
  }
}

.tooltip--right:hover::after{
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
    background-color: $--color-hover;
  }
  55% {
    background-color: $--color-hover;
  }
  100% {
    background-color: transparent;
  }
}
</style>