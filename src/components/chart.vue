<template>
  <base-component title="Board Timeline (all times are UTC)" class="base-component">
    <div class="component-content">
      <div class="p-2 ml-8">
        Charting
        {{
          activeOptions.term === "day" ? "posts/day" : activeOptions.property === "postsPerMinute" ? "posts/minute" : "relative activity"
        }}
      </div>

      <div class="flex flex-wrap px-12">
        <div class="option-group">
          <button class="option-button" :class="{ 'option-button--selected': activeOptions.term == 'day' }" @click="setActiveTerm('day')">
            Daily
          </button>
          <button class="option-button" :class="{ 'option-button--selected': activeOptions.term == 'hour' }" @click="setActiveTerm('hour')">
            Hourly
          </button>
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.term == 'cycle' }"
            @click="setActiveTerm('cycle')"
          >
            Cycle
          </button>
        </div>

        <div class="option-group">
          <button
            v-for="option in {
              day: [
                [365 * 20, 'All'],
                [365 * 5, '5y'],
                [365 * 3, '3y'],
                [365 * 1, '1y'],
                [365 * 0.5, '6m']
              ],
              hour: [
                [28, '4w'],
                [7, '1w'],
                [3, '3d']
              ],
              cycle: [
                [3, '3d'],
                [1, '1d']
              ]
            }[activeOptions.term]"
            :key="option[1]"
            class="option-button option-button--narrow"
            :class="{ 'option-button--selected': activeOptions.days == option[0] }"
            @click="setChartOption('days', option[0])"
          >
            {{ option[1] }}
          </button>
        </div>

        <div v-if="activeOptions.term == 'day'" class="option-group">
          <input v-model="activeOptions.dateStartString" type="date" @input="setTimelineRange()" />
        </div>

        <div v-if="activeOptions.term == 'day'" class="option-group">
          <input v-model="activeOptions.dateEndString" type="date" @input="setTimelineRange()" />
        </div>

        <div v-if="['hour', 'cycle'].includes(activeOptions.term)" class="option-group">
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.property == 'postsPerMinute' }"
            @click="setChartOption('property', 'postsPerMinute')"
          >
            Posts/Minute
          </button>
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.property == 'activity' }"
            @click="setChartOption('property', 'activity')"
          >
            Activity
          </button>
        </div>

        <div v-if="['hour', 'cycle'].includes(activeOptions.term)" class="option-group">
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.smoothingLevel == 0 }"
            @click="setChartOption('smoothingLevel', 0)"
          >
            Accurate
          </button>
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.smoothingLevel == 3 }"
            @click="setChartOption('smoothingLevel', 3)"
          >
            Smooth
          </button>
          <button
            class="option-button"
            :class="{ 'option-button--selected': activeOptions.smoothingLevel == 6 }"
            @click="setChartOption('smoothingLevel', 6)"
          >
            Silky
          </button>
        </div>

        <div class="option-group">
          <button class="option-button" :class="{ 'option-button--selected': activeOptions.yIsLimited }" @click="toggleYLimit">
            Limit y-axis
          </button>
        </div>
      </div>

      <div class="chart-wrapper">
        <canvas id="myChart" />
      </div>

      <div class="flex flex-wrap justify-center text-xs p-4">
        <div
          v-for="board in allBoards"
          :key="board"
          class="board-button m-1 w-16 text-center border border-gray-600"
          @click="toggleBoard(board)"
        >
          <div :class="{ 'board-button--selected': graphedBoards.includes(board) }" class="cursor-pointer px-0 py-2">
            {{ board == "s4s" ? "[s4s]" : "/" + board + "/" }}
          </div>
        </div>
        <!--
        <div class="button-padder" @click="toggleBoard('all')">
          <div :class="{ 'board-button--selected': graphedBoards.includes('all') }" class="board-button">/all/</div>
        </div>
        -->
      </div>
    </div>
  </base-component>
</template>

<script>
import axios from "axios"
import pino from "js/pino"
import config from "js/config"
import chartFunctions from "js/chartFunctions"
import baseComponent from "components/baseComponent.vue"
export default {
  components: {
    baseComponent
  },
  data: () => ({
    activeOptions: {},
    options: {
      day: {
        term: "day",
        days: 365,
        dateStartString: "",
        dateEndString: "",
        dateStart: new Date(),
        dateEnd: new Date(),
        yIsLimited: false
      },
      hour: {
        term: "hour",
        days: 7,
        smoothingLevel: 3,
        property: "postsPerMinute"
      },
      cycle: {
        term: "cycle",
        days: 3,
        smoothingLevel: 0,
        property: "postsPerMinute"
      }
    },
    history: {
      cycle: {},
      hour: {},
      day: {}
    },
    allBoards: config.allBoards,
    graphedBoards: []
  }),
  created() {
    this.activeOptions = this.options.day
    this.setTimelineRange(this.activeOptions.days)
  },
  mounted() {
    chartFunctions.init("myChart")

    this.$store.subscribe(mutation => {
      if (mutation.type == "updateBoardData") {
        if (this.graphedBoards.includes(mutation.payload.board)) {
          const timelineData = this.history[this.activeOptions.term][mutation.payload.board] || {}
          timelineData.lastUpdate = Date.now()
          if (Date.now() > timelineData.validUntil || 0) {
            pino.debug(
              `chart.vue on boardUpdate: Automatically requesting timeline for /${mutation.payload.board}/ ${this.activeOptions.term}`
            )
            this.requestTimeline(mutation.payload.board, this.activeOptions.term)
          }
        }
      }
    })
  },
  methods: {
    setTimelineRange(days) {
      if (days) {
        const now = new Date()
        this.activeOptions.dateEndString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, "0")}-${now
          .getUTCDate()
          .toString()
          .padStart(2, "0")}`
        now.setUTCDate(now.getUTCDate() - days)
        this.activeOptions.dateStartString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, "0")}-${now
          .getUTCDate()
          .toString()
          .padStart(2, "0")}`
      }

      let splitStringDate = this.activeOptions.dateEndString.split("-")
      this.activeOptions.dateEnd.setUTCFullYear(splitStringDate[0], splitStringDate[1] - 1, splitStringDate[2], 0, 0)
      splitStringDate = this.activeOptions.dateStartString.split("-")
      this.activeOptions.dateStart.setUTCFullYear(splitStringDate[0], splitStringDate[1] - 1, splitStringDate[2], 0, 0)

      if (days) {
        this.activeOptions.days = days
      } else {
        this.activeOptions.days = (this.activeOptions.dateEnd.getTime() - this.activeOptions.dateStart.getTime()) / (1000 * 60 * 60 * 24)
      }

      for (let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
    },
    setActiveTerm(termOptions) {
      this.activeOptions = this.options[termOptions]
      for (let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
    },
    setChartOption(key, value) {
      this.activeOptions[key] = value
      if (this.activeOptions.term == "day" && key == "days") {
        this.setTimelineRange(value)
      } else {
        for (let board of this.graphedBoards) this.checkIfRequestOrAdd(board)
      }
    },
    toggleBoard(board) {
      let index = this.graphedBoards.indexOf(board)
      if (index >= 0) {
        this.graphedBoards.splice(index, 1)
        chartFunctions.removeBoard(board)
        chartFunctions.updateChart(this.activeOptions)
      } else {
        if (this.graphedBoards.length >= 8) return
        this.graphedBoards.push(board)
        this.checkIfRequestOrAdd(board)
      }
    },
    checkIfRequestOrAdd(board) {
      let timelineData = this.history[this.activeOptions.term][board] || {}
      let validUntil = timelineData.validUntil || 0

      let validMinutesLeft = ((validUntil - Date.now()) / 60000).toFixed(2)
      pino.debug(`chart.vue toggleBoard: Data for /${board}/ valid for ${validMinutesLeft > 0 ? validMinutesLeft : 0} more minutes`)

      if (Date.now() > validUntil) {
        pino.debug(`chart.vue toggleBoard: Requesting timeline for /${board}/ ${this.activeOptions.term}`)
        this.requestTimeline(board, this.activeOptions.term)
      } else {
        chartFunctions.addBoard(board, timelineData.history, this.activeOptions)
        chartFunctions.updateChart(this.activeOptions)
      }
    },
    requestTimeline(board, term) {
      axios
        .get(config.url + `/history/${term}/${board}`)
        .then(response => {
          pino.debug("chart.vue requestTimeline %d", response.status, response.data)
          if (response.status == 200) this.processNewTimelineData(board, term, response.data)
        })
        .catch(error => {
          pino.error(error)
        })
    },
    processNewTimelineData(board, term, newData) {
      if (!newData || !newData.length) {
        chartFunctions.removeBoard(board)
        pino.warn("chart.vue processNewTimelineData: history was empty")
        return
      }

      newData = newData.map(el => ({
        time: el[0],
        timeCovered: el[1],
        postCount: el[2],
        postsPerMinute: term == "cycle" ? el[2] / (el[1] / 60000) : el[3]
      }))

      let historyData = {
        latestTime: newData[newData.length - 1].time,
        validUntil:
          Math.max(
            Date.now() + 1000 * 60 * 1,
            newData[newData.length - 1].time + (term == "cycle" ? 1000 * 60 * 5 : term == "hour" ? 1000 * 60 * 90 : 1000 * 60 * 60 * 48)
          ) - 10000,
        history: newData.map(el => ({
          //x: term == "hour" ? el.time : new Date(el.time).setHours(0,0,1,0),
          x: el.time,
          y: term == "day" && el.postCount ? Math.round(el.postCount) : el.postsPerMinute
        }))
      }
      if (term == "day") {
        const lastEntry = historyData.history[historyData.history.length - 1]
        historyData.history.push({
          x: lastEntry.x + 1000 * 60 * 60 * 23.99,
          y: lastEntry.y
        })
      }
      this.history[term][board] = historyData

      chartFunctions.addBoard(board, historyData.history, this.activeOptions)
      chartFunctions.updateChart(this.activeOptions)
    },
    toggleYLimit() {
      this.activeOptions.yIsLimited = !this.activeOptions.yIsLimited
      chartFunctions.updateChart(this.activeOptions)
    }
  }
}
</script>

<style scoped lang="scss">
.base-component {
  background: var(--bg2);
}

.option-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding-left: 3rem;
}

.option-group {
  display: flex;
  margin-right: 1rem;
  border: 1px solid gray;
  background-color: var(--bg2);
  color: var(--nav-text-color);
}

.option-group > input {
  border: none;
  width: 10em;
  padding: 0.5em 0em;
  position: relative;
  font-size: 0.75rem;
  overflow: hidden;
  z-index: 99;
  background-color: var(--bg2);
  color: var(--nav-text-color);
}

.option-button {
  cursor: pointer;
  width: 6rem;
  padding: 0.5em 0em;
  position: relative;
  font-size: 0.75rem;
  z-index: 99;
  border: none;
  @include selected-underline(".option-button--selected");
  &--selected {
    border: none;
    background-color: var(--nav-text-color);
    color: var(--nav-bg) !important;
  }
  &--narrow {
    width: 3rem !important;
  }
  &:focus {
    outline: none;
  }
}

.board-button {
  &--selected {
    font-weight: bolder;
    background-color: var(--nav-text-color);
    color: var(--nav-bg) !important;
  }
}

.chart-wrapper {
  position: relative;
  min-height: 400px;
  padding: 0.5rem 0 0.5rem;
  > canvas {
    position: relative;
    z-index: 20;
  }
}
</style>
