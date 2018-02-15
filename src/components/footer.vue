<template>
  <div class="component-footer">
    <div class="section">
      <div class="container">
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
          <button class="button" @click="showFeedbackForm = true">Feedback / Contact</button>
        </p>
      </div>
      <component-feedback v-if="showFeedbackForm" :show-feedback-form.sync="showFeedbackForm"/>
    </div>
  </div>
</template>

<script>
export default {
	data: () => ({
		showFeedbackForm : false
	}),
	components: {
		componentFeedback: require('./feedback.vue').default
	}
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

.component-footer{
  position: relative;
}

.section{
  padding: 1.5rem 0 3rem;
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
	@include float-shadow-text;
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