<template>
  <div class="component">
    <div class="box-shadow-wrapper">
      <h4 class="title is-size-4 headline">
        Live Board Statistics
      </h4>
      <div class="boardlist-wrapper">
        <div class="bl_columns bl_row">
          <div @click="sortClicked('name')" class="board" :class="{'category-active' : sortThreadlistBy == 'name'}">
            <span>Board</span>
          </div>
          <div @click="sortClicked('postsPerMinute')" :class="{'category-active' : sortThreadlistBy == 'postsPerMinute'}"><abbr title="Over the last hour">Posts/min</abbr></div>
          <div @click="sortClicked('threadsPerHour')" class="is-hidden-touch" :class="{'category-active' : sortThreadlistBy == 'threadsPerHour'}"><abbr title="Over the last hour">Threads/hour</abbr></div>
          <div @click="sortClicked('avgPostsPerDay')" :class="{'category-active' : sortThreadlistBy == 'avgPostsPerDay'}"><abbr title="Over the last 4 weeks. Weighted towards more recent weeks.">Avg.Posts/day</abbr></div>
          <div @click="sortClicked('postCountDevelopment')" class="is-hidden is-hidden-touch is-hidden-desktop-only" :class="{'category-active' : sortThreadlistBy == 'postCountDevelopment'}"><abbr title="Posts during the last 30 days vs the month before" style="white-space: nowrap;">30 day change</abbr></div>
          <div @click="sortClicked('imagesPerReply')" class="is-hidden-touch" :class="{'category-active' : sortThreadlistBy == 'imagesPerReply'}"><abbr title="Posts with files attached" style="white-space: nowrap;">Images</abbr></div>
          <div @click="sortClicked('relativeActivity')" :class="{'category-active' : sortThreadlistBy == 'relativeActivity'}"><abbr title="Current posts-per-minute relative to the boards usual top ppm rate" style="white-space: nowrap;">Activity Now</abbr></div>
        </div>
        <transition-group :name="updateInProgress ? 'delayed' : 'flip-list'" tag="div" class="bl_row-wrapper">
          <div v-for="boardName in enabledBoards" v-if="boardData[boardName]"
               :ref="boardName" :key="boardName"
               @click="boardClicked(boardName)" class="bl_row"
               :class="{'board-selected' : (selectedBoard == boardName)}">
            <div :data-long-board-name="config.boardNames[boardName]" class="board">/{{ boardName }}/</div>
            <div class="">{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
            <div class="is-hidden-touch">{{ Math.round(boardData[boardName].threadsPerHour) }}</div>
            
            <div class="">{{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }} {{ Math.round(boardData[boardName].avgPostsPerDay) }}</div>
            <div class="is-hidden is-hidden-touch is-hidden-desktop-only">{{ boardData[boardName].postCountDevelopment>1?"+":"" }}{{ Math.round((boardData[boardName].postCountDevelopment - 1) * 100) }}%</div>
            
            <div class="is-hidden-touch">{{ Math.round(boardData[boardName].imagesPerReply * 100) }}%</div>
            <div class="">{{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}</div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../js/config'
import { mapState } from 'vuex'
export default {
	data: () => ({
		config,
		isThreadlistReversed: false,
		updateInProgress: false
	}),
	computed: mapState([
		"boardData",
		"enabledBoards",
		"selectedBoard",
		"sortThreadlistBy",
		"showConfig"
	]),
	methods:{
		sortClicked(sortBy){
			this.updateInProgress = false
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
				//console.log(board, "isreffed")
				let element = this.$refs[mutation.payload.board][0]
				element.classList.add("just-updated")
				this.updateInProgress = true
				//table.classList.add("delayed-anim")
				element.addEventListener(
					"animationend",
					event => {
						event.target.classList.remove("just-updated")
						this.updateInProgress = false
						//table.classList.remove("delayed-anim")
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

.component {
}

.boardlist-wrapper{
  font-family: monospace;
}

.box-shadow-wrapper{
  //box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
}

.bl_columns{
  position: relative;
  overflow: hidden;
  background: $oc-gray-0;
  border-bottom: 0px solid rgba(0,0,0,0.25);
  transition: all 0.5s ease-out;
}

.bl_columns>div{
  position: relative;
  font-size: 0.8rem;
  height: 2rem !important;
  //padding: 0 !important;
}
.bl_columns>div:after{
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

.bl_row-wrapper{
  background: $oc-gray-0;
}

.bl_row{
  display: flex;
  border-top: 1px solid rgba(0,0,0,0.2);
  cursor: pointer;
  user-select: none;
}

.bl_row>div{
  flex: 2 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 1.125rem;
  padding: 0em 1em 0 0;
  font-size: 0.8rem;
  //border: 1px solid red;
}

.bl_row>div.board{
  justify-content: flex-start;
  padding: 0 0 0 1em;

  flex: 1 1 0 !important;
  min-width: 4em !important;
  text-align: left !important;
  font-weight: bold;
  position: relative;
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

.bl_row:nth-of-type(2n){
  background: $oc-gray-2;
}

.board-selected>div{
  background: $--colorSelected;
  color: $oc-gray-9;
  //font-weight: bolder;
  transition: all 0.25s ease-out 0s;
}

.category-active{
  position: relative;
}

.category-active::after{
  content: "";
  transform: translateY(0px) !important;
}

.flip-list-move {
  transition: transform 0.5s;
}

.just-updated {
  animation-duration: 3s;
  animation-name: updateAnim;
  animation-timing-function: ease-out;
  z-index: 99;
}

.delayed-move{
  transition: transform 1s 0.5s;
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