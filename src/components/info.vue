<template>
  <div class="meta-component" v-once>
    <div class="component-title">Info</div>
    <div class="component-content">
      <p>I was playing a round of CS:GO and my video card just fucking dies mid-game.</p>
      <p>Shit sucks</p>
      <br>
      <p>Made it all the way from 2012 till now.</p>
      <br>
      <p>Thanks for reading my blog.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">

.meta-component{
  display: flex;
  flex-direction: column;
  @include float-shadow-box;
  position: relative;
  //height: 100px;
}

.component-content{
  //background: $--background-content-2n;
  background: var(--background-content);
  display: flex;
  flex-direction: column;
  padding: 1em;
  color: var(--color-text);
  
  line-height: 1.2;
  //font-size: 0.8em;
}

b{
  text-decoration: underline;
}

hr{
  background: var(--color-text);
  margin: 0.5rem 0;
  width: 10%;
}

p{
  margin: 0;
}
</style>