<template>
  <div class="component-config">
		
    <div class="section">
      <div class="container">
        <div class="setting-category">Boards</div>

        <button v-for="category in categories" :key="category[0]" class="button board-category-button is-rounded" @click="selectedCategory = selectedCategory == category[0] ? '' : category[0]">
          {{ category[1] }} -
          {{ tempEnabledBoards.reduce((acc,val) => {
            return acc + availableBoards[category[0]].includes(val)
          },0) }}/{{ availableBoards[category[0]].length }}
        </button>

        <div v-if="selectedCategory" class="board-selection-wrapper">
          <div class="board-selection-options">
            <button class="button is-rounded" @click.stop="toggleCategory(selectedCategory)">Toggle all</button>
            <button class="button is-success is-rounded" @click="selectedCategory = ''; saveSettings()">Save</button>
          </div>
          <div class="boards">
            <div v-for="board in availableBoards[selectedCategory]" :key="board" :class="{enabled : (tempEnabledBoards.includes(board))}" class="board" @click.stop="toggleBoard(board)">
              <div class="shortname">/{{ board }}/</div>
              <div class="longname is-hidden-touch"> {{ longBoardNames[board] }}</div>
            </div>
          </div>
        </div>

				
        <div class="setting-category">Show Chart</div>

        <div class="buttons has-addons chart-buttons">
          <span :class="[chartPreference == 1 ? 'is-selected is-info' : '']" class="button" @click="setChartPreference(1)">Always</span>
          <span :class="[chartPreference == 0 ? 'is-selected is-info' : '']" class="button" @click="setChartPreference(0)">Auto</span>
          <span :class="[chartPreference == -1 ? 'is-selected is-info' : '']" class="button" @click="setChartPreference(-1)">Never</span>
        </div>
        <p>'Auto': Enabled from tablet-width onwards</p>
				
      </div>
    </div>
  </div>
</template>

<script>
const pino = require("js/pino")
import { mapState } from 'vuex'
const config = require("js/config")
export default {
	data(){
		return{
			longBoardNames : require('js/config').boardNames,
			selectedCategory: "",
			tempEnabledBoards : this.$store.state.enabledBoards.slice(),
			availableBoards : config.availableBoards,
			categories: [
				["main","Main"],
				["nsfw","NSFW"],
			]
		}
	},
	computed: mapState([
		"chartPreference",
		"enabledBoards",
		"showConfig"
	]),
	methods:{
		toggleCategory(category){
			let allEnabled = this.availableBoards[category].every(el => this.tempEnabledBoards.includes(el))

			if(allEnabled){
				for(let board of this.availableBoards[category]){
					let index = this.tempEnabledBoards.indexOf(board)
					if(index >= 0){
						this.tempEnabledBoards.splice(index,1)
					}
				}
			}else{
				for(let board of this.availableBoards[category]){
					if(!this.tempEnabledBoards.includes(board)){
						this.tempEnabledBoards.push(board)
					}
				}
			}
		},
		toggleBoard(board){
			pino.debug("config.vue toggleBoard checking for",board)
			let index = this.tempEnabledBoards.indexOf(board)
			if(index >= 0){
				this.tempEnabledBoards.splice(index,1)
			}else{
				this.tempEnabledBoards.push(board)
			}
			pino.debug("config.vue toggleBoard new list",this.tempEnabledBoards)
		},
		setChartPreference(val){
			console.log(val)
			this.$store.commit("setChartPreference",val)
		},
		saveSettings(){
			this.$store.commit("setEnabledBoards",this.tempEnabledBoards.slice())
		}
	},
	beforeRouteLeave (to, from, next) {
		this.$store.commit("setEnabledBoards",this.tempEnabledBoards.slice())
		next()
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-config{
	position: relative;
	user-select: none;
	background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
	flex-grow: 1;
}

.section {
	overflow: auto;
	position: relative;
}

.setting-category{
	position: relative;
	font-size: 1.25rem;
	font-weight: lighter;
	margin-top: 2rem;
	&::after{
		content: "";
		position: absolute;
		left: -8px;
		top: 0px;
		width: 2px;
		height: 100%;
		background: $oc-blue-4;
	}
}

.board-category-button{
	height: auto;
	width: 8rem;
	padding: 0.5rem;
	margin: 1rem 2rem 0 0;
	background: white;
	box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
}

.board-selection-options{
	>button{
		margin: 1rem 0;
		box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
	}
}

.board-selection-options{
	padding: 1rem 0;
}

.category{
	cursor: pointer;
	border-radius: 0;
  background: $oc-gray-7;
	color:$oc-gray-4;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 14rem;
	height: 3rem;
	margin: 0.5rem;
}

.boards{
	display: flex;
	flex-direction: column;
	//flex-wrap: wrap;
	width: 20rem;
	justify-content: flex-start;
	box-shadow: 0px 4px 12px rgba(0,0,0,0.25);
	justify-content: center;
}

.board{
	display: flex;
	align-items: center;
	justify-content: flex-start;
	cursor: pointer;
	border-radius: 0;
  //background: $oc-gray-2;
	//background: rgba(255,230,230,1);
	border-left: 4px solid $oc-red-4;
	width: 100%;
	height: 3rem;
	padding: 1rem;
	>.shortname{
		color:$oc-gray-8;
		font-weight: bolder;
		width: 4rem;
	}
	>.longname{
		color:$oc-gray-6;
		margin-left: 1rem;
	}
}

.enabled{
	//background: rgba(230,255,230,1);
	border-left: 4px solid $oc-green-4;
}

.chart-buttons{
	margin: 1rem 0;
}

</style>