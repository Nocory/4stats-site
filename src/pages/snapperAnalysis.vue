<template>
  <div class="postAnalysis-component">
    <div class="explanation">
      These stats cover posts from approximately early January to early June 2019. Not all posts from that duration are included due to resource limitations, though I am confident, that &gt;95% of posts were captured.<br />
      <br />
      Click a row to highlight the flag in all columns.<br />
      <br />
      'rel' (relative) is the flag frequency of a country, relative to the US, when adjusting for population.<br />
      Think of it as posting activity per capita.
    </div>
    <div class="flex-container">
      <div v-for="(board, index) in [bant, sp, int, pol]" :key="board.name" class="outer-container">
        <div class="board-name">
          /{{ board.name }}/ <span class="is-hidden-below-desktop"> -- {{ (board.posts / 1000000).toFixed(1) }}m posts</span>
        </div>
        <div class="inner-container">
          <div class="row header">
            <div
              v-for="item in [
                { category: 'NONE', text: '#', tooltip: '', classes: 'is-hidden-below-fullhd' },
                { category: 'name', text: 'Flag', tooltip: '', classes: 'wide-field' },
                { category: 'posts', text: 'Posts', tooltip: '', classes: 'is-hidden-below-widescreen' },
                { category: 'posts', text: '%', tooltip: '', classes: 'narrow-field' },
                { category: 'rel', text: 'rel', tooltip: '', classes: 'narrow-field' }
              ]"
              :key="item.text"
              :class="['row__item', ...item.classes]"
              @click="sortFlags(board, item.category)"
            >
              {{ item.text }}
            </div>
          </div>
          <transition-group tag="div" class="rows component-content">
            <div v-for="(flag, index) in board.sortedFlags" :key="flag[0]" class="row flag-row" :data-hover-text="flag[0]" @click.stop="flagClicked(flag[0])" :class="{ 'flag-clicked': flag[0] == clickedFlag, 'flag-hovered': flag[0] == hoveredFlag }" @mouseover="flagHovered(flag[0])" @mouseleave="flagHovered('NONE')">
              <div class="row__item is-hidden-below-fullhd">{{ index + 1 }}</div>
              <div class="row__item wide-field" :class="{ 'troll-country': troll_flags.includes(flag[0]) }">
                {{ flag[0] }}
              </div>
              <div class="row__item is-hidden-below-widescreen">{{ flag[1][0] }}</div>
              <div class="row__item narrow-field">{{ (flag[1][1] * 100).toFixed(2) }}</div>
              <div v-if="flag[1][2]" class="row__item narrow-field">
                {{ flag[1][2].toFixed(2) }}
                <!--{{ (flag[1][0] / board.postsOfUsers / (users.flags[flag[0]][0] / users.totalUsers)).toFixed(2) }}-->
                <!--{{ (flag[1][0] / board.postsOfUsers / (users.flags[flag[0]][1] / users.totalPopulation)).toFixed(2) }}-->
                <!--{{ (flag[1][0] / board.sortedFlags[0][1][0] / (users.flags[flag[0]] / users.flags["United States"])).toFixed(2) }}-->
              </div>
              <div v-else class="row__item narrow-field">-</div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    clickedFlag: "NONE",
    hoveredFlag: "NONE",
    sortListBy: "posts",
    isListReversed: false,
    bant: require("./snapper_analysis/flags_bant.json"),
    sp: require("./snapper_analysis/flags_sp.json"),
    int: require("./snapper_analysis/flags_int.json"),
    pol: require("./snapper_analysis/flags_pol.json"),
    users: require("./snapper_analysis/internet_users.json"),
    troll_flags: ["Anarcho-Capitalist", "Anarchist", "Black Nationalist", "Confederate", "Communist", "Catalonia", "Democrat", "European", "Fascist", "Gadsden", "Gay", "Jihadi", "Kekistani", "Muslim", "National Bolshevik", "Nazi", "Hippie", "Pirate", "Republican", "Templar", "Tree Hugger", "United Nations", "White Supremacist", "DEUS VULT", "LGBT", "Commie", "Black Lives Matter"]
  }),
  computed: {
    /*
		sortedBant: function() {
			const result = Object.entries(this.bant.flags).sort((a, b) => a[0][0] - b[0][0])
			return result
		},
		sortedSp: function() {
			const result = Object.entries(this.sp.flags).sort((a, b) => a[0][0] - b[0][0])
			return result
		},
		sortedInt: function() {
			const result = Object.entries(this.int.flags).sort((a, b) => a[0][0] - b[0][0])
			return result
		},
		sortedPol: function() {
			const result = Object.entries(this.pol.flags).sort((a, b) => a[0][0] - b[0][0])
			return result
		},
		totalUsersAndPopulation: function() {
			const res = [0, 0]
			for (let value of Object.values(this.users.flags)) {
				res[0] += value[0]
				res[1] += value[1]
			}
			return res
		}
		*/
  },
  created() {
    // 897608
    for (const board of [this.bant, this.sp, this.int, this.pol]) {
      const entries = Object.entries(board.flags)
      const totalPosts = entries.reduce((acc, val) => acc + val[1][0], 0)
      // calculate percentage
      for (const flag of entries) {
        flag[1][1] = flag[1][0] / totalPosts
        if (this.users.flags[flag[0]] && this.users.flags[flag[0]] > 10000) {
          flag[1][2] = flag[1][0] / board.flags["United States"][0] / (this.users.flags[flag[0]] / this.users.flags["United States"])
        } else {
          flag[1][2] = flag[1][2] || 0
        }
      }

      this.$set(board, "totalPosts", totalPosts)
      this.sortFlags(board, "posts")
    }
  },
  mounted() {},
  methods: {
    flagClicked(flag) {
      this.clickedFlag = flag
    },
    flagHovered(flag) {
      this.hoveredFlag = flag
    },
    sortFlags(obj, sortBy = "posts") {
      console.log(obj.name, sortBy)
      switch (sortBy) {
        case "posts":
          this.$set(this[obj.name], "sortedFlags", Object.entries(obj.flags).sort((a, b) => b[1][0] - a[1][0]))
          break
        case "name":
          this.$set(this[obj.name], "sortedFlags", Object.entries(obj.flags).sort())
          break
        case "rel":
          this.$set(this[obj.name], "sortedFlags", Object.entries(obj.flags).sort((a, b) => b[1][2] - a[1][2]))
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.postAnalysis-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  width: 100%;
  @include desktop {
    padding: 1rem;
  }

  @include widescreen {
    padding: 1rem 2rem 2rem;
  }
}

.explanation {
  //text-align: center;
  color: var(--color-text);
  margin-bottom: 1rem;
  padding: 1rem;
  font-size: 0.8em;
  max-width: 512px;
  background-color: var(--background-content-2n);
  @include desktop {
    @include float-shadow-box;
  }
}

.flex-container {
  width: 1440px;
  max-width: 100%;
  display: flex;
  //border: 1px solid red;
  flex-wrap: wrap;
}

.board-name {
  background: var(--background-nav);
  color: var(--color-text);
  padding: 0rem 0.5rem;
  line-height: 2.25rem;
  text-align: left;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

.outer-container {
  flex: 1;
  padding: 0 1rem 0 0;
  @include below-fullhd {
    padding: 0 0.66rem 0 0;
  }
  @include below-widescreen {
    padding: 0 0.33rem 0 0;
  }
  &:last-child {
    padding: 0;
  }
}

.inner-container {
  position: relative;
  @include desktop {
    @include float-shadow-box;
  }
}

.row {
  white-space: nowrap;
  position: relative;
  display: flex;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-text);
  transition: transform 0.5s ease;
  display: flex;
  > .row__item {
    position: relative;
    //min-width: 0;
    //flex: 1 1 0;
    text-align: right;
    padding: 0 1em 0 0;
    //min-width: 4rem;
    flex: none;
    width: 4rem;
    &.troll-country {
      color: hsl(0, 100%, 79%);
      font-style: italic;
    }
    &:first-child {
      text-align: left;
      padding: 0 0 0 1em;
      flex: none;
      width: 2rem;
    }
  }
  .wide-field {
    flex: none;
    text-align: left;
    padding: 0 0 0 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 6rem;
  }
  .narrow-field {
    flex: none;
    text-align: right;
    padding: 0 1em 0 0;
    white-space: nowrap;
    flex: 1;
    max-width: 3rem;
    width: 3rem;
  }
}

.header {
  z-index: 100;
  line-height: 2.25rem !important;
  background: var(--background-nav) !important;
}

.flag-row {
  line-height: 1.25rem;
  background: var(--background-content);
  //transition: 0.1s all ease-out;
  &:nth-of-type(2n) {
    background: var(--background-content-2n);
  }
  border-top: 1px solid var(--border-content);
  &:hover,
  &.flag-hovered {
    //background-color: var(--md-blue-grey-200);
    //color: var(--md-blue-grey-900);
  }
  &.flag-clicked {
    background-color: #eee;
    color: #111;
    font-weight: bold;
  }
}
///////////
// Hover //
///////////

[data-hover-text]:hover::after {
  z-index: 999;
  position: absolute;
  content: attr(data-hover-text);
  white-space: nowrap;
  padding: 0 1em;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.85);
  color: var(--color-text);
  left: 2rem;
  height: 100%;
}
</style>
