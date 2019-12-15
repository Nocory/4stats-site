<template>
  <base-component title="Info" class="base-component">
    <div class="component-content p-4 leading-normal text-sm">
      Redoing some of the styling right now.<br />
      Some parts aren't consistent yet, but I will hopefully get that done soon.<br />
      <br />
      The other pages will be back soon as well.
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
