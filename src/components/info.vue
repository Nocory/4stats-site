<template>
  <div class="meta-component">
    <div class="component__header is-hidden-mobile">
      Info
    </div>
    <div class="info-wrapper">
      <p>
        Added work-in-progress snapshot-analyzer link to the nav bar on desktops.<br>
        A tool to visualize information generated from recent board snapshots.<br>
        There are still some issues though and it's not polished at all.<br>
      </p>
      <hr>
      <p>
        I will leave /sp/'s daily peak posts/minute fixed at pre world-cup levels until the history looks normal again.
      </p>
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
  padding: 1rem;
  color: $oc-gray-0;
}

hr{
  background: rgba(255,255,255,0.8);
  margin: 1rem 0;
  width: 10%;
}
</style>