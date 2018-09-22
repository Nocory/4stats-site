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
            Can you not go back and find data from before you started this site? Going on the archives and searching all posts in a board from the start of a week to the end should work right? You could do this with the bigger boards, maybe not check every week in every month but having some data and some approximations would be nice
          </div>
          <div class="a">
            Yeah that should be possible. It got mentioned before, but I never had the impulse to attempt it so far.<br>
            It shouldn't even be very complicated, just time consuming, since the data is scattered across different archives and I don't know if they have different APIs or handle post timezones differently.<br>
            If I find the time during the next week, I can try it with one board at first and see how it goes.<br>
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            What time zone is used in the board timeline graphs?
          </div>
          <div class="a">
            Unless something is not working correctly, the hourly graph should use your local timezone and the daily stats show days starting at 9AM UTC (the graph says 12am, but that's just for proper alignment with the axis).<br>
            I think there could be an issue though where the daily stats have the date offset by one day if viewed in certain timezones.<br>
            Something I can look at again in the future, but dealing with dates and timezones isn't really a fun activity.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            Do you have any data on which countries the 4chan visitors come from?
          </div>
          <div class="a">
            No I don't have that.<br>
            The site analyzes data from the catalogs only.<br>
            This way boards can be updated more frequently, compared to looking at individual threads and posts.<br>
            Some archive sites keep track of that though.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            What is the highest threads/hour count a board has ever had?
          </div>
          <div class="a">
            Don't know about "ever", as I only started the site a little over a year ago.<br>
            I think the highest since then was ~880 on /sp/ during the world cup, when England got eliminated. 
            <a href="https://desu-usergeneratedcontent.xyz/qa/image/1531/34/1531343001586.png">*pic here*</a><br>
            Though I am sure this wasn't the highest in 4chan history.<br>
            /v/ during E3 2018 was also very active. I am not 100% sure, but I think it wasn't more threads than /sp/.
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
        <div class="qa-card">
          <div class="q">
            Ability to see graph over longer time periods, such as months and quarters?
          </div>
          <div class="a">
            If you mean the hourly stats, I don't think there is much of a point to store more than 4 weeks of data. 4 weeks looks a bit chaotic already.<br>
            The daily stats are usually what you would want to check if you go back for more than a month. There is a record of almost a full year by now.
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