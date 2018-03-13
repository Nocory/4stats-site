<template>
  <div class="component-feedback has-text-centered is-overlay">
    <form name="feedback" method="post" class="has-text-left" netlify autocomplete="off" netlify-honeypot="dont">
      <input type="hidden" name="form-name" value="feedback">
      <input type="text" name="dont" class="is-hidden">
      <textarea class="textarea" rows="10" name="message" required minlength="10" maxlength="1000" placeholder="type..."/>
      <div class="button-group">
        <router-link to="/">
          <button class="button" type="button" @click="$emit('update:showFeedbackForm', false)">Cancel</button>
        </router-link>
        <button class="button" type="submit">Send</button>
        <!--<button class="button" type="button" @click="send">Send</button>-->
      </div>
    </form>
  </div>
</template>

<script>
const axios = require("axios")
export default {
	methods:{
		send(){
			var params = new URLSearchParams()
			params.append('param1', 'value1')
			params.append('param2', 'value2')
			axios.post('/', params)
		}
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";
.component-feedback{
  background: rgba(0,0,0,0.9);
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

form{
  z-index: 2;
  width: 512px;
  max-width: 95%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group{
  width: 100%;
  display: flex;
  justify-content: space-around;
}

button{
  margin: 1rem 0 0;
  width: 128px;
}
</style>