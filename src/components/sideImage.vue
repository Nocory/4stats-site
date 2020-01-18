<template>
  <base-component v-once class="base-component">
    <img src="~/static/1543041166611cc.jpg" />
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
  display: flex;
  flex-direction: column;
  position: relative;
  @include float-shadow-box;
}
img {
  width: 100%;
  object-fit: contain;
}
</style>
