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
      <transition-group name="flip-list" class="board-rows">
        <div class="board-row" v-for="boardName in enabledBoardsCopy" :key="boardName">
          <div :ref="boardName" @click.stop="boardClicked(boardName)" class="board-data-wrapper" :class="{'board-selected' : (selectedBoard == boardName)}">
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
		enabledBoardsCopy: [],
		isThreadlistReversed: false
	}),
	computed: {
		...mapState([
			"boardData",
			"enabledBoards",
			"selectedBoard"
		]),
	},
	methods:{
		categoryClicked(sortBy){
			this.isThreadlistReversed = sortBy == this.sortBoardListBy ? !this.isThreadlistReversed : false
			this.sortBoardListBy = sortBy
			localStorage.setItem("sortBoardListBy",sortBy)
			this.sortBoardList()
		},
		boardClicked(board){
			this.$store.dispatch('boardClicked',board)
		},
		sortBoardList(){
			if(this.sortBoardListBy == "name"){
				this.enabledBoardsCopy.sort((a, b) => {
					if (a < b) return -1
					if (a > b) return 1
					return 0
				})
			}else{
				this.enabledBoardsCopy.sort((a, b) => {
					return this.boardData[b][this.sortBoardListBy] - this.boardData[a][this.sortBoardListBy] + (a>b?0.0001:-0.0001)
				})
			}
			
			if(this.isThreadlistReversed) this.enabledBoardsCopy.reverse()
		}
	},
	created(){
		this.enabledBoardsCopy = this.enabledBoards.slice()
		this.$store.subscribe(mutation => {
			if(mutation.type == "setEnabledBoards" || mutation.type == "setInitialData"){
				this.enabledBoardsCopy = this.enabledBoards.slice()
				this.sortBoardList()
			}
		})
		this.$store.subscribe(mutation => {
			if(
				mutation.type == "updateBoardData"
        &&
        !document.hidden
        &&
        this.$refs[mutation.payload.board]
        &&
        this.$refs[mutation.payload.board].length != 0
        &&
        !this.$refs[mutation.payload.board][0].classList.contains("tableHighlight")
			){
				let element = this.$refs[mutation.payload.board][0]
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
				this.sortBoardList()
			}
		})
	},
	mounted() {

	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.boardlist-wrapper{
  background: $oc-gray-0;
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
}

.board-data-wrapper{
  display: flex;
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
  //overflow: hidden;
  height: 2.25rem;
  &>.board-data{ // categories
    white-space: nowrap;
    position: relative;
    &::after{ // underline when category selected
      z-index: 2;
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0%;
      height: 3px;
      width: 100%;
      background: $--colorHighlight !important;
      transform: scaleY(0);
      transform-origin: center bottom;
      transition: all 0.5s ease-out;
    }
    @include desktop{
      &:hover::before{
        z-index: 100;
        content: attr(data-hover-text);
        left: 32px;
        top: 150%;
        position: absolute;
        white-space: nowrap;
        padding: 0 1em;
        background-color: rgba(0,0,0,0.75);
        color: #f1f1f1;
        opacity: 0;
        animation: 0.25s ease-in-out 0.25s forwards hoverTextAnim;
      }
    }
    &.category-selected{
      position: relative;
      &::after{
        transform: scaleY(1);
      }
    }
  }
}

.board-rows{
  &>.board-row{
    position: relative;
    border-top: 1px solid rgba(0,0,0,0.25);
    transition: background-color 0.5s, transform 0.5s;
    &:nth-of-type(2n){
      background-color: $oc-gray-2;
    }
    &>.board-data-wrapper{
    height: 1.25rem;
      &.board-selected{
        background-color: $--colorSelected;
        color: $oc-gray-0;
      }
      @include desktop{
        &>.board-name:hover::after{
          content: attr(data-hover-text);
          white-space: nowrap;
          padding: 0 1em;
          position: absolute;
          left: 100%;
          background-color: rgba(0,0,0,0.75);
          color: #f1f1f1;
        }
      }
    }
  }
}

// animations

.flip-list-move {
  transition: transform 0.5s ease-out;
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
    background-color: $--colorEvent;
  }
  50% {
    background-color: $--colorEvent;
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