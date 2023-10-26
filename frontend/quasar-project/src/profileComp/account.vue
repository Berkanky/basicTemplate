<template>
  <q-card
    class="bg-transparent text-white" flat
  >
    <q-card-section class="text-right">
      <q-btn icon="notifications" flat no-caps label="Go to Notifications"></q-btn>
    </q-card-section>
    <q-card-section class="text-subtitle2">
      Account
    </q-card-section>
    <q-separator size="1.5px" color="grey-10"></q-separator>
    <q-card-section>
      <q-card flat class="bg-transparent">
        <q-card-section class="text-caption">
            Changing your username can have unintended side effects.
          </q-card-section>
          <q-card-section>
            <q-btn
              v-on:click="changeUserName"
              icon="edit" color="grey-8" no-caps label="Change UserName"></q-btn>
            <q-btn
              color="green-4" class="q-ml-sm"
              icon="person"
              no-caps :label="this.getMyUserName()"></q-btn>
          </q-card-section>
          <q-card-section v-if="this.watchUserName()">
            <div class="text-caption q-pa-sm">
              <q-icon name="info"></q-icon>
              Updated UserName -
            </div>
            <q-btn
              v-on:click="delete this.store.newData.userName"
              icon="delete_forever" outline color="red-4"
              no-caps :label="this.store.newData.userName"></q-btn>
          </q-card-section>
          <q-card-section class="text-caption text-grey-5">
            <q-icon name="info"></q-icon>
            Looking to manage account security settings? You can find them in the Password and authentication page.
          </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-card-section class="text-h6 text-weight-bold text-red-4">
        Delete Account
      </q-card-section>
      <q-separator color="grey-10"></q-separator>
      <q-card-section class="text-caption text-grey-5">
        <q-icon name="info"></q-icon>
        Once you delete your account, there is no going back. Please be certain.
      </q-card-section>
      <q-card-section>
        <q-btn
          v-on:click="startDeleteAccProcess"
          icon="delete_forever" no-caps label="Delete Account" outline color="red-4"></q-btn>
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-btn color="green" no-caps label="Update" v-on:click="updateFunc"></q-btn>
    </q-card-section>
    <q-dialog
      persistent :full-height="this.store.mobileActive ? true : false"
      :maximized="this.store.mobileActive ? true : false"
      v-model="this.deleteProcessActive" >
        <q-card
          :style="{
            'width':this.store.mobileActive ? '100%' : '600px'
          }"
          class="bg-dark text-white">
          <q-card-section class="row">
            <q-btn
              v-on:click="this.deleteProcessActive = false"
              icon="keyboard_backspace" flat></q-btn>
            <q-space></q-space>
            <q-btn
              icon="restart_alt" flat
              :color="this.checkForVertificationId() === true ? 'grey-2' : 'green-4'"
              v-on:click="this.sendDeleteCode()">
              <q-tooltip>
                Send Vertification Code For Delete Account Process
              </q-tooltip>
            </q-btn>
          </q-card-section>
          <q-separator size="1.5px"></q-separator>
          <q-card-section>
            <q-input
              disable
              dark color="grey-5"
              :label="this.store.firebaseData.email ?? this.store.myData.email ?? 'Please Enter Email'"
            >
              <template v-slot:prepend>
                <q-icon name="mail"></q-icon>
              </template>
            </q-input>
            <q-input
              bottom-slots
              :disable="this.checkForVertificationId() === true ? false : true"
              class="q-mt-md"
              dark color="grey-5"
              label="Please Check Your Email, Enter UID"
              v-model="this.emailCode.uid"
            >
              <template v-slot:prepend>
                <q-icon name="password"></q-icon>
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="this.emailCode.uid"
                  v-on:click="delete this.emailCode.uid"
                  icon="remove" color="red-4" size="sm"></q-btn>
              </template>
              <template v-slot:hint>
                <div
                  :class="this.checkUidAndEmailCode() === true ? 'text-green-4' : 'text-red-4'"
                  class="">
                  {{ this.checkUidAndEmailCode() === true ? 'Vertification  Code Correct.' : 'Vertification Code Wrong, Please Try Again !' }}
                </div>
              </template>
            </q-input>

          </q-card-section>
          <q-card-section v-if="this.checkUidAndEmailCode()">
            <q-btn
              v-on:click="deleteAccFunc"
              color="red-4" no-caps label="Delete" outline class="full-width" icon="delete_forever"
            ></q-btn>
          </q-card-section>
          <q-card-section>
            <vue-countdown v-if="this.checkForVertificationId()" :time="60000" @end="onCountdownEnd" v-slot="{ totalSeconds }">
              Please Enter UID
              {{ totalSeconds }} Second Left</vue-countdown>
            <span v-else>Vertification Code Not Active</span>
          </q-card-section>
        </q-card>
      </q-dialog>
  </q-card>
</template>

<script>
import { getAuth, deleteUser } from "firebase/auth";
import VueCountdown from '@chenfengyuan/vue-countdown';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
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
      deleteProcessActive:false,
      emailCode:{}
    }
  },
  methods:{
    deletefirebaseacc(){
      const auth = getAuth();
      const user = auth.currentUser;
      deleteUser(user).then(() => {
        //
      }).catch((error) => {
        // An error ocurred
        // ...
      });
    },
    endDeleteProcessFunc(fid){
      this.deletefirebaseacc()
      ///:firebaseId/deleteAcc
      axios.put(`${this.store.baseUrl}/app/${fid}/deleteAcc`)
        .then(res => {
          console.log(res)

          this.store.myData = {}
          this.store.firebaseData = {}
          this.$router.replace(
            {
              path:'/login'
            }
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteAccFunc(){
      this.$q.dialog({
          title: 'Confirm Email Again !',
          message: 'Enter Your Email For End Process !',
          dark:true,
          color:'red-4',
          prompt: {
            model: '',
            isValid: val => val === this.store.firebaseData.email, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          fullHeight:this.store.mobileActive ? true : false,
          maximized:this.store.mobileActive ? true : false
        }).onOk(data => {
          const fid = this.store.firebaseData.uid
          this.endDeleteProcessFunc(fid)
        })
    },
    checkUidAndEmailCode(){
      const check = ['vertificationId','uid'].every(
        (key) => key in this.emailCode
      )
      if(check){
        const secCheck = this.emailCode.uid === this.emailCode.vertificationId ? true : false
        return secCheck
      }else{
        return false
      }
    },
    checkForVertificationId(){
      const check = this.emailCode.hasOwnProperty('codeActive')
      if(check){
        const secCheck = this.emailCode.codeActive === true ? true : false
        return secCheck
      }else{
        return false
      }
    },
    sendDeleteCode(){
      ///:firebaseId/getUidForDeleteAcc
      const check = this.emailCode.hasOwnProperty('codeActive')
      if(check === true){
        this.emailCode.codeActive = false
      }
      const fid = this.store.firebaseData.uid
      const url = this.store.baseUrl
      axios.put(`${url}/app/${fid}/getUidForDeleteAcc`)
        .then(res=> {
          console.log(res)



          Object.assign(this.emailCode,{
            vertificationId:res.data.newBody.vertificationId,
            codeActive:true
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    startDeleteAccProcess(){
      this.$q.dialog(
        {
          cancel:true,
          title:'! Warning',
          message:'Once you delete your account, there is no going back. Please be certain.If Continue Check Your Email For Vertification Code.',
          maximized:this.store.mobileActive ? true : false,
          fullHeight:this.store.mobileActive ? true : false,
          dark:true,
          color:'red-4'
        }
      ).onOk(() => {
        this.sendDeleteCode()
        this.deleteProcessActive =! this.deleteProcessActive
      })
    },
    getMyUserName(){
      const check = this.store.myData.hasOwnProperty('userName')
      if(check === true){
        const secCheck = this.store.myData.userName !== '' && this.store.myData.userName !== null ? this.store.myData.userName : 'Edit UserName'
        return secCheck
      }else{
        return 'Edit UserName'
      }
    },
    watchUserName(){
      const check = this.store.newData.hasOwnProperty('userName')
      if(check === true){
        const secCheck = this.store.newData.userName !== '' && this.store.newData.userName !== null ? true : false
        return secCheck
      }else{
        return false
      }
    },
    updateFunc(){
      this.store.updateProfile()
    },
    changeUserName(){
      this.$q.dialog({
        title: 'Change Username',
        message: 'What is Your UserName ?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        color:'red-4',
        persistent: true,
        fullHeight:this.store.mobileActive ? true : false,
        maximized:this.store.mobileActive ? true : false
      }).onOk(data => {
        Object.assign(this.store.newData,{
          userName:data
        })
        console.log(this.store.newData)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  created(){

  },
  watch:{
    emailCode:{
      handler(newVal){
        if(newVal){

          const obj = newVal
          for(const key in obj){
            if(obj[key] === '' && obj[key] === null){
              delete obj[key]
            }
          }

          const check = newVal.hasOwnProperty('codeActive')
          if(check === true){
            const secCheck = newVal.codeActive === true ? true : false
            if(!secCheck){
              this.emailCode = {}
            }else{
              setTimeout(() => {
                this.emailCode.codeActive = false
              },60000)
            }
          }
        }
      },
      immediate:true, deep:true
    },
    deleteProcessActive:{
      handler(newVal){
        if(newVal){
          const check = newVal === true ? true : false
          if(!check){
            this.emailCode = {}
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
