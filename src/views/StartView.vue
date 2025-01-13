<template>
  <div class="container">
  <header>

    <button v-on:click="switchLanguage" class="langbutton">
      <img v-if="lang === 'en'" 
        src="/img/Flag_of_Sweden.svg.png" alt="sweflag"/>
      <img v-else 
        src="/img/United_Kingdom.png" alt="engflag"/>
    </button>
  </header>

  <h1>{{ uiLabels["sales-pitch"] }} <span class="questionMark">?</span></h1>
  <!--Gå med-->
  <router-link to="/create/" >
    <button class="createButton">{{ uiLabels.createQuiz }}</button>
  </router-link>
  <!--Gå med i quiz-->
  <router-link to="/join/">
    <button class="enterButton">{{ uiLabels.joinQuiz }}</button>
  </router-link>
</div>
</template>

<script>
import io from 'socket.io-client';
//const socket = io("localhost:3000");
//sessionStorage.setItem("dataServer", "130.243.231.147:3000")
//sessionStorage.setItem("dataServer", "localhost:3000")
sessionStorage.setItem("dataServer", ""); // för render
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'StartView',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
  }
}
</script>

<style scoped>
.container {
  display:block; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background: linear-gradient(135deg, #0a0347, #3c298f); 
  background-attachment: fixed; 
  background-size: cover; 
  margin: 0; 
  padding: 0; 
  text-align: center;
  box-sizing: border-box; 
}
.langbutton {
  border: none; 
  background: none; 
  padding: 0; 
  cursor: pointer;
}
.langbutton img {
  width: 48px; 
  height: 32px; 
  margin-left: 530px; 
  margin-top: 10px; 
  position: absolute;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4); 
}
.langbutton img:hover {
  transform: scale(1.2);

}
h1 {
  font-family: 'Copperplate Gothic', 'Copperplate', serif;
  font-size: 57px;
  margin-top: 150px;
  color: #cfcfcf;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 5px 0 #0000003b;
}

.questionMark {
  display: inline-block;
  font-size: 80px; 
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0); 
  }
  50% {
    transform: translateY(-10px);
  }
}

.enterButton, .createButton{
  border: none;
  cursor: pointer;
  margin-left: 100px; 
  margin-right:100px;
  font-size: 20px; 
  font-weight:bold;
  background-color: rgb(255, 136, 0);
  color: #1e084f; 
  border-radius: 10px; 
  cursor: pointer;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: 220px;
  height:50px;
  text-decoration: none;
}

.enterButton:hover, 
.createButton:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2); 
}

@media (max-width: 480px) {
  h1 {
    font-size: 30px; 
    margin-top: 130px;
  }

  .langbutton img {
    margin-left: 30%; 
  }

  .enterButton, .createButton {
    width: 38%; 
    height: 8%;
    margin: 2%;
    font-size: 5vw;
    white-space: nowrap;
  }

  .questionMark {
    font-size: 50px; 
  }

  .langbutton img {
    width: 40px; 
    height: 28px; 
    margin-left: 27%; 
    margin-top: 5px; 
  }
}
</style>