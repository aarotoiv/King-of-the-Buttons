<template>
  <div id="home">
   <p id="home-title">King of the Buttons</p>
   <input type="text" id="player-name" placeholder="Name.." @change="nameChanged">
   <button id="go-button" type="button" @click="go">Go game</button>
   <div id="home-error-box" v-if="hasError"> 
    <p id="home-error-text">
      {{errorText}}
    </p>
   </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      playerName: "",
      hasError: false,
      errorText: ""
    }
  },
  created() {
      if(this.$route.params.error) {
        this.hasError = true;
        this.$set(this, 'errorText', this.$route.params.error);
      } 
  },
  methods: {
    
    nameChanged(elem) {
      this.$set(this, 'playerName', elem.target.value);
    },
    go() {
      this.$router.push({ name: 'RoomView', params: { userName: this.playerName, roomId: "asdf" } })
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
  #player-name {
    width: 500px;
    height: 75px;
    display:block;
    margin: 100px auto;
    font-size: 40px;
    padding: 0px 10px 0px 10px;
    background: #000;
    border:none;
    border-bottom: solid 5px #fff;
    color: #fff;
    text-align:center;
  }
  #player-name::placeholder {
    color: #fff;
  }
  #go-button {
    width: 200px;
    height: 50px;
    display:block;
    margin: 0 auto;
    font-size: 20px;
  }
  #home-error-text {
    color: red;
    text-align:center;
    padding-top: 50px;
  }
</style>

