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
          If you have a question and submit it anonymously, then I will add a reply to the list below for a few days.<br>
          (Or mention 4stats.io somwhere on 4chan and I will usually see it after a few hours during late euro times)
        </div>
        <div class="qa-card">
          <div class="q">
            Hey, would it be possible to add some kind of time series analysis for the hourly timeline? What I mean is a graph that shows the activity by each hour/minute (00:00-23:59), but takes an average/median over a longer time (like the last month) In the same vein, would it be possible to add a normalized view of the board timeline? Like divide each board (if showing multiple at the same time) by their averages. Then you could see if, for instance, /k/ and /int/ have the same top hours. Cheers!
          </div>
          <div class="a">
            I have 5-minute interval data for the last few months, so in theory yes.<br>
            Working on features for the graph is one of the really time consuming and less interesting tasks of the site though.<br>
            There are also some rewrites I want to do, so the stats-gatherer can better deal with 4chan downtimes and keep the stats more accurate.<br>
            Will see how it goes.<br>
            <br>
            For a normalized timeline you can currently choose to show activity in the hourly graph instead of posts/min.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            can you post the code for the website on github in case you can't fund it
          </div>
          <div class="a">
            Scroll all the way down.<br>
            On the bottom of each page are links to the relevant repositories.<br>
            <br>
            Current yearly cost is ~200$, though if I wanted I could cut the cost down by half, by combining the Gatherer and API server and using a cheaper TLD.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            Why doesn't /adv/ preview OP images?
          </div>
          <div class="a">
            Adblockers prevent them from loading because of the ".org/adv/" in "https://i.4cdn.org/adv/1531810755359s.jpg".<br>
            Not sure what to do about it really.
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