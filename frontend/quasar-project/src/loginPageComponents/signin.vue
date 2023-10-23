<template>
  <q-card
    flat class="bg-transparent"
  >
    <q-card-section class="text-center">
      <div class="">
        <!-- <q-btn icon="login" flat color="grey-8" size="lg" no-caps label="Login"></q-btn> -->
      </div>
    </q-card-section>
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-bold text-grey-7">
        Sign In
      </div>
    </q-card-section>
    <q-card-section
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '70%'
      }"
    >
      <q-input
        v-model="this.userData.email"
        label="Email"
        color="grey-8"
        type="email"
        bottom-slots
      >
        <template v-slot:hint>
          <q-btn
            v-if="this.userData.email"
            v-on:click="selectOnlyEmailOptionFunc"
            flat icon="info" label="Sign In With Passwordless Option" no-caps size="sm" color="dark"></q-btn>
        </template>
        <template v-slot:prepend>
          <q-icon name="email"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.userData.email" v-on:click="delete this.userData.email"></q-btn>
        </template>
      </q-input>
      <q-input
        type="password"

        :class="this.store.mobileActive ? 'q-mt-xl' : 'q-mt-lg'"
        v-model="this.userData.password"
        label="Password"
        color="grey-8"
      >
        <template v-slot:prepend>
          <q-icon name="lock"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.userData.password" v-on:click="delete this.userData.password"></q-btn>
        </template>
      </q-input>
      <q-card-section class="text-right">
        <q-btn
          v-on:Click="updatePassword()"
          flat label="Forgot Password ?" no-caps></q-btn>
      </q-card-section>

      <q-btn
        v-on:click="signInTheSystem"
        class="full-width q-mt-sm"
        :disable="this.checkEmailAndPassword() ? false : true"
        icon="login" color="grey-7" no-caps label="Sign In" rounded></q-btn>
        <q-separator size="1.5px" class="q-mt-sm"></q-separator>
        <q-card-section
          class="text-center row">
          <q-btn
            flat
            v-on:click="this.selectOption(data)"
            :text-color="data.color"
            :icon="data.icon"
            push
            class="col"
            v-for="(data,key) in this.loginOptions" :key="key"
          >
            <q-tooltip>
              {{ data.label }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-separator></q-separator>
    </q-card-section>
  </q-card>
</template>

<script>
import googleIcon from '../loginPageComponents/googleIcon.png'
import
  {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    updatePassword,
    sendPasswordResetEmail,
    signInAnonymously
  } from "firebase/auth";
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store,
      googleIcon
    }
  },
  data:function(){
    return{
      userData:{},
      loginOptions:[
        {id:1,label:'Google',icon:'fa-brands fa-google',color:'red-4',message:'Sign In With Google'},
        {id:2,label:'Phone',icon:'phone',color:'blue-4'},
        {id:3,label:'Anonymous',icon:'person',color:'grey-8'},
      ]
    }
  },
  methods:{
    signInAnon(){
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          // Signed in..
          this.$router.push(
            {
              path:'/'
            }
          )
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error)
          // ...
        });
    },
    selectOnlyEmailOptionFunc(){
      if(this.userData.email){
        const active = true
        console.log(active)
        const email = this.userData.email
        this.$emit('emituserdataemail',email)
        this.$emit('onlyWithEmailActive', active)
      }
    },
    updatePassword(){
      if(this.userData.email){
        const auth = getAuth();
        const email = this.userData.email
        sendPasswordResetEmail(auth, email)
          .then(() => {
            // Password reset email sent!
            // ..
            this.$q.notify({
              type:'positive',
              icon:'info',
              message:'Password Reset Code Successfully Sended. Check Your Email.'
            })
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });
      }else{
        this.$q.notify({
          type:'negative',
          icon:'info',
          message:'Please Enter Email !',
          position:'bottom'
        })
      }
    },
    signInTheSystem(){
      const email = this.userData.email
      const password = this.userData.password
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          this.$router.push(
            {
              path:'/'
            }
          )
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
    checkEmailAndPassword(){
      const check = ['email','password'].every(
        (key) => key in this.userData
      )
      return check
    },
    loginWithGoogle(){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          console.log(user)
          this.$router.push(
            {
              path:'/'
            }
          )
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    selectOption(data){
      if(data.id === 1){
        console.log(data)
        this.loginWithGoogle()
      }else if(data.id === 2){
        this.store.phoneValidDialogActive = true
      }else if(data.id === 3){
        this.$q.dialog({
          cancel:true,
          title:'Warning',
          message:'Are You Sure for Continue Anon ?'
        }).onOk(() => {
          this.signInAnon()
        }).onCancel(() => {
          //
        })
      }
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
