<template>
  <div class="component-config">
    <router-link to="/" class="is-overlay"/>
			
    <div class="section">
      <div class="container">
        <h4 class="is-size-5-mobile is-size-4 headline">
          Settings
        </h4>
        <div class="category columns is-multiline is-mobile">
						
          <div class="column is-6-mobile is-6-tablet is-3-fullhd" @click.stop="toggleCategory(cat[0])" v-for="cat in categories" :key="cat[0]">
            <div class="board" :class="{enabled : (availableBoards[cat[0]].every((el) => tempEnabledBoards.includes(el)))}">{{ cat[1] }}</div>
          </div>
          <!--
            <div class="column is-6-mobile is-6-tablet is-2-fullhd" @click.stop="savePreset">
              <div class="board save-preset">Save as preset</div>
            </div>
            <div class="column is-6-mobile is-6-tablet is-2-fullhd" @click.stop="loadPreset">
              <div class="board load-preset">Load preset</div>
            </div>
						-->
        </div>

        <div class="columns is-multiline">

          <div class="column is-6">

            <div class="title is-6">Main</div>
            <div class="columns is-multiline is-mobile">
              <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.main" :key="board" @click.stop="toggleBoard(board)">
                <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                  /{{ board }}/
                </div>
              </div>
            </div>
							
          </div>

          <div class="column is-6">

            <div class="title is-6">Image Generals</div>
            <div class="columns is-multiline is-mobile">
              <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.imageGenerals" :key="board" @click.stop="toggleBoard(board)">
                <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                  /{{ board }}/
                </div>
              </div>
            </div>
							
            <div class="title is-6">Misc</div>
            <div class="columns is-multiline is-mobile">
              <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.misc" :key="board" @click.stop="toggleBoard(board)">
                <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                  /{{ board }}/
                </div>
              </div>
            </div>
							
            <div class="title is-6">NSFW</div>
            <div class="columns is-multiline is-mobile">
              <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.nsfw" :key="board" @click.stop="toggleBoard(board)">
                <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                  /{{ board }}/
                </div>
              </div>
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
				["imageGenerals","Image Generals"],
				["misc","Misc"],
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
}

.section {
	overflow: auto;
	position: relative;
	padding: 0rem 1rem 2rem;
}

.delete-button{
	@include mobile {
		position: absolute;
		top: 0;
		right: 0;
	}
	@include desktop {
		position: absolute;
		top: 0;
		right: 0;
	}
	cursor: pointer;
	font-size: 2rem;
	border-radius: 50%;
	//background: rgba(255,255,255,0.8);
	color: $nord6;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
	min-width: 64px;
	min-height: 64px;
  text-shadow: 0px 4px 12px rgba(0,0,0,0.5);
}

.title{
	color: $nord6;
  text-shadow: 0px 4px 12px rgba(0,0,0,0.5);
}

.board{
	cursor: pointer;
	border-radius: 0;
  background: $oc-gray-7;
	color:$oc-gray-4;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 3rem;
	//font-weight: bold;
	box-shadow: 0px 4px 12px rgba(0,0,0,0.5);
}

.save-preset{
	background: $oc-lime-3;
	color: $oc-gray-2;
}

.load-preset{
	background: $oc-blue-3;
	color: $oc-gray-2;
}

.enabled{
  background: $oc-gray-2;
	color:$oc-gray-7;
}

</style>