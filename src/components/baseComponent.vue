<template>
  <div class="base-component flex flex-col">
    <div v-if="title" class="component-title h-10 flex items-center px-4 border-b-2 border-gray-400">
      {{ title }}
    </div>

    <div class="component-content relative flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="scss" scoped>
.base-component {
  @include widescreen {
    @include float-shadow-box;
    border-radius: 0.25rem;
    overflow: hidden;
  }
}

.component-title {
  background-color: var(--nav-bg);
  color: var(--nav-text-color);
}

.component-content {
  //
}
</style>
