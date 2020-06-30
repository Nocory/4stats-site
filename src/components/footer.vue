<template>
  <div v-once class="relative bg-gray-900 text-gray-400 p-4">
    <div class="">
      <p>
        Data source: <a href="https://4chan.org" target="_blank" rel="noopener">https://4chan.org</a>.<br />
        The information above is gathered via the <a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">4chan API</a>.
      </p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.component-footer {
  z-index: 10;
  padding: 1rem;
  @include desktop {
    @include float-shadow-box;
  }
}

p {
  font-size: 0.875rem;
  margin: 0;
}

a {
  text-decoration: underline;
  color: white;
}
</style>
