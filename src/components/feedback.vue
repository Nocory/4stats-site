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
          In case you include some personal contact information like an email address or such, then your submission won't be added to the list below of course.
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
            yuo already use JS, let me hit ESC to close the board preview my man
          </div>
          <div class="q">
            i don't want to learn webpack just so I could commit ``` document.addEventListener('keyup', e=>{if(e.keyCode === 27){document.querySelector('.back-button').click();} }); ``` to your repo, do it for me :^) :^) :^)
          </div>
          <div class="a">
            You are using a keyboard together with the mobile view?<br>
            For special cases like this it's much better, if you used some browser-extension to inject the extra JS you need, than for me to add that code to the site itself.
          </div>
        </div>
        <div class="qa-card">
          <div class="q">
            Bro, not working on Safari after your recent updates/changes? Thanks for your work.
          </div>
          <div class="a">
            <a href="https://rbt.asia/g/thread/65076366/#q65077239">https://rbt.asia/g/thread/65076366/#q65077239</a>
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
        <div class="qa-card">
          <div class="q">
            hey can you make space between threads disappear like it was before? it would be more simpler
          </div>
          <div class="a">
            yeah did that
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