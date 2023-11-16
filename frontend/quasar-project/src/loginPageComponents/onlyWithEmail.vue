<template>
  <q-card flat class="bg-transparent">

    <q-card-section
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '70%'
      }"
    >

      <q-card-section class="text-left">
        <q-btn
          v-on:click="goBack"
          icon="keyboard_backspace" flat color="grey-8"></q-btn>
      </q-card-section>
      <q-input
        v-model="this.userData.email"
        filled type="email"
        color="grey-8"
        label="Email"
      >
      <template v-slot:prepend>
        <q-icon name="email"></q-icon>
      </template>
      <template v-slot:append>
        <q-btn
          v-on:click="delete this.userData.email"
          v-if="this.userData.email"
          icon="remove" flat color="red-4"></q-btn>
      </template>
      </q-input>

      <q-btn
        :disable="this.checkUserDataEmail() === true ? false : true"
        v-on:click="sendLinkEmail"
        no-caps label="Send Link to Email"
        class="full-width q-mt-sm"
        icon="send" rounded color="green-4"></q-btn>

    </q-card-section>
  </q-card>
</template>

<script>
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useCounterStore } from 'src/stores/store';
export default {
  props:['propUserData'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      userData:{}
    }
  },
  methods:{
    goBack(){
      const goBackActive = true
      this.$emit('goBackFromOnlywithemail',goBackActive)
    },
    checkUserDataEmail(){
      const check = this.userData.hasOwnProperty('email')
      return check
    },
    sendLinkEmail(){

       const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${this.store.baseUrl}/login`,
        // This must be true.
        handleCodeInApp: true,
        iOS: {
          bundleId: `${this.store.baseUrl}/login`
        },
        android: {
          packageName:`${this.store.baseUrl}/login`,
          installApp: true,
          minimumVersion: '12'
        },
        dynamicLinkDomain: `${this.store.baseUrl}/login`
      };
      const email = this.userData.email
      const auth = getAuth();
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', email);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    }
  },
  created(){

  },
  watch:{
    propUserData:{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('email')
          if(check){
            this.userData.email = newVal.email
          }
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
