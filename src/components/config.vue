<template>
  <div class="component">
    <div class="config-wrapper" @click="toggleConfig">
			
      <div class="section">
        <div class="delete-button">x</div>
        <div class="container">
          <div class="toggle-all columns is-multiline is-mobile individual-boards">
            <div class="column is-6-mobile is-6-tablet is-3-fullhd" @click.stop="toggleCategory('main')">
              <div class="board" :class="{enabled : (availableBoards['main'].every((el) => tempEnabledBoards.includes(el)))}">Main</div>
            </div>
            <div class="column is-6-mobile is-6-tablet is-3-fullhd" @click.stop="toggleCategory('imageGenerals')">
              <div class="board" :class="{enabled : (availableBoards['imageGenerals'].every((el) => tempEnabledBoards.includes(el)))}">Image Generals</div>
            </div>
            <div class="column is-6-mobile is-6-tablet is-3-fullhd" @click.stop="toggleCategory('misc')">
              <div class="board" :class="{enabled : (availableBoards['misc'].every((el) => tempEnabledBoards.includes(el)))}">Misc</div>
            </div>
            <div class="column is-6-mobile is-6-tablet is-3-fullhd" @click.stop="toggleCategory('nsfw')">
              <div class="board" :class="{enabled : (availableBoards['nsfw'].every((el) => tempEnabledBoards.includes(el)))}">NSFW</div>
            </div>
            <!--
						<div class="column is-6-mobile is-6-tablet is-2-fullhd" @click.stop="savePreset">
							<div class="board save-preset">Save preset</div>
						</div>
						<div class="column is-6-mobile is-6-tablet is-2-fullhd" @click.stop="loadPreset">
							<div class="board load-preset">Load preset</div>
						</div>
						-->
          </div>
          <div class="board-buttons columns is-multiline">

            <div class="column is-6">
              <div class="title is-6">Main</div>
              <div class="columns is-multiline is-mobile individual-boards">
                <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.main" :key="board" @click.stop="toggleBoard(board)">
                  <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                    /{{ board }}/
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-6">
              <div class="title is-6">Image Generals</div>
              <div class="columns is-multiline is-mobile individual-boards">
                <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.imageGenerals" :key="board" @click.stop="toggleBoard(board)">
                  <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                    /{{ board }}/
                  </div>
                </div>
              </div>
              <div class="title is-6">Misc</div>
              <div class="columns is-multiline is-mobile individual-boards">
                <div class="column is-3-mobile is-3-tablet is-2-fullhd" v-for="board in availableBoards.misc" :key="board" @click.stop="toggleBoard(board)">
                  <div class="board" :class="{enabled : (tempEnabledBoards.includes(board))}">
                    /{{ board }}/
                  </div>
                </div>
              </div>
              <div class="title is-6">NSFW</div>
              <div class="columns is-multiline is-mobile individual-boards">
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
  </div>
</template>

<script>
const pino = require("js/pino")
import { mapState } from 'vuex'
const config = require("js/config")
export default {
	computed: mapState([
		"enabledBoards",
		"showConfig"
	]),
	data(){
		return{
			tempEnabledBoards : this.$store.state.enabledBoards.slice(),
			availableBoards : JSON.parse(JSON.stringify(config.availableBoards))
		}
	},
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
		toggleConfig(){
			this.$emit('update:showConfig', false)
			this.$store.commit("setEnabledBoards",this.tempEnabledBoards.slice())
		},
		toggleBoard(board){
			pino.trace("config.vue toggleBoard checking for",board)
			let index = this.tempEnabledBoards.indexOf(board)
			if(index >= 0){
				this.tempEnabledBoards.splice(index,1)
			}else{
				this.tempEnabledBoards.push(board)
			}
			pino.trace("config.vue toggleBoard new list",this.tempEnabledBoards)
		},
		savePreset(){
			localStorage.setItem("config_boardPreset",JSON.stringify(this.tempEnabledBoards))
		},
		loadPreset(){
			this.tempEnabledBoards = JSON.parse(localStorage.getItem("config_boardPreset")) || ["g"]
		}
	},
	mounted(){
		console.log("opened board settings")
	}
}
</script>

<style scoped lang="scss">
@import "~nord/src/sass/nord.scss";
@import "~css/variables.scss";

.component{
  position: fixed;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
	align-items: center;
}

.section {
	padding: 1rem;
}

.config-wrapper{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
	left: 0;
	background: rgba(0,0,0,0.9);
	overflow: auto;
}

.delete-button{
	@include mobile {
		position: relative;
	}
	@include desktop {
		position: fixed;
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
}

.title{
	color: $nord6;
}

.individual-boards{
	.column{
		cursor: pointer;
	}
}

.config-modal-content{
  position: relative;
  z-index: 99;
  background: #f1f1f1;
  color: #222;
  border-radius: 4px;
}

.board{
	border-radius: 0;
  background: $oc-gray-7;
	color:$oc-gray-4;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 3rem;
	//font-weight: bold;
}

.save-preset{
	background: $oc-lime-3;
	color: #222;
}

.load-preset{
	background: $oc-blue-3;
	color: #222;
}

.enabled{
  background: $oc-gray-0;
	color:$oc-gray-9;
}

</style>