<template>
  <div class="component-feedback">
    
    <div class="container">
      <form name="feedback" method="post" netlify autocomplete="off" netlify-honeypot="dont">
        <input type="hidden" name="form-name" value="feedback">
        <input type="text" name="dont" class="is-hidden">
        <div netlify-recaptcha></div>
        <textarea rows="10" name="message" required minlength="10" maxlength="1000" placeholder="type..."/>
        <button type="submit">Send</button>
      </form>
      <div class="explanation">
        If you have a question and submit it anonymously, I will add a reply to the list below for a few days.<br>
        (Or mention 4stats.io somewhere on 4chan and I will usually see it after a few hours during late euro times)
      </div>
      <div class="qa-card">
        <div class="qa-card__question">
          Have you ever thought of implementing some kind of measure of "interestingness" of a thread?<br>
          Something like Reply Length vs Reply Rate, or maybe Number of Replies based on certain keywords?<br>
          Also, it can be useful to add a feature to look for certain thread title keywords, such as "general" or "storytime"...
        </div>
        <div class="qa-card__answer">
          I wouldn't really want to set up a system to rate or curate threads in such a way, that goes much beyond just showing the ones contributing the most to a boards current activity, as it is now.<br>
          <br>
          For the threadlist on the main page it's not even technically possible, as it only has the data from the catalog (OP + 5 most recent replies) to generate the stats.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__question">
          can you post the code for the website on github in case you can't fund it
        </div>
        <div class="qa-card__answer">
          Scroll all the way down.<br>
          On the bottom of each page are links to the relevant repositories.<br>
          <br>
          Current yearly cost is ~200$, though if I wanted I could cut the cost down by half, by combining the Gatherer and API server and using a cheaper TLD.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__question">
          Why doesn't /adv/ preview OP images?
        </div>
        <div class="qa-card__answer">
          Adblockers prevent them from loading because of the ".org/adv/" in "https://i.4cdn.org/adv/1531810755359s.jpg".<br>
          Not sure what to do about it really.
        </div>
      </div>
    </div>
      
  </div>
</template>

<script>
import axios from "axios"
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
.component-feedback{
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
	@include mobile{
		padding: 1rem;
  }
  
	@include tablet{
		padding: 1rem;
	}

	@include widescreen{
		padding: 2rem 2rem 2rem;
	}
}

.container{
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form{
  z-index: 2;
  width: 512px;
  max-width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  >textarea{
    width: 100%;
    border-radius: 4px;
    padding: 1rem;
    @include float-shadow-box;
    margin-bottom: 1rem;
  }

  >button{
    padding: 0.5rem 2rem;
    border-radius: 4px;
    border-style: solid;
    @include float-shadow-box;
  }
}

.explanation{
  text-align: center;
  color: $oc-gray-7;
  margin-bottom: 1rem;
  padding: 1rem;
  font-size: 0.8em;
  font-weight: bold;
  max-width: 100%;
  background-color: #f1f1f1;
  //border: 2px solid $--color-highlight-1;
  @include float-shadow-box;
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
  @include float-shadow-box;

  &__question{
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
  &__answer{
    color: $oc-gray-7;
  }
}
</style>