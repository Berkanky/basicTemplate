<template>
  <q-card
  flat class="bg-transparent"
  >
    <q-card-section class="text-center">
  <!--     <div class="text-h6 text-weight-bold text-grey-7">
        Sign Up
      </div> -->
      <q-btn icon="person_add" flat color="grey-8" size="lg"></q-btn>
    </q-card-section>
    <q-card-section
      style="margin:0 auto;"
        :style="{
          'width':this.store.mobileActive ? '100%' : '70%'
        }"
      v-if="this.signUpStep === 0">
<!--
        <q-card-section class="text-left">
          <q-btn
            no-caps
            v-on:click="cancelCodeProcess"
            icon="keyboard_backspace" flat color="grey-8"
          ></q-btn>
        </q-card-section> -->

        <div class="text-subtitle2 text-left q-pa-sm q-mb-md text-grey-7 text-weight-bold">
          <q-icon name="info" color="grey-8" size="sm"></q-icon>
          *Please Enter Your Email to Verify.
        </div>

      <q-input
        :readonly="this.checkEmailCodeResult() === true ? true : false"
        type="email"
        color="grey-6"
        label="Enter Email"
        filled
        v-model="this.checkEmailData.email"
      >
        <template v-slot:prepend>
          <q-icon name="email"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.checkEmailData.email" v-on:click="delete this.checkEmailData.email"></q-btn>
          <q-btn icon="send" flat color="grey-8" v-if="this.checkEmailData.email" v-on:click="sendEmailCodeAgain"></q-btn>
        </template>
      </q-input>
      <q-input
        :disable="this.codeInputActive === true ? false : true"
        label="Email Code"

        filled
        v-model="this.checkEmailData.emailCode"
        :class="this.store.mobileActive ? 'q-mt-xl' : 'q-mt-sm'"
        color="grey-8" type="text"
      >
        <template v-slot:prepend>
          <q-icon name="password" color="grey-8"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.checkEmailData.emailCode" v-on:click="delete this.checkEmailData.emailCode"></q-btn>
          <q-btn icon="restart_alt" flat color="grey-8" v-on:click="reSendCodeToEmail">
            <q-tooltip>
              Clear All
            </q-tooltip>
          </q-btn>
        </template>
      </q-input>
      <q-btn
        v-on:click="this.checkCodeCorrectOrFalse() === true ? this.signUpStep = this.signUpStep + 1 : this.$q.notify({type:negative,message:''})"
        :disable="this.checkEmailCodeResult() === true ? false : true"
        class="full-width q-mt-sm"
        rounded
        :color="this.checkCodeCorrectOrFalse() === true ? 'green-4' : 'red-4'"
        no-caps
        :label="this.checkCodeCorrectOrFalse() === true ? 'Correct' : 'Please Enter Correct UID'"
        :icon="this.checkCodeCorrectOrFalse() === true ? 'arrow_right' : 'restart_alt'"
      ></q-btn>
    </q-card-section>
    <q-card-section
      v-if="this.signUpStep === 1"
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '70%'
      }"
    >
      <q-input
        disable
        v-model="this.userData.email"
        label="Email"
        color="grey-8"
        type="email"

      >
        <template v-slot:prepend>
          <q-icon name="email"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.userData.email" v-on:click="delete this.userData.email"></q-btn>
        </template>
      </q-input>
      <q-input
        :type="isPwd ? 'password' : 'text'"
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
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="this.isPwd =! this.isPwd"
          />
        </template>
      </q-input>
      <q-input
        :type="isPwd ? 'password' : 'text'"
        :class="this.store.mobileActive ? 'q-mt-xl' : 'q-mt-lg'"
        v-model="this.userData.repassword"
        label="Password"
        color="grey-8"
      >
        <template v-slot:prepend>
          <q-icon name="restart_alt"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.userData.repassword" v-on:click="delete this.userData.repassword"></q-btn>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="this.isPwd =! this.isPwd"
          />
        </template>
      </q-input>
      <q-btn
        v-on:click="signUpSystem"
        class="full-width q-mt-lg"
        icon="person_add" label="SignUp"
        rounded color="grey-8" no-caps :disable="this.checkUserData() === true ? false : true"></q-btn>
    </q-card-section>
    <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
      <q-card-section
      v-if="this.codeInputActive"
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '70%'
      }"
      class="text-center">
      <q-card

        class="bg-grey-8 text-white"
      >
        <q-item  clickable class="text-center">
          <q-item-section avatar>
            <q-avatar>
              <q-icon
                color="white"
                name="info"> </q-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <vue-countdown v-if="this.codeInputActive" :time="60000" @end="onCountdownEnd" v-slot="{ totalSeconds }">
              Please Enter UID
              {{ totalSeconds }} Second Left</vue-countdown>
            <span v-else>Vertification Code Not Active</span>
          </q-item-section>
          <q-item-section>
            <q-btn icon="cancel" flat color="white" v-on:Click="this.cancelCodeProcess()"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    </transition-group>
    <q-card-section>
<!--       <q-btn
        :color="data.stepVal ===this.signUpStep ? 'green-5' : 'grey-8'"
        round :label="data.stepVal" class="q-ml-xs"
        v-for="(data,key) in stepOptions" :key="key"></q-btn> -->
    </q-card-section>
  </q-card>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    VueCountdown
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      signUpStep:0,
      userData:{},
      isPwd:false,
      checkEmailData:{},
      emailCodeReuslt:{},
      codeInputActive:false,
      stepOptions:[
        {stepVal:0},
        {stepVal:1}
      ]
    }
  },
  methods:{
    cancelCodeProcess(){
      this.signUpStep = 0
      this.emailCodeReuslt = {}
      this.checkEmailData = {}
      this.codeInputActive = false
/*       const cancelProcess = true
      this.$emit('cancelProcess',cancelProcess) */
    },
    signUpSystem(){
      const email = this.userData.email
      const password = this.userData.password
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          // ...
          this.store.firebaseData = user
          this.$router.push(
            {
              path:'/'
            }
          )
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
    checkCodeCorrectOrFalse(){
      const check = this.emailCodeReuslt.hasOwnProperty('vertificationId')
      const secCheck = this.checkEmailData.hasOwnProperty('emailCode')

      if(check && secCheck){
        const thirdCheck = this.emailCodeReuslt.vertificationId === this.checkEmailData.emailCode ? true : false
        return thirdCheck
      }else{
        return false
      }

    },
    reSendCodeToEmail(){
      this.emailCodeReuslt = {}
      this.codeInputActive = false
      this.checkEmailData = {}
    },
    checkEmailCodeResult(){
      const check = this.emailCodeReuslt.hasOwnProperty('vertificationId')
      return check
    },
    sendEmailCodeAgain(){
      ///sendEmailCheckCode
      const allBody = {
        checkEmailData:this.checkEmailData
      }

      axios.put(`${this.store.baseUrl}/app/sendEmailCheckCode`,allBody)
        .then (res => {
          console.log(res)
          this.emailCodeReuslt = res.data.newBody
        })
        .catch(err => {
          console.log(err)
        })

    },
    checkUserData(){
      const check = ['email','password','passwordCheck'].every(
        (key) => key in this.userData
      )
      return check
    }
  },
  created(){

  },
  watch:{
    signUpStep:{
      handler(newVal){
        if(newVal){
          const correctedCodeEmail = this.checkEmailData.email
          this.userData.email = correctedCodeEmail
        }
      },
      immediate:true, deep:true
    },
    emailCodeReuslt:{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('vertificationId')
          if(check === true){
            this.codeInputActive = true
            setTimeout(() => {
              this.emailCodeReuslt = {}
              this.codeInputActive = false
            },60000)
          }
        }
      },
      immediate:true, deep:true
    },
    userData:{
      handler(newVal){
        const check = newVal.hasOwnProperty('repassword')
        if(check === true){
          console.log(newVal)
          const secCheck = newVal.repassword === this.userData.password ? true : false
          if(secCheck){
            Object.assign(this.userData,{
              passwordCheck:true
            })
          }else{
            delete this.userData.passwordCheck
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
