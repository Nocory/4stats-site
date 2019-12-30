<template>
  <base-component title="Info" class="base-component">
    <div class="component-content p-4 leading-normal text-sm">
      <a href="https://boards.4channel.org/qa/thread/3075847"
        >There is a stat-thread for 2019 up on /qa/<br />
        Check it out if you want.
      </a>
      <br />
      I edited this info-text a few days ago already, but just noticed I forgot to push it to the live site.<br />
      The thread is still up though.
      <!--<img src="../static/bird2.jpg" />-->
    </div>
  </base-component>
</template>

<script>
import baseComponent from "components/baseComponent.vue"
export default {
  components: {
    baseComponent
  }
}
</script>

<style scoped lang="scss">
.base-component {
  background: var(--bg2);
}

.component-content {
  display: flex;
  flex-direction: column;
}

b {
  text-decoration: underline;
}

hr {
  background: var(--color-text);
  margin: 0.5rem 0;
  width: 10%;
}

p {
  margin: 0;
  &:not(:last-child) {
    margin: 0 0 1rem;
  }
}

img {
  width: 100%;
  object-fit: contain;
}

a {
  text-decoration: underline;
}
</style>
