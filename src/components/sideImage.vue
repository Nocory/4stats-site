<template>
  <div v-once class="sideImage-component">
    <img src="~/static/1543041166611cc.jpg" />
  </div>
</template>

<style scoped lang="scss">
.sideImage-component {
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
