<template>
  <q-dialog
    v-model="this.store.phoneValidDialogActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
  <q-card
    class="bg-dark text-white"
    style="border-radius:15px;"
    :style="{
      'width':this.store.mobileActive ? '100%' : '700px',
      'max-width':this.store.mobileActive ? '100%' : '700px'
    }"
  >
    <q-card-section
     class="text-left"
    >
      <q-btn icon="keyboard_backspace" flat v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-separator size="1px"  color="grey-5"></q-separator>
    <q-card-section>
      <q-card-section horizontal>
        <q-select
          v-model="this.dialCode"
          dark color="white" class="col"
          label="Dial Code"
          filled
          :options="this.filteredDialCodes.length ? this.filteredDialCodes : this.allDialCodes"
          use-input
          @filter="filterDialCodes"
        ></q-select>
        <q-input
          class="col-8 q-ml-xs"
          filled
          dark color="white"
          v-model="this.phNo"
          label="Phone"
          mask="(###) ### - ####"
          fill-mask
          :hint="this.phNo"
        >
          <template v-slot:after>
            <q-btn
              id="sign-in-button"
              icon="send" color="white" flat round v-on:click="sendOtp"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section horizontal>
        <q-input
          type="number"
          dark color="white"
          class="col"
          v-model="this.otp"
          label="OTP"
        >
          <template v-slot:after>
            <q-btn
              v-on:click="this.verifyOtp()"
              flat color="white"
              :disable="this.otp ? false: true"
              icon="cached"></q-btn>
          </template>
        </q-input>
      </q-card-section>
        <div id="recaptcha-container"></div><br>
      <q-card-section>
        <q-btn
          :disable="this.phNo !== '' && this.dialCode !== '' ? false : true"
          rounded
          v-on:click="this.reSendOtpFunc()"
          icon="restart_alt" class="full-width" no-caps label="Re-Send OTP" color="red-4"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber  } from "firebase/auth";
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return {
      phNo: '',
      appVerifier : '',
      otp : '',
      allDialCodes:[],
      filteredDialCodes:[],
      dialCode:'',
    }
  },
  methods:{
    reSendOtpFunc(){
      this.$q.dialog(
        {
          cancel:true,
          color:'red-4',
          title:'Warning',
          message:'Are you sure for reSend UID Code ?'
        }
      ).onOk(() => {
        this.sendOtp()
      }).onCancel(() => {
        //
      })
    },
    filterDialCodes(val,update){
      update(() => {
        if(val){
          let allList = this.allDialCodes
          const result = allList.filter(
            object => (object.toLowerCase()).includes(val.toLowerCase())
          )
          if(result){
            console.log(result)
            this.filteredDialCodes = result
          }
        }else{
          this.filteredDialCodes = []
          this.getAllDialCodes()
        }
      })
    },
    getAllDialCodes(){
      //getDialCodes
      axios.put(`${this.store.baseUrl}/app/getDialCodes`)
        .then(res => {
          console.log(res)
          this.allDialCodes = res.data.onlyDialCodes
        })
        .catch(err => {
          console.logo(err)
        })
    },
    goBack(){
      this.store.phoneValidDialogActive =! this.store.phoneValidDialogActive
    },
    sendOtp(){
        if(!this.phNo.length){
          alert('Invalid Phone Number Format !');
        }else{
          //
          let countryCode = this.dialCode
          let phoneNumber = countryCode + this.phNo
          //
          let appVerifier = this.appVerifier
          const auth = getAuth();
          signInWithPhoneNumber(auth, phoneNumber, appVerifier)
              .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                // ...
              }).catch((error) => {
                window.recaptchaVerifier.render().then(function(widgetId) {
                  grecaptcha.reset(widgetId);
                });
              });
          }
      },
      //
      verifyOtp(){
        if(!this.phNo.length || !this.otp.length){
          alert('Invalid Phone Number/OTP Format !');
        }else{
          //
          let vm = this
          let code = this.otp
          //
          window.confirmationResult.confirm(code).then(function (result) {
            // User signed in successfully.
            var user = result.user;
            // ...
            //route to set password !
            console.log('verifyOtp',user)
            vm.$router.push(
              {
                path:'/'
              }
            )
          }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
            console.log(error)
          });
        }
      },
      initReCaptcha(){
        setTimeout(()=>{
          const auth = getAuth();
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              onSignInSubmit();
            }
          });
          this.appVerifier =  window.recaptchaVerifier
        },1000)
      }
  },
  created(){
    this.initReCaptcha()
    this.getAllDialCodes()
  },
  watch:{

  }
}
</script>

<style>

</style>
