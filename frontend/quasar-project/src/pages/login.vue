<style>
::-webkit-scrollbar {
  display: none;
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
.myloginpage{
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
  background: linear-gradient(to bottom, #ece9e6, #ffffff);
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
<!--           <q-card-section
            class="text-center text-overline text-weight-bold text-grey-8">
              <q-btn
                v-if="this.selectedLoginPageOption.id === 1"
                icon-right="arrow_right"
                v-on:click="this.selectedLoginPageOption.id = 2"
                icon="person_add" flat color="grey-8" no-caps label="or Sign Up"></q-btn>
                <q-btn
                  v-if="this.selectedLoginPageOption.id === 2"
                  v-on:Click="this.selectedLoginPageOption.id = 1"
                  color="grey-8"
                  icon="arrow_left" no-caps flat label="Already Signed Up ?"></q-btn>
          </q-card-section> -->
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
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
    },
    async getCurrentLocationDetails(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()
      const locationDetail = {}

      const lat = allBody.lat
      const lng = allBody.lng
      const address = resData.results[0].formatted
      const country = resData.results[0].components.country
      const city = resData.results[0].components.province
      Object.assign(locationDetail,{
        address,country,city,lat,lng,locationUpdateDate:new Date().toLocaleString()
      })
      console.log('locationDetail',locationDetail)
      this.getRandomImages(locationDetail)
    },
    getCurrentLocationLatLng(){
      const navigator = window.navigator;
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const allBody = {
          lat:latitude,
          lng:longitude
        }
        console.log(allBody)
        const check = ['lat','lng'].every(
          (key) => key in allBody
        )
        if(check === true){
          this.getCurrentLocationDetails(allBody)
        }
      });
    },
    randomLoginImage(){
      const randomNumber = Math.floor(Math.random() * 15);
      const randomImage = this.randomImageList[randomNumber]

      const imageUrl = randomImage.src.original
      console.log(imageUrl)
      this.randomImageUrl = imageUrl
    },
    async getRandomImages(locationDetail){
      const res = await fetch(`https://api.pexels.com/v1/search?query=${locationDetail.country ?? locationDetail.city ?? 'new york'}`,{
        headers:{
          Authorization:this.store.pexelsApiKey
        }
      })

      const resData  = await res.json()
      this.randomImageList = resData.photos
      this.randomImageList.forEach(element => {
        const check = 'url' in element
        if(!check){
          this.randomImageList = this.randomImageList.filter(
            object => object.id !== element.id
          )
        }
      });
      this.randomLoginImage()
      console.log(this.randomImageList)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getCurrentLocationLatLng()
  },
  watch:{
    'store.window':{
      handler(newVal,oldVal){
        if(newVal){
          const check = ['width','height'].every((key) => key in this.store.window)
          if(check === true){
            const valCheck = Number(this.store.window.width) < Number(768) ? true : false
            if(valCheck === true){
              this.store.mobileActive = true
            }else{
              this.store.mobileActive = false
            }
          }
        }
      },
      immediate:true, deep:true
    },
  }
}
</script>

