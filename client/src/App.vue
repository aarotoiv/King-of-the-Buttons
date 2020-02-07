<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    console.log("Up and running");
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    width: 100vw;
    height: 100vh;
  }
  #app {
    margin: 0;
    padding:0;
    background:#ccc;
    width: 100%;
    height: 100%;
    position:relative;
  }
</style>
