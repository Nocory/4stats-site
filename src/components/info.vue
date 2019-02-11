<template>
  <div class="meta-component" v-once>
    <div class="component-title">
      Info
    </div>
    <div class="component-content">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>
        Aliquam placerat ipsum id nulla maximus maximus. Morbi tincidunt aliquet libero non interdum.<br>
        <hr>
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;<br>
        Duis orci mauris, facilisis sit amet sagittis vel, accumsan eget dui.
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
  background: var(--background-content);
  border-top: 1px solid var(--border-content);
  display: flex;
  flex-direction: column;
  padding: 1em;
  color: var(--color-text);
  //font-size: 0.8em;
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