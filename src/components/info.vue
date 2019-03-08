<template>
  <div class="meta-component" v-once>
    <div class="component-title">
      Info
    </div>
    <div class="component-content">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>
        Aliquam placerat ipsum id nulla maximus maximus. Morbi tincidunt aliquet libero non interdum.
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