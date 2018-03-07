<template>
  <div class="boardlist-component">
    <h4 class="is-size-5-mobile is-size-4 headline is-hidden-mobile">
      Live Board Statistics
    </h4>
    
    <div class="boardlist-wrapper">
      <div class="boardlist-header board-data-wrapper">
        <div @click.stop="categoryClicked('name')" class="board-data board-name" :class="{'category-selected' : sortBoardListBy == 'name'}">Board</div>
        <div @click.stop="categoryClicked('postsPerMinute')" class="board-data" :class="{'category-selected' : sortBoardListBy == 'postsPerMinute'}" data-hover-text="Over the last hour">Posts/min</div>
        <div @click.stop="categoryClicked('threadsPerHour')" class="board-data is-hidden-touch" :class="{'category-selected' : sortBoardListBy == 'threadsPerHour'}" data-hover-text="Over the last hour">Threads/hour</div>
        <div @click.stop="categoryClicked('avgPostsPerDay')" class="board-data" :class="{'category-selected' : sortBoardListBy == 'avgPostsPerDay'}" data-hover-text="Over the last 4 weeks. Weighted towards more recent weeks.">Avg.Posts/day</div>
        <div @click.stop="categoryClicked('imagesPerReply')" class="board-data is-hidden-touch is-hidden-desktop-only" :class="{'category-selected' : sortBoardListBy == 'imagesPerReply'}" data-hover-text="Posts with files attached">Images</div>
        <div @click.stop="categoryClicked('relativeActivity')" class="board-data" :class="{'category-selected' : sortBoardListBy == 'relativeActivity'}" data-hover-text="Current posts-per-minute relative to the boards usual top ppm rate">Activity Now</div>
      </div>
      <transition-group name="flip-list" class="board-rows" tag="div">
        <div class="board-row" v-for="boardName in sortedBoardlist" :key="boardName">
          <div :id="'board-'+boardName" @click.stop="boardClicked(boardName)" class="board-data-wrapper" :class="{'board-selected' : (selectedBoard == boardName)}">
            <div :data-hover-text="longBoardNames[boardName]" class="board-data board-name">/{{ boardName }}/</div>
            <div class="board-data ">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
            <div class="board-data is-hidden-touch">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
            <div class="board-data ">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
            <div class="board-data is-hidden-touch is-hidden-desktop-only">{{ Math.round(boardData[boardName].imagesPerReply * 100) }}%</div>
            <div class="board-data ">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
		sortedBoardlist: function(){
			const result = this.enabledBoards.slice()
			if(this.sortBoardListBy == "name"){
				result.sort((a, b) => {
					if (a < b) return -1
					if (a > b) return 1
					return 0
				})
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
						event.target.classList.remove("just-updated")
					},
					{
						once: true,
						passive: true
					}
				)
			}
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.boardlist-wrapper{
  //border-top: 4px solid rgba(255,255,255,0.8);
  //border-top: 4px solid rgba(255,255,255,0.25);
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
  //box-shadow: 0px 0px 24px -4px rgba(0,0,0,0.5);
  @include tablet{
    @include float-shadow-box;
  }
  
  //background-color: $--color-boardlist-header;
}

.board-data-wrapper{
  display: flex;
  color: $--color-text-minor;

  &>.board-data{
    flex: 2 1 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1em 0 0;
    &.board-name{
      justify-content: flex-start;
      padding: 0 0 0 1em;
      flex: 1 1 0;
      text-align: left;
      font-weight: bold;
      position: relative;
    }
  }
}

.boardlist-header{
  background-color: $--color-boardlist-header;
  //overflow: hidden;
  height: 2.25rem;
  &>.board-data{ // categories
    position: relative;
    white-space: nowrap;
    &::before{ // underline when category selected
      z-index: 2;
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
      transition: all 0.5s ease-out;
    }
    &.category-selected{
      &::before{
        transform: scaleY(1);
        //opacity: 1;
      }
    }
  }
}

.board-row{
  position: relative;
  border-top: 1px solid rgba(0,0,0,0.25);
  transition: background-color 0.5s ease-out, transform 0.5s;
  
  background-color: $--color-highlight-2;
  &:nth-of-type(2n){
    background-color: $--color-highlight-1;
  }

  &>.board-data-wrapper{
    height: 1.25rem;
    
    &.board-selected{
      background-color: $--color-background-selected;
      color: $--color-text-selected;
    }
  }
}

////////////////////
// Hover elements //
////////////////////
@include desktop{
  .board-name:hover::after{
    content: attr(data-hover-text);
    white-space: nowrap;
    padding: 0 1em;
    position: absolute;
    left: 100%;
    background-color: rgba(0,0,0,0.85);
    color: $--color-text-minor;
  }

  .boardlist-header>.board-data:hover::after{
    z-index: 900;
    content: attr(data-hover-text);
    left: 32px;
    top: 150%;
    position: absolute;
    white-space: nowrap;
    padding: 0 1em;
    background-color: rgba(0,0,0,0.85);
    color: $--color-text-minor;
    opacity: 0;
    animation: 0.25s ease-in-out 0.25s forwards hoverTextAnim;
  }
}

////////////////
// Animations //
////////////////
.flip-list-move {
  //transition: transform 0.5s ease-out, background-color 0.1s ease;
  transition: transform 1s ease-out, background-color 0.1s ease;
  &.board-row{
    position: relative;
    //transform: translateX(-12px);
    //background-color: rgba(0,0,0,0.0);
  }
}

.just-updated {
  animation-duration: 3s;
  animation-name: updateAnim;
  animation-timing-function: ease-out;
  z-index: 99;
}

@keyframes updateAnim {
  0% {
    background-color: inherit;
  }
  10% {
    background-color: $--color-update;
  }
  55% {
    background-color: $--color-update;
  }
  100% {
    background-color: inherit;
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