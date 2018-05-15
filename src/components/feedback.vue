<template>
  <div class="component-feedback has-text-centered">
    <div class="section">
      <div class="container">
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
        <div class="description">
          If you have a question and submit it anonymously, then I will add a reply to the list below for a few days.
        </div>
        <div class="qa-card">
          <div class="q">
            some of the fonts are misaligned when being displayed on a vertical monitor, by the way. specifically the "activity now" on my end. great website otherwise, many thanks
          </div>
          <div class="a">
            Thanks, yeah it's not quite right on certain sizes. I tweaked the layout on different widths now, but on FF it still goes past the column sometimes, with that much text in the header.
            <br>If it still doesn't look right for you, then maybe link me a screenshot and the res of your screen if you want.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            suggestion: filter threads by average post length, longest post in thread, # of links in thread/on board
          </div>
          <div class="a">
            The thread-data I use is taken from the boards catalog.
            Filtering by average post-length or # of links would require fetching each thread individually, which is possible, but not practical due to 4chan API limits.
            (And would also use much more bandwidth)
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            hey is it possible to not calculate replies but only calculate posts by posters so that we can get rid of samefag 1 man spams?
          </div>
          <div class="a">
            All the data I process is taken from a boards catalog. For that kind of info you would need to query each individual thread, which isn't feasable to do for all 72 boards, due to 4chan API limits.<br>
            But the thread-list is really just to show pure activity, whether samefags or genuine replies.
          </div>
        </div>
      </div>
    </div>
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
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.9);
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
}

.container{
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form{
  z-index: 2;
  width: 80%;
  max-width: 512px;
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

.description{
  width: 80%;
  max-width: 512px;
  position: relative;
  color: $oc-gray-0;
  text-align: center;
  padding: 0.5rem 0;
  margin: 2rem;
  &::before{
    position: absolute;
    content: "";
    top: 0px;
    left: 25%;
    width: 50%;
    height: 1px;
    background: $oc-gray-0;
  }
  &::after{
    position: absolute;
    content: "";
    bottom: 0px;
    left: 25%;
    width: 50%;
    height: 1px;
    background: $oc-gray-0;
  }
}

.qa-card{
  position: relative;

  width: 80%;
  max-width: 512px;

  margin: 0.5rem 0;
  padding: 1rem;
  //
  background: $oc-gray-0;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  line-height: 1.2;

  >.q{
    position: relative;
    color: $oc-gray-7;
    font-weight: bolder;
    margin-bottom: 1rem;
    &::after{
      content: "";
      position: absolute;
      left: 0rem;
      bottom: -0.5rem;
      height: 2px;
      width: 4rem;
      background: $oc-blue-8;
    }
  }
  >.a{
    color: $oc-gray-7;
  }
}
</style>