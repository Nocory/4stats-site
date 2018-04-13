<template>
  <div class="component-footer section">
    <div class="container">
      <p>
        Recent changes:<br>
        <ul>
          <li>Boardlist will now always render, even on 4chan outages</li>
          <li>Reenabled Chart for tablet widths</li>
        </ul>
      </p>
      <hr>
      <p>
        The information above is gathered from the 4chan API.
        <br> Visit
        <a href="https://4chan.org" target="_blank" rel="noopener">4chan.org</a> to view all boards & threads or check out the
        <a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">API documentation</a>
      </p>
      <hr>
      <p>
        This project on Github:<br>
        <a href="https://github.com/Nocory/4stats-gatherer" target="_blank" rel="noopener">Stats-Gatherer</a> / <a href="https://github.com/Nocory/4stats-api" target="_blank" rel="noopener">API-Server</a> / <a href="https://github.com/Nocory/4stats-site" target="_blank" rel="noopener">Website</a>
      </p>
      <hr>
      <p>
        <router-link to="/feedback">
          <button class="button">Feedback / Contact</button>
        </router-link>
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
  background: $--color-navbar;
	z-index: 10;
}

.container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
}

textarea {
	color: black;
}

* {
	color: $--color-text;
}

p {
	font-size: 0.875rem;
}

a {
	color: $--color-link;
}

hr{
  position: relative;
  margin: 1rem auto;
  width:256px;
  max-width: 90%;
}

.button{
  background: $oc-gray-9;
  color: $oc-gray-0;
  border: 2px solid $--color-link;
}
</style>