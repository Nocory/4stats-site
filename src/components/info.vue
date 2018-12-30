<template>
  <div class="meta-component">
    <div class="component__header is-hidden-mobile">
      Info
    </div>
    <div class="info-wrapper">
      <!--
      <img src="../static/hiroooo.png">
      -->
      I calculated some more stats from this years data.<br>
      You can check out this thread:
      <a href="https://boards.4channel.org/qa/thread/2518414">&gt;&gt;&gt;/qa/2518414</a>
      or this pastebin:
      <a href="https://pastebin.com/raw/NeVmmEwj">https://pastebin.com/raw/NeVmmEwj</a>
      <hr>
      Thanks to a helpful admin from desuarchive.org & rbt.asia extended earlier data for these archived boards has been added to the timeline.<br>
      <hr>
      <b>Boardlist changes:</b>
      <ul>
        <li>'Activity Now' renamed to 'rel. to peak'<br>
        <i>(current board activity relative to average daily peak)</i></li>
        <li>New 'rel. to ToD' column<br>
        <i>(current board activity relative to average activity this time-of-day)</i></li>
        <li>More accurate 'Avg Posts/day' <i>(bit lower)</i></li>
        <li>Tooltips updated</li>
      </ul>
      <hr>
      <b>Timeline changes:</b>
      <ul>
        <li>Start- and end-date can be specified for the day timeline</li>
        <li>Added button for cycle-data<br>
        <i>(showing board data in 5 minute intervals for the last 3 days)</i></li>
      </ul>
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
    font-size: 0.8em;
  >a{
    color: rgba(180, 215, 255, 0.8);
  }
  >ul{
    padding-left: 1em;
    list-style-type: disc;
  }
}

hr{
  background: rgba(255,255,255,0.8);
  margin: 0.5rem 0;
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