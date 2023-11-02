<template>
  <q-page
    :style="{
      'background':this.profilePageColor
    }"
  >
    <div class="row">
      <div class="col-12 col-md-4 col-sm-4 q-mt-lg">
        <div class="row">
          <div class="col-4" v-if="!this.store.mobileActive"></div>
          <div class="col-8">
            <leftBarImageInfo />
            <leftBarOption />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8 col-sm-8">
        <publicProfile v-if="this.store.selectedOption.id === 1"/>
        <account v-if="this.store.selectedOption.id === 2"/>
        <myFiles v-if="this.store.selectedOption.id === 3"/>
        <myGallery v-if="this.store.selectedOption.id === 4"/>
        <locationSettings v-if="this.store.selectedOption.id === 5"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import locationSettings from 'src/profileComp/locationSettings.vue';
import myFiles from 'src/profileComp/myFiles.vue';
import myGallery from 'src/profileComp/myGallery.vue';
import account from 'src/profileComp/account.vue';
import publicProfile from 'src/profileComp/publicProfile.vue';
import leftBarOption from 'src/profileComp/leftBarOption.vue';
import leftBarImageInfo from 'src/profileComp/leftBarImageInfo.vue';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    leftBarImageInfo,
    leftBarOption,
    publicProfile,
    account,
    myGallery,
    myFiles,
    locationSettings
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      profilePageColor:'#0D1117'
    }
  },
  methods:{
    getCurrentUserDetail(){
      ///:firebaseId/getCurrentUser
      const url = this.store.baseUrl
      const fid = this.$route.params.id

      axios.get(`${url}/app/${fid}/getCurrentUser`)
        .then( res => {
          console.log(res)
          this.store.myData = res.data.currentuser
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkForEmptySlotsStoreNewData(newVal){
      const obj = newVal
      for (const key in obj) {
        if (obj[key] === null || obj[key] === '') {
          delete obj[key]
        }
      }
    },
  },
  created(){

  },
  mounted(){
  },
  watch:{
    'store.selectedOption':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('id')
          if(check === true){
            this.getCurrentUserDetail()
          }
        }
      },
      immediate:true, deep:true
    },
    'store.newData':{
      handler(newVal){
        if(newVal){
          console.log(newVal)
          this.checkForEmptySlotsStoreNewData(newVal)
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          this.getCurrentUserDetail()
        }
      },
      immediate:true, deep:true
    },
    $route:{
      handler(to,from){
        //
      },
      immediate:true, deep:true
    },
  }
}
</script>

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
</style>
