<template>
  <div class="component-config">
    <router-link to="/" class="is-overlay"/>
			
    <div class="section">
      <div class="container">
        <h4 class="is-size-5-mobile is-size-4 headline">
          Boards
        </h4>

        <div v-for="category in categories" :key="category[0]">
          <div :class="{enabled : (availableBoards[category[0]].every((el) => tempEnabledBoards.includes(el)))}" class="category" @click.stop="toggleCategory(category[0])">
            Toggle {{ category[1] }} Boards
          </div>
          <div class="boards">
            <div v-for="board in availableBoards[category[0]]" :key="board" :class="{enabled : (tempEnabledBoards.includes(board))}" class="board" @click.stop="toggleBoard(board)">
              /{{ board }}/
            </div>
          </div>
        </div>
				
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
		savePreset(){
			localStorage.setItem("config_boardPreset",JSON.stringify(this.tempEnabledBoards))
		},
		loadPreset(){
			this.tempEnabledBoards = JSON.parse(localStorage.getItem("config_boardPreset")) || ["g"]
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
	background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
	flex-grow: 1;
}

.section {
	overflow: auto;
	position: relative;
}

.title{
	color: $nord6;
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
	flex-wrap: wrap;
	justify-content: flex-start;
	margin-bottom: 2rem;
}

.board{
	cursor: pointer;
	border-radius: 0;
  background: $oc-gray-7;
	color:$oc-gray-4;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 5rem;
	height: 3rem;
	margin: 0.5rem;
	//border: 1px solid $oc-gray-9;
}

.enabled{
  background: $oc-gray-2;
	color:$oc-gray-7;
}

</style>