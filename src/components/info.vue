<template>
  <div class="meta-component" v-once>
    <div class="component-title">
      Info
    </div>
    <div class="component-content">
      <p>
        Lots of CSS updates.<br>
        Hope nothing is broken.
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
  //height: 100px;
}

.component-content{
  display: flex;
  flex-direction: column;
  background: $--color-highlight-2;
  color: $--color-text;
  padding: 1em;
  color: $oc-gray-0;
  //font-size: 0.8em;
}

a {
  color: rgba(180, 215, 255, 0.8);
}

hr{
  background: rgba(255,255,255,0.8);
  margin: 0.5rem 0;
  width: 10%;
}

p{
  margin: 0;
}
</style>