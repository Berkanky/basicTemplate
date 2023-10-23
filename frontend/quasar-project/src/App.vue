<template>
 <div class="myApp">
  <router-view />
 </div>
</template>

<style>
  .myApp{
    font-family: 'Montserrat', sans-serif;
    font-family: 'Roboto Mono', monospace;
  }

</style>

<script>
import { useCounterStore } from './stores/store';
import { defineComponent } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {auth} from './firebase/index'
export default defineComponent({
  name: 'App',
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    welcomeMessage(){
      const check = this.store.checkForAnonOrNot()
      if(!check){
        this.$q.notify(
          {
            type:'positive',
            avatar:this.store.firebaseData.photoURL ?? this.store.myData.userImage ?? this.store.defaultPhoto,
            position:'top',
            message:`${this.store.firebaseData.email ?? this.store.firebaseData.phoneNumber ?? this.store.firebaseData.displayName ?? '!'} Welcome`
          }
        )
      }
    },
    replaceToLoginPage(){
      this.$router.replace(
        {
          path:'/login'
        }
      )
    },
    checkCurrentState(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          // ...
          this.store.firebaseData = user
          console.log('user exist',user)
          console.log('firebaseID',this.store.firebaseData.uid)
          const firebaseData = {
            email:user.email ?? '',
            fireBaseId:user.uid ?? '',
            displayName:user.displayName ?? '',
            googleImage:user.photoURL ?? '',
            phoneNumber:user.phoneNumber ?? '',
            isAnonymous:user.isAnonymous
          }

          const check = 'uid' in this.store.firebaseData
          if(check === true){
            const newfirebasedata  = firebaseData
            this.store.getMyDetail(newfirebasedata)
            this.store.getMyDetailFromDb()
            this.store.welcomeMessageToMyNotifies()
          }
        } else {
          // User is signed out
          // ...
          console.log('user not exist')
          this.replaceToLoginPage()
        }
      });
    }
  },
  created(){
  },
  watch:{
    $route:{
      handler(to,from){
        console.log(to,from)
        this.checkCurrentState()
      },
      immediate:true, deep:true
    }
  }
})
</script>
