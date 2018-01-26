<template>
  <div class="component">
    <h4 class="title is-size-4 headline">
      Live Board Statistics
    </h4>
    
    <div class="boardlist-wrapper">
      <div class="boardlist-header board_row">
        <div @click="sortClicked('name')" class="board-name" :class="{'category-selected' : sortThreadlistBy == 'name'}">
          <span>Board</span>
        </div>
        <div @click="sortClicked('postsPerMinute')" :class="{'category-selected' : sortThreadlistBy == 'postsPerMinute'}"><abbr title="Over the last hour">Posts/min</abbr></div>
        <div @click="sortClicked('threadsPerHour')" class="is-hidden-touch" :class="{'category-selected' : sortThreadlistBy == 'threadsPerHour'}"><abbr title="Over the last hour">Threads/hour</abbr></div>
        <div @click="sortClicked('avgPostsPerDay')" :class="{'category-selected' : sortThreadlistBy == 'avgPostsPerDay'}"><abbr title="Over the last 4 weeks. Weighted towards more recent weeks.">Avg.Posts/day</abbr></div>
        <div @click="sortClicked('imagesPerReply')" class="is-hidden-touch" :class="{'category-selected' : sortThreadlistBy == 'imagesPerReply'}"><abbr title="Posts with files attached" style="white-space: nowrap;">Images</abbr></div>
        <div @click="sortClicked('relativeActivity')" :class="{'category-selected' : sortThreadlistBy == 'relativeActivity'}"><abbr title="Current posts-per-minute relative to the boards usual top ppm rate" style="white-space: nowrap;">Activity Now</abbr></div>
      </div>
      <transition-group name="flip-list" class="boardlist-rows">
        <div
          v-for="boardName in enabledBoards" v-if="boardData[boardName]"
          :ref="boardName" :key="boardName"
          @click="boardClicked(boardName)" class="board_row"
          :class="{'board-selected' : (selectedBoard == boardName)}"
        >
          <div :data-long-board-name="boardNames[boardName]" class="board-name">/{{ boardName }}/</div>
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
		boardNames : require('../js/config').boardNames,
		isThreadlistReversed: false
	}),
	computed: mapState([
		"boardData",
		"enabledBoards",
		"selectedBoard",
		"sortThreadlistBy"
	]),
	methods:{
		sortClicked(sortBy){
			this.$store.commit('sortBoardList',sortBy)
		},
		boardClicked(board){
			this.$store.dispatch('boardClicked',board)
		}
	},
	mounted() {
		//let table = document.querySelector(".boards-wrapper>tbody")
		//console.log(table)
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
			}
		})
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
.board_row{
  display: flex;
  &>div{
    flex: 2 1 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 1.125rem;
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
      min-height: 3px;
      width: 100%;
      background: $--colorHighlight;
      transform: translateY(3px);
      transition: transform 0.25s ease-out;
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
  &:nth-of-type(2n){
    background: $oc-gray-2;
  }
  &.board-selected{
    background: $--colorSelected;
    color: $oc-gray-9;
    transition: all 0.25s ease-out 0s;
  }
  &>.board-name{
    &:hover:after{
      content: attr(data-long-board-name);
      white-space: nowrap;
      padding: 0 1em;
      position: absolute;
      left: 100%;
      top: 0;
      background: rgba(0,0,0,0.75);
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