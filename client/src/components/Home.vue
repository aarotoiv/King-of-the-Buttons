<template>
  <div id="home">
   <p id="home-title">King of the Buttons</p>
   <input type="text" id="player-name" placeholder="Name.." @change="nameChanged">
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      playerName: ""
    }
  },
  methods: {
    nameChanged(elem) {
      this.$set(this, 'playerName', elem.target.value);
      console.log(this.playerName);
    }
  }
}
</script>
<style scoped>
  #home {
    width: 100%;
    height: 100%;
    background:#000;
    margin:0;
    padding:0;
    overflow:hidden;
  }
  #home-title {
    color: #fff;
    text-align:center;
    font-size: 50px;
  }
</style>

