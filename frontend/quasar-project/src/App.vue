<template>
 <div class="myApp">
  <router-view />
  <myNotifies v-if="this.store.myNotifyDialogActive"/>
 </div>
</template>

<style>
  .myApp{
    font-family: 'Montserrat', sans-serif;
    font-family: 'Roboto Mono', monospace;
  }

</style>

<script>
import myNotifies from './components/myNotifies.vue';
import { useCounterStore } from './stores/store';
import { defineComponent } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {auth} from './firebase/index'
export default defineComponent({
  components:{
    myNotifies
  },
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
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods:{
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
    },
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
        } else {
          console.log('user not exist')
          this.replaceToLoginPage()
        }
      });
    }
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  watch:{
    $route:{
      handler(to,from){
        console.log(to,from)
        this.checkCurrentState()
      },
      immediate:true, deep:true
    },
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
})
</script>
