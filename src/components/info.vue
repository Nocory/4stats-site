<template>
  <div class="meta-component">
    <div class="component__header is-hidden-mobile">
      Info
    </div>
    <div class="info-wrapper">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate lacus ut sem commodo, vel viverra dolor imperdiet.<br>
        In venenatis, neque at egestas elementum, felis nisi pretium ante, eget pellentesque justo felis et enim.
      </p>
      <hr>
      <p>
        Suspendisse scelerisque elit venenatis, semper est luctus, interdum est.
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
	},
	mounted(){
		//const rightComponent = document.querySelector(".meta-component")
		/*
		const metaComponent = document.querySelector(".meta-component")
		window.addEventListener("scroll",e => {
			const boundingRect = metaComponent.getBoundingClientRect()
			console.log(window.scrollTop + "px")
			metaComponent.style.setProperty("--meta-y-offset",window.scrollY + "px")
			console.log(metaComponent.getBoundingClientRect())
			console.log(metaComponent.clientTop)
		},{
			passive: true
    })
    */
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