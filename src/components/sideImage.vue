<template>
  <div v-once class="sideImage-component">
    <img src="~/static/h.png" />
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
