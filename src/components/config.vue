<template>
  <div class="component-config">
		
		<div class="container">
			<div class="category">
				<div class="component-title">Boardlist</div>
				<div class="category__content">
					<div class="horizontal-buttons">
						<button v-for="category in categories" :key="category[0]" class="button" @click="selectedCategory = selectedCategory == category[0] ? '' : category[0]">
							{{ category[1] }} -
							{{ tempEnabledBoards.reduce((acc,val) => {
								return acc + availableBoards[category[0]].includes(val)
							},0) }}/{{ availableBoards[category[0]].length }}
						</button>
					</div>

					<div v-if="selectedCategory" class="">
						<div class="horizontal-buttons board-selection-options">
							<button class="button" @click.stop="toggleCategory(selectedCategory)">Toggle all</button>
							<button class="button" @click="selectedCategory = ''; saveSettings()">Save</button>
						</div>
						<div class="boards">
							<div v-for="board in availableBoards[selectedCategory]" :key="board" :class="{enabled : (tempEnabledBoards.includes(board))}" class="board" @click.stop="toggleBoard(board)">
								<div class="shortname">/{{ board }}/</div>
								<div class="longname is-hidden-touch"> {{ longBoardNames[board] }}</div>
							</div>
						</div>
					</div>	
				</div>			
			</div>

		</div>
			
  </div>
</template>

<script>
import pino from "js/pino"
import { mapState } from 'vuex'
import config from "js/config"
export default {
	data(){
		return{
			longBoardNames : config.boardNames,
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
	flex-grow: 1;
	width: 100%;
	padding: 2rem 2rem;
}

.container{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	max-width: 512px;
	margin: auto;
}

.category{
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
  @include float-shadow-box;
}

.category__content{
  display: flex;
  flex-direction: column;
  background: $--color-highlight-2;
  color: $--color-text;
  padding: 1em;
  color: $oc-gray-0;
  //font-size: 0.8em;
}

.horizontal-buttons{
	display: flex;
	padding-bottom: 1rem;
}

.button{
	cursor: pointer;
	width: 8rem;
	border-radius: 4px;
	border-style: solid;
	color: $--color-text;
	background-color: $--color-highlight-1;
	margin-right: 1rem;
	@include float-shadow-box;
}

.boards{
	display: flex;
	flex-direction: column;
	//flex-wrap: wrap;
	width: 20rem;
	justify-content: flex-start;
	justify-content: center;
	@include float-shadow-box;
}

.board{
	display: flex;
	align-items: center;
	justify-content: flex-start;
	cursor: pointer;
	border-radius: 0;
  //background: $oc-gray-2;
	//background: rgba(255,230,230,1);
	border-left: 6px solid $oc-red-5;
	width: 100%;
	height: 3rem;
	padding: 1rem;
	color: $--color-text;
	background-color: $--color-highlight-1;
	>.shortname{
		color:$oc-gray-4;
		font-weight: bolder;
		width: 4rem;
	}
	>.longname{
		color:$oc-gray-6;
		margin-left: 1rem;
	}
}

.enabled{
	border-left: 6px solid $oc-green-4;
}

</style>