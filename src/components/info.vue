<template>
  <base-component title="2020" class="base-component">
    <div class="component-content leading-normal text-sm">
      <img src="../static/1552405664437.jpg" />
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
