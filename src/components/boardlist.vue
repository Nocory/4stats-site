<template>
  <div class="component">
    <h4 class="title is-size-4 headline">
      Live Board Statistics
    </h4>
    
    <div class="boardlist-wrapper">
      <div class="boardlist-header board-row">
        <div @click="categoryClicked('name')" class="board-name" :class="{'category-selected' : sortBoardListBy == 'name'}">
          <span>Board</span>
        </div>
        <div @click="categoryClicked('postsPerMinute')" :class="{'category-selected' : sortBoardListBy == 'postsPerMinute'}"><abbr title="Over the last hour">Posts/min</abbr></div>
        <div @click="categoryClicked('threadsPerHour')" class="is-hidden-touch" :class="{'category-selected' : sortBoardListBy == 'threadsPerHour'}"><abbr title="Over the last hour">Threads/hour</abbr></div>
        <div @click="categoryClicked('avgPostsPerDay')" :class="{'category-selected' : sortBoardListBy == 'avgPostsPerDay'}"><abbr title="Over the last 4 weeks. Weighted towards more recent weeks.">Avg.Posts/day</abbr></div>
        <div @click="categoryClicked('imagesPerReply')" class="is-hidden-touch" :class="{'category-selected' : sortBoardListBy == 'imagesPerReply'}"><abbr title="Posts with files attached" style="white-space: nowrap;">Images</abbr></div>
        <div @click="categoryClicked('relativeActivity')" :class="{'category-selected' : sortBoardListBy == 'relativeActivity'}"><abbr title="Current posts-per-minute relative to the boards usual top ppm rate" style="white-space: nowrap;">Activity Now</abbr></div>
      </div>
      <transition-group name="flip-list" class="boardlist-rows">
        <div
          v-for="boardName in enabledBoardsCopy"
          :ref="boardName" :key="boardName"
          @click="boardClicked(boardName)" class="board-row"
          :class="{'board-selected' : (selectedBoard == boardName)}"
        >
          <div :data-long-board-name="longBoardNames[boardName]" class="board-name">/{{ boardName }}/</div>
          <div class="">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
          <div class="is-hidden-touch">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
          <div class="">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
          <div class="is-hidden-touch">{{ Math.round(boardData[boardName].imagesPerReply * 100) }}%</div>
          <div class="">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	data: () => ({
		longBoardNames : require('../js/config').boardNames,
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
		this.$store.subscribe(mutation => {
			if(mutation.type == "setEnabledBoards" || mutation.type == "setInitialData"){
				this.enabledBoardsCopy = this.enabledBoards.slice()
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

// boardlist-header & boardlist-rows
.board-row{
  display: flex;
  &>div{
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

// boardlist-header

.boardlist-header{
  overflow: hidden;
  &>div{
    position: relative;
    height: 2rem;
    // underline when categry selected
    &::after{
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0%;
      height: 3px;
      width: 100%;
      background: $--colorHighlight !important;
      transform: translateY(3px);
      transition: all 0.5s ease-out;
    }
    &.category-selected{
      position: relative;
      &::after{
        transform: translateY(0px);
      }
    }
  }
}

// boardlist-rows

.boardlist-rows>div{
  border-top: 1px solid rgba(0,0,0,0.25);
  height: 1.25rem;
  transition: background-color 0.5s, transform 0.5s;
  &:nth-of-type(2n){
    background-color: $oc-gray-2;
  }
  &.board-selected{
    background-color: $--colorSelected;
    color: $oc-gray-9;
  }
  &>.board-name{
    &:hover:after{
      content: attr(data-long-board-name);
      white-space: nowrap;
      padding: 0 1em;
      position: absolute;
      left: 100%;
      top: 0;
      background-color: rgba(0,0,0,0.75);
      color: #f1f1f1;
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
</style>