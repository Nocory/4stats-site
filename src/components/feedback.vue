<template>
	<div class="component-feedback has-text-centered">
    <div class="section">
      <div class="container">
        <div class="sorf">Feedback, bugs or suggestions:</div>
        <form method="post" class="has-text-left" name="contact" autocomplete="off" netlify-honeypot="dont">
          <input type="hidden" name="form-name" value="feedback">
		      <input type="text" name="dont" class="is-hidden">
          <input type="text" class="input" name="message" required minlength="10" maxlength="1000" placeholder="type...">
          <button class="button" type="submit">Send</button>
        </form>
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
.section{
  //margin-bottom: 0;
  //padding-bottom: 0;
}

.container{
  width: 800px;
  max-width: 95%;
}

.sorf{
  margin: 0 auto;
  text-align: left;
  color: $oc-gray-0;
}

form{
  display: flex;
  justify-content: center;

  button{
    margin-left: 1rem;
    min-width: 100px;
  }
}
</style>