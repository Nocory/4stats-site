<template>
  <div class="boardlist-component relative cursor-pointer">
    <!--<img src="../static/xmashat.gif" class="partyhat is-hidden-below-widescreen" />-->
    <div class="row h-10 text-xs border-b-2 border-gray-400 categories">
      <div
        v-for="item in [
          { category: 'name', text: 'Board', tooltip: '' },
          {
            category: 'postsPerMinute',
            text: 'Posts/min',
            tooltip: 'Over the last 30 minutes'
          },
          {
            category: 'threadsPerHour',
            text: 'Threads/hour',
            tooltip: 'Over the last hour',
            classes: ['is-hidden-below-desktop']
          },
          {
            category: 'avgPostsPerDay',
            text: 'Avg.Posts/day',
            tooltip: 'Over the last 4 weeks. Weighted towards more recent weeks.'
          },
          {
            category: 'relativeActivity',
            text: 'Activity Now',
            tooltip: 'Current activity relative to the boards usual daily posts/minute peak',
            classes: ['']
          },
          {
            category: 'activityThisToD',
            text: 'rel. to ToD',
            tooltip: 'Current activity relative to the boards average posts/minute this time of day over the last 8 weeks',
            classes: ['is-hidden-below-fullhd']
          }
        ]"
        :key="item.name"
        :class="[
          {
            'font-bold': sortBoardListBy == item.category,
            'tooltip--bottom': item.tooltip
          },
          ...item.classes
        ]"
        :data-hover-text="item.tooltip"
        @click.stop="categoryClicked(item.category)"
      >
        {{ item.text }}
        <div
          v-if="sortBoardListBy == item.category"
          class="sortArrow"
          :class="{
            'sortArrow--reversed': sortBoardListBy == 'name' ? !reverseOrder : reverseOrder
          }"
        ></div>
      </div>
    </div>
    <transition-group v-if="combinedBoardStats.avgPostsPerDay" tag="div" class="board-rows text-sm">
      <div
        v-for="boardName in sortedBoardlist"
        :id="'board-' + boardName"
        :key="boardName"
        :class="{ 'row--selected': selectedBoard == boardName }"
        class="row border-b border-gray-500"
        @click.stop="boardClicked(boardName)"
      >
        <div v-once :data-hover-text="longBoardNames[boardName]" class="tooltip--right">
          {{ boardName == "s4s" ? "[s4s]" : "/" + boardName + "/" }}
        </div>
        <div class>{{ (boardData[boardName].postsPerMinute || 0).toFixed(2) }}</div>
        <div class="is-hidden-below-desktop">
          {{ Math.round(boardData[boardName].threadsPerHour) }}
        </div>
        <div class>
          {{ boardData[boardName].postCountDevelopment && false ? boardData[boardName].postCountDevelopment.toFixed(2) : "" }}
          {{ Math.round(boardData[boardName].avgPostsPerDay) }}
        </div>
        <div class>
          {{ boardData[boardName].relativeActivity >= 0 ? Math.round(boardData[boardName].relativeActivity * 100) + "%" : "-" }}
        </div>
        <div class="is-hidden-below-fullhd">
          {{ boardData[boardName].activityThisToD >= 0 ? Math.round(boardData[boardName].activityThisToD * 100) + "%" : "-" }}
        </div>
        <img v-if="boardData[boardName].hasSticky" class="row--has-sticky" src="../static/sticky.gif" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import pino from "js/pino"
import config from "js/config"
export default {
  data: () => ({
    longBoardNames: config.boardNames,
    sortBoardListBy: localStorage.getItem("sortBoardListBy") || "avgPostsPerDay",
    reverseOrder: false
  }),
  computed: {
    ...mapState(["boardData", "enabledBoards", "selectedBoard"]),
    ...mapGetters(["combinedBoardStats"]),
    sortedBoardlist: function() {
      const result = this.enabledBoards.slice()
      if (this.sortBoardListBy == "name") {
        result.sort()
      } else {
        result.sort((a, b) => {
          return this.boardData[b][this.sortBoardListBy] - this.boardData[a][this.sortBoardListBy] + (a > b ? 0.0001 : -0.0001)
        })
      }

      if (this.reverseOrder) result.reverse()
      return result
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type == "updateBoardData" && mutation.payload.board != this.selectedBoard) {
        const element = document.getElementById("board-" + mutation.payload.board)
        if (!element || element.classList.contains("just-updated")) return

        element.classList.add("just-updated")
        element.addEventListener(
          "animationend",
          event => {
            element.classList.remove("just-updated")
            pino.debug(event.target, mutation.payload.board, "removed 'just-updated'")
          },
          {
            once: true,
            passive: true
          }
        )
      }
    })
  },
  methods: {
    categoryClicked(sortBy) {
      this.reverseOrder = sortBy == this.sortBoardListBy ? !this.reverseOrder : false
      this.sortBoardListBy = sortBy
      localStorage.setItem("sortBoardListBy", sortBy)
    },
    boardClicked(board) {
      this.$store.dispatch("boardClicked", board)
    }
  }
}
</script>

<style scoped lang="scss">
.boardlist-component {
  @include widescreen {
    @include float-shadow-box;
  }
  background: var(--nav-bg);
}

.categories {
  color: var(--nav-text-color);
  > div {
    height: 100%;
    position: relative;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > .sortArrow {
      &:after {
        content: "";
        position: absolute;
        right: 0%;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid var(--nav-text-color);
        transition: all 0.382s ease-out;
      }
      &--reversed:after {
        transform: rotate(-180deg);
      }
    }
  }
}

.board-rows {
  display: flex;
  flex-direction: column;
  > .row {
    transition: transform 0.5s ease;
    background: var(--bg1);
    &:nth-child(2n) {
      background: var(--bg2);
    }
    &--selected {
      background: rgba(192, 207, 231, 0.9) !important;
      //background: #cfd8dc;
      //font-weight: bolder;
      color: #111 !important;
    }
    &:hover {
      background: rgba(192, 207, 231, 0.75) !important;
      color: #222 !important;
    }
  }
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    &:first-child {
      width: 64px;
      flex: none;
      text-align: left;
      padding-left: 1em;
      //font-weight: normal;
    }
    &:not(:first-child) {
      flex: 1 1 0;
      text-align: right;
      padding-right: 1em;
    }
  }
}

.row--has-sticky {
  position: absolute;
  top: 12.5%;
  left: 64px;
  height: 75%;
  object-fit: cover;
  z-index: 99;
  background-color: transparent;
}

////////////////
// Animations //
////////////////
.just-updated > div {
  animation-duration: 3s;
  animation-name: updateAnim;
  animation-timing-function: ease-out;
  z-index: 99;
}

@keyframes updateAnim {
  0% {
    background: rgba(192, 207, 231, 0);
  }
  38.2% {
    background: rgba(192, 207, 231, 1);
  }
  100% {
    background: rgba(192, 207, 231, 0);
  }
}

/////////////
// Tooltip //
/////////////
.tooltip--bottom:hover::before,
.tooltip--right:hover::before {
  pointer-events: none;
  line-height: 2;
  z-index: 101;
  position: absolute;
  content: attr(data-hover-text);
  padding: 0.25rem 1rem;
  white-space: nowrap;
  background-color: var(--nav-bg);
  @include float-shadow-box;
  color: var(--nav-text-color);
  @include touch {
    display: none;
  }
}
.tooltip--bottom {
  text-decoration: underline dotted;
  &:hover::before {
    left: 0px;
    top: 125%;
  }
}
.tooltip--right:hover::before {
  left: 100%;
}
</style>
