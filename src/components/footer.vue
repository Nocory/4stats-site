<template>
  <div class="component-footer" v-once>
    <div class="container is-fluid">
      <p>
        Data source: <a href="https://4chan.org" target="_blank" rel="noopener">https://4chan.org</a>.<br>
        The information above is gathered via the <a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">4chan API</a>.
      </p>
      <p>
        This project on Github:
        <a href="https://github.com/Nocory/4stats-gatherer" target="_blank" rel="noopener">Stats-Gatherer</a> / <a href="https://github.com/Nocory/4stats-api" target="_blank" rel="noopener">API-Server</a> / <a href="https://github.com/Nocory/4stats-site" target="_blank" rel="noopener">Website</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-footer{
  position: relative;
  background: #111;
  z-index: 10;
  padding: 1rem;
}

.container{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

p {
  font-size: 0.875rem;
  color: $oc-gray-5;
}

a {
	color: $--color-link;
}

hr{
  position: relative;
  width:256px;
  max-width: 90%;
}

.button{
  background: $oc-gray-9;
  color: $oc-gray-0;
  border: 2px solid $--color-link;
}
</style>