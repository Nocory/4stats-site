<template>
  <div class="meta-component" v-once>
    <div class="component-title">
      Info
    </div>
    <div class="component-content">
      <b><a href="https://dev.4stats.io">dev.4stats.io</a></b>
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
  display: flex;
  flex-direction: column;
  padding: 1em;
  color: $--color-text;
  //font-size: 0.8em;
}

b{
  text-decoration: underline;
}

hr{
  background: $--color-text;
  margin: 0.5rem 0;
  width: 10%;
}

p{
  margin: 0;
}
</style>