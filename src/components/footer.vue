<template>
  <div class="component-footer has-text-centered">
    <div class="section">
      <div class="container">
        <p class="changelog">
          Recent changes:<br>
          <ul>
            <li>Jan 17th: Rewritten backend & added API. All Boards now enabled by default.</li>
          </ul>
        </p>
        <br>
        <p>
          The information above is gathered from the 4chan API.
          <br> Visit
          <a href="https://4chan.org" target="_blank" rel="noopener">4chan.org</a> to view all boards & threads or check out the
          <a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">API documentation</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

textarea {
	color: black;
}

* {
	color: #f1f1f1;
}

.component-footer>.section {
	background: transparent;
}

p {
	font-size: 0.875rem;
}

a {
	color: $nord14;
}

.changelog{

}

.tfw-nocoiner{
	display: none;
	font-size: 0.5rem;
}
</style>