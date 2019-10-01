<template>
  <div class="boardlist-component">
    <img src="../static/partyhat.gif" class="partyhat is-hidden-touch" />
    <div class="header">
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
          'header__col',
          {
            'header__col--selected': sortBoardListBy == item.category,
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
    <transition-group v-if="combinedBoardStats.avgPostsPerDay" tag="div" class="rows component-content">
      <div v-for="boardName in sortedBoardlist" :id="'board-' + boardName" :key="boardName" :class="{ 'row--selected': selectedBoard == boardName }" class="row" @click.stop="boardClicked(boardName)">
        <div v-once :data-hover-text="longBoardNames[boardName]" class="tooltip--right">
          {{ boardName == "s4s" ? "[s4s]" : "/" + boardName + "/" }}
        </div>
        <div class>{{ boardData[boardName].postsPerMinute.toFixed(2) }}</div>
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
  position: relative;
  z-index: 10;
  @include desktop {
    @include float-shadow-box;
  }
}

.header,
.row {
  white-space: nowrap;
  position: relative;
  display: flex;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-text);
  transition: transform 0.5s ease;
  > div {
    position: relative;
    flex: 1 1 0;
    text-align: right;
    padding: 0 1em 0 0;
    &:first-child {
      width: 64px;
      flex: none;
      text-align: left;
      padding: 0 0 0 1em;
      font-weight: normal;
    }
  }
}

.header {
  z-index: 100;
  height: 2.25rem;
  align-items: stretch;
  background: var(--background-nav);
  color: var(--color-text);
  &__col {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    color: var(--color-text);
    &:first-child {
      width: 64px;
      flex: none;
      justify-content: flex-start;
      padding: 0 0 0 1em;
      font-weight: bold;
    }
    @include selected-underline(".header__col--selected");
    > .sortArrow {
      &:after {
        content: "";
        position: absolute;
        right: 0%;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid var(--color-text);
        transition: all 0.25s ease-out;
      }
      &--reversed:after {
        transform: rotate(-180deg);
      }
    }
  }
}

.row {
  line-height: 1.25rem;
  background: var(--background-content);
  &:nth-of-type(2n) {
    background: var(--background-content-2n);
  }
  &:not(:first-child) {
    border-top: 1px solid var(--border-content);
  }
  &:hover {
    background-color: var(--color-hover);
  }
  &--selected {
    background-color: var(--color-selected-background) !important;
    color: var(--color-selected-text);
  }
  &--has-sticky {
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

.tooltip--bottom:hover::before,
.tooltip--right:hover::before {
  pointer-events: none;
  line-height: 2;
  z-index: 101;
  position: absolute;
  content: attr(data-hover-text);
  padding: 0.25rem 1rem;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.85);
  @include float-shadow-box;
  color: var(--color-text);
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
    background-color: transparent;
  }
  10% {
    background-color: var(--color-hover);
  }
  55% {
    background-color: var(--color-hover);
  }
  100% {
    background-color: transparent;
  }
}
</style>
