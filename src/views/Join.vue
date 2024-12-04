<template>
    <!--Här ska vi lägga in att man joinar, skicka med att man har gått med-->
    <!--enklare att kanske endast ha lobbyView, kommer annars behöva skicka data emellan?-->

<label>
    Write poll id: 
    <input type="text" v-model="newPollId">
  </label>
  <router-link v-bind:to="'/lobby/' + newPollId">
    {{ uiLabels.participatePoll }}
    <button>join</button>
  </router-link>

        
   
</template>

<script>


export default {
  name: 'Join',

   data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true
    }
  }
}
  </script>
