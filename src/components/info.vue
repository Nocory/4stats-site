<template >
  <div class="meta-component" v-once>
    <div class="component__header is-hidden-mobile">
      Info
    </div>
    <div class="info-wrapper">
      <!--
      <img src="../static/hiroooo.png">
      -->
      <p>
        I calculated some more stats from last years data.<br>
        You can check out this thread:<br>
        <a href="https://boards.4channel.org/qa/thread/2518414">&gt;&gt;&gt;/qa/2518414</a><br>
        or this (updated) pastebin:<br>
        <a href="https://pastebin.com/raw/NeVmmEwj">https://pastebin.com/raw/NeVmmEwj</a>
      </p>
      <hr>
      <p>
        Also started calculating some additional stats from individual posts.<br>
        Updates for those stats have longer intervals, but it's some data, that can't be calculated from the catalogs alone.<br>
        <a href="https://4stats.io/postAnalysis">https://4stats.io/postAnalysis</a>
      </p>
      <hr>
      <p>
        Thanks to a helpful admin from <a href="https://desuarchive.org">desuarchive.org</a> & <a href="https://rbt.asia">rbt.asia</a> extended earlier data for these archived boards has been added to the timeline.<br>
      </p>
    </div>

  </div>
</template>

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
  a{
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