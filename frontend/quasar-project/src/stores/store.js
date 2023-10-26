import { defineStore } from 'pinia';
import axios from 'axios';
import { getAuth, signOut } from "firebase/auth";
export const useCounterStore = defineStore('counter', {
  state: () => ({
    defaultMainColor:'#24292e',
    baseUrl:'http://localhost:3000',
    firebaseData:{},
    window:{},
    myData:{},
    defaultPhoto:'https://cdn.quasar.dev/img/boy-avatar.png',
    mobileActive:false,
    pexelsApiKey:'563492ad6f917000010000018990b39d61f845559dab3acb2c9dd16d',
    openCageApiKey:'a7ac3cc8ba514f0287f82a6a306eabc8',
    phoneValidDialogActive:false,
    selectedOption:{},
    newData:{}
  }),
  getters: {
  },
  actions: {
    updateProfile(){
      ///:firebaseId/updateMyProfile
      const fid = this.firebaseData.uid
      const url = this.baseUrl
      const allBody = {
        newData:this.newData
      }
      axios.put(`${url}/app/${fid}/updateMyProfile`, allBody)
        .then(res => {
          console.log(res)
          this.getMyDetailFromDb()
          this.newData = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    welcomeMessageToMyNotifies(){
      const check = this.firebaseData.isAnonymous === true ? true : false
      if(!check){
        const fid = this.firebaseData.uid
        const url = this.baseUrl
        ///:firebaseId/notify

        axios.put(`${url}/app/${fid}/notify`)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })

      }
    },
    checkForAnonOrNot(){
      const checkForAnon = this.firebaseData.isAnonymous === true ? true : false
      return checkForAnon
    },
    updateWhenLogout(){
      ///:firebaseId/logout
      axios.put(`${this.baseUrl}/app/${this.firebaseData.uid}/logout`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    logoutButtonGlobal(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.updateWhenLogout()

        this.firebaseData = {}
        this.myData = {}
        this.newData = {}
        this.selectedOption = {}
        this.$router.replace(
          {
            path:'/login'
          }
        )
      }).catch((error) => {
        // An error happened.
      });
    },
    getMyDetailFromDb(){
      console.log('aptal pic')
      const url = this.baseUrl
      const fid = this.firebaseData.uid

      axios.get(`${url}/app/${fid}/getCurrentUser`)
        .then( res => {
          console.log(res)
          this.myData = res.data.currentuser
          console.log('myData',this.myData)
        })
        .catch(err => {
          console.log(err)
        })

    },
    getMyDetail(newfirebasedata){
      const check = this.firebaseData.isAnonymous === true ? true : false
      if(!check){
        const allBody = {
          firebaseData:newfirebasedata
        }
        console.log('allbody',allBody)
        ///:firebaseId/getMyDetail
        axios.put(`${this.baseUrl}/app/${this.firebaseData.uid}/getMyDetail`, allBody)
          .then (res => {
            console.log(res)
            this.welcomeMessageToMyNotifies()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
});
