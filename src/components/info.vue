<template>
  <div class="meta-component">
    <div class="component__header is-hidden-mobile">
      Info
    </div>
    <div class="info-wrapper">
      <!--
      <img src="../static/hiroooo.png">
      -->
      Extended board timelines for /g/, /gif/, /his/, /int/, /k/, /m/, /mlp/, /mu/, /qa/, /trash/, /vr/ and /wsg/ are now live.<br>
      Thanks to the helpful admin from desuarchive.org & rbt.asia.
    </div>

  </div>
</template>

<script>
const socket = require("js/socket")
import { mapGetters } from 'vuex'
export default {
	data(){
		return{
			recentlyUpdatedBoard: "",
			connectedUsers: 0
		}
	},
	computed: {
		...mapGetters(['combinedBoardStats'])
	},
	methods: {
    
	},
	created(){
		socket.on("userCount",userCount => {
			this.connectedUsers = userCount
		})
		socket.on("boardUpdate",board => {
			this.recentlyUpdatedBoard = board
		})
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.meta-component{
  display: flex;
  flex-direction: column;
  @include float-shadow-box;
  position: relative;
  
  margin: 1rem 0;
  //--meta-y-offset: 0px;
  //transform: translateY(var(--meta-y-offset));
  //transition: all 1s ease-out;
}

.component__header{
  background: rgba(0,0,0,0.8);
  color: $oc-gray-4;
  padding: 0rem 0.5rem;
  line-height: 2.25rem;
  text-align: left;
  font-weight: bold;
}

.info-wrapper{
  display: flex;
  flex-direction: column;
  background: $--color-highlight-2;
  color: $--color-text;
  padding: 1em;
  color: $oc-gray-0;
}

hr{
  background: rgba(255,255,255,0.8);
  margin: 1rem 0;
  width: 10%;
}

.strike-text{
  position: relative;
  background: white;
  color: black;
  padding: 0 1rem;
  font-weight: bold;
  &::after{
    content: "";
    position: absolute;
    top: 45%;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255,0,0,0.5);
    transform: rotate(-45deg)
  }
  &::before{
    content: "";
    position: absolute;
    top: 45%;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255,0,0,0.5);
    transform: rotate(45deg)
  }
}

.strike-replace{
  background: white;
  color: black;
  padding: 0 1rem;
  font-weight: bold;
}
</style>