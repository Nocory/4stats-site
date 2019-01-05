<template>
  <div class="component-feedback has-text-centered">
    <div class="board-buttons">
      <div v-for="board in allBoards" :key="board" :class="{'board-selected': selectedBoard == board}" class="board-button" @click="chooseBoard(board)">
        {{ board }}
      </div>
    </div>
    <div class="section">
      <div class="container">
        <p>Some work-in-progress stuff. This will ultiamtely serve for some kind of more detailed post- and text-analysis</p>

        <p>Recent /{{ selectedBoard }}/ posts</p>
        <div class="post" v-for="post in recentPosts" :key="post.no">
          <hr>
          <p>{{ post.no }}</p>
          <p v-html="post.com"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios")
const pino = require("js/pino")
const config = require("js/config")
export default {
	data: () => ({
    allBoards: config.allBoards,
    selectedBoard: "",
    recentPosts: []
	}),
	methods:{
    chooseBoard(board){
      this.selectedBoard = board
      axios.get(`http://localhost:8080/getRecentPosts/${board}/100`)
      .then(res => {
        this.recentPosts = res.data
      })
    }
  },
  mounted(){

  }
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.container{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.board-buttons{
  display: flex;
  >.board-button{
    font-size: 0.75rem;
    padding: 0.25rem;
    cursor: pointer;
  }
}

.post{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  >hr{
    height: 2px;
    width: 128px;
    background: #888;
  }
  >p{
    display: inline-block;
    text-align: left;
  }
}

</style>