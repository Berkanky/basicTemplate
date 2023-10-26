<style>
::-webkit-scrollbar {
  display: none;
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
/* background: linear-gradient(to bottom, #ece9e6, #ffffff); */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
.myloginpage{
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}
.myCard{
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: linear-gradient(to left, #ece9e6, #ffffff)
}
</style>


<template>
  <q-page
    :style="{
      'background':this.store.defaultMainColor
    }"
    class="myloginpage">
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '80%',
        'height':this.store.mobileActive ? this.$q.screen.height + 'px' : ''
      }"

      :class="this.store.mobileActive ? 'bg-white' : 'myCard'"
      >
      <q-card-section horizontal>
        <q-img
          v-if="!this.store.mobileActive"
          loading="lazy"
          spinner-color="white"
          class="col-5"
          :style="{
          }"
          style="border-radius-left:15px;" :src="loginPageImage">
          <div class="absolute-bottom text-white text-center text-grey-5">
            @Code&Design
            <div class="q-pa-sm">
              <q-btn
                v-if="this.selectedLoginPageOption.id === 1"
                icon-right="arrow_right"
                v-on:click="this.selectedLoginPageOption.id = 2"
                icon="person_add" flat color="grey-4" no-caps label="or Sign Up"></q-btn>
                <q-btn
                  v-if="this.selectedLoginPageOption.id === 2"
                  v-on:Click="this.selectedLoginPageOption.id = 1"
                  color="grey-4"
                  icon="arrow_left" no-caps flat label="Already Signed Up ?"></q-btn>
            </div>
          </div>
        </q-img>
        <q-card-section
          :style="{
          }"
          class="col-12 col-md col-sm text-center">
          <q-card-section class="">
            <signin
              @emituserdataemail="getemituserdataemail"
              @onlyWithEmailActive="getonlyWithEmailActive"
              v-if="this.selectedLoginPageOption.id === 1"/>
            <signup
              @cancelProcess="getcancelProcess"
              v-if="this.selectedLoginPageOption.id === 2"/>
            <onlyWithEmail
              @goBackFromOnlywithemail="getgoBackFromOnlywithemail"
              v-if="this.selectedLoginPageOption.id === 3"
              :propUserData="this.propUserData"
            />
          </q-card-section>
        </q-card-section>
      </q-card-section>

    </q-card>
    <phoneValidVue v-if="this.store.phoneValidDialogActive"/>
  </q-page>
</template>

<script>
import phoneValidVue from 'src/loginPageComponents/phoneValid.vue';
import onlyWithEmail from 'src/loginPageComponents/onlyWithEmail.vue';
import loginPageImage from '../loginPageComponents/loginPageImage.jpg'
import signup from '../loginPageComponents/signup.vue'
import signin from '../loginPageComponents/signin.vue'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    signin,
    signup,
    onlyWithEmail,
    phoneValidVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store,
      loginPageImage
    }
  },
  data:function(){
    return{
      loginPageOptions:[
        {id:1,label:'Login',icon:'login',color:'grey-8'},
        {id:2,label:'Register',icon:'person_add',color:'grey-8'}
      ],
      randomImageList:[],
      randomImageUrl:'',
      selectedLoginPageOption:{
        id:1
      },


      //props email from signin to onlyemail
      propUserData:{}
    }
  },
  beforeRouteLeave (to, from) {
    const check = to.path === '/' ? true : false
    if(check === true){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(check === true){
        const newfirebasedata = this.store.firebaseData
        console.log('newfirebasedata',newfirebasedata)
        this.store.getMyDetail(newfirebasedata)
        //this.store.welcomeMessageToMyNotifies()
      }
    }
  },
  methods:{
    getgoBackFromOnlywithemail(data){
      if(data){
        this.selectedLoginPageOption.id = 1
      }
    },
    getemituserdataemail(data){
      if(data){
        this.propUserData.email = data
      }
    },
    getonlyWithEmailActive(data){
      if(data){
        const check = data === true ? true : false
        if(check === true){
          this.selectedLoginPageOption.id = 3
          console.log(this.selectedLoginPageOption)
        }
      }
    },
    getcancelProcess(data){
      if(data){
        const check = data === true ?  true : false
        if(check){
          this.selectedLoginPageOption.id = 1
        }
      }
    },
    goSelectedOption(data){
      this.selectedLoginPageOption = data
    },
    checkCurrentSelectedLoginPageOption(data){
      const check = this.selectedLoginPageOption.hasOwnProperty('id')
      if(check){
        const secCheck = this.selectedLoginPageOption.id === data.id ? true : false
        return secCheck
      }else{
        return false
      }
    },
  },

  created(){
  },
  watch:{

  }
}
</script>

