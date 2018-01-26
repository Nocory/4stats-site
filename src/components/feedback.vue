<template>
  <div class="component-feedback has-text-centered">
    <form method="post" class="has-text-left" name="contact" autocomplete="off" netlify-honeypot="dont">
      <input type="hidden" name="form-name" value="feedback">
      <input type="text" name="dont" class="is-hidden">
      <textarea class="textarea" rows="10" name="message" required minlength="10" maxlength="1000" placeholder="type..."/>
      <div class="button-group">
        <button class="button" @click="$emit('update:showFeedbackForm', false)">Cancel</button>
        <button class="button" type="submit">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";
.component-feedback{
  z-index: 1001;
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.9);
}

form{
  z-index: 2;
  width: 512px;
  max-width: 95%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group{
  width: 100%;
  display: flex;
  justify-content: space-around;
}

button{
  margin: 1rem 0 0;
  width: 128px;
}
</style>