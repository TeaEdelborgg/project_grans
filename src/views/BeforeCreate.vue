<template>
    <div>
    <router-link to="/makeQuiz/">
        <button>{{ uiLabels.makeQuiz }}</button>
    </router-link>

    <router-link to="/selectQuiz/">
        <button>{{ uiLabels.selectQuiz }}</button>
    </router-link>
    </div>
</template>

<script>

import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'BeforeCreate',
  /*components: {
    ResponsiveNav
  },
  */
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
      //hideNav: true

    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  
}
</script>
