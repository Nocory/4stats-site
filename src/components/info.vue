<template>
  <div class="meta-component" v-once>
    <div class="component-title">
      Info
    </div>
    <div class="component-content">
      <p>
        Back to normal.
      </p>
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
  border-top: 1px solid rgba(255,255,255,0.2);
  display: flex;
  flex-direction: column;
  padding: 1em;
  color: $--color-text;
  //font-size: 0.8em;
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