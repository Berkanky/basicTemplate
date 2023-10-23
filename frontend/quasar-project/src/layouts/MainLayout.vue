<template>
  <q-layout
    view="lHr LpR fFr">

    <q-header
      v-if="this.$route.path !== '/login'"
      elevated class="bg-grey-8 text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="this.leftDrawerOpen =! this.leftDrawerOpen" />

        <q-toolbar-title>
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"> -->
          </q-avatar>

        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="this.rightDrawerOpen =! this.rightDrawerOpen" />
        <!-- <q-btn dense flat round icon="logout" v-on:click="logoutButton"></q-btn> -->
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="this.leftDrawerOpen" v-if="this.leftDrawerOpen"
        :width="300"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
              v-on:click="goSelectedRoute(data)"
              :class="newClassForSelectedOption(data)"
              v-for="(data,key) in this.leftBarOptions" :key="key"
              clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="data.icon" />
              </q-item-section>

              <q-item-section>
                {{ data.label }}
              </q-item-section>
            </q-item>
            <q-item
              class="absolute-bottom bg-grey-8 text-white"
              v-on:click="this.logoutButton()"
              clickable v-ripple
            >
              <q-item-section avatar>
                <q-icon name="logout"></q-icon>
              </q-item-section>
              <q-item-section>
                Logout
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img
                style="object-fit:cover;"
                :src="this.store.defaultPhoto">
            </q-avatar>
            <div class="text-weight-bold" v-if="!this.store.checkForAnonOrNot()">
              {{ this.store.firebaseData.displayName ?? '' }}
            </div>
            <div v-if="!this.store.checkForAnonOrNot()">@{{ this.store.firebaseData.email ?? '' }}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-drawer v-if="this.rightDrawerOpen" v-model="this.rightDrawerOpen" side="right" elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      v-if="this.$route.path !== '/login'"
      bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
<!--           <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div> -->
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore } from 'src/stores/store'
export default {
  setup () {
    const store = useCounterStore()
    return {
      store
    }
  },
  data:function(){
    return{
      leftDrawerOpen:false,
      rightDrawerOpen:false,
      leftBarOptions:[
        {id:1,label:'Home',name:'home',icon:'home',path:'/'},
        {id:2,label:'Profile',name:'profile',icon:'person',path:'/profile/:id'},
        /* {id:3,label:'Logout',name:'login',icon:'login',path:'/login'} */
      ]
    }
  },
  methods:{
    checkForImage(newVal){
      const check = newVal.hasOwnProperty('photoURL')
      if(check === true){
        const image = newVal.photoURL
        this.store.defaultPhoto = image
      }
    },
    newClassForSelectedOption(data){
      const check = this.$route.name === data.name ? true : false
      if(check){
        return 'bg-grey-8 text-white'
      }else{
        return 'text-grey-8'
      }
    },
    goSelectedRoute(data){
      if(!this.store.checkForAnonOrNot() && data.id !== 2 && data.id !== 3){
        console.log('data.id not 3 ')
        this.$router.push(
          {
            name:data.name
          }
        )
      }else if(data.id === 2 && !this.store.checkForAnonOrNot() && data.id !== 3){
        console.log('data.id 2 ')
        this.$router.push(
          {
            path:`/profile/${this.store.firebaseData.uid}`,
            params:{
              id:this.store.firebaseData.uid
            }
          }
        )
      }else if(data.id === 3){
        //this.store.logoutButtonGlobal()
      }else if(this.store.checkForAnonOrNot()){
        this.$q.notify({
          type:'negative',
          icon:'info',
          message:'Anon Users Cant Reach Profile Page ! ',
          position:'bottom'
        })
      }
    },
    checkCurrentRoute(data){
      const currentRoute = this.$route.name === data.name ? true : false
      return currentRoute
    },
    logoutButton(){
      this.$q.dialog(
        {
          cancel:true,
          title:'Warning',
          color:'red-4',
          message:'Sure for logout ?'
        }
      ).onOk(() => {
        this.store.logoutButtonGlobal()
      }).onCancel(() => {
        //
      })
    },
    checkCurrentRouterAndCloseAllDraws(){
      const currentRouter = this.$route.path
      const check = currentRouter === '/login' ? true : false
      if(check === true){
        this.leftDrawerOpen = false
        this.rightDrawerOpen = false
      }
    }
  },
  created(){
    this.$watch('store.firebaseData',(newVal) => {
      if(newVal){
        this.checkForImage(newVal)
      }
    },{
      immediate:true, deep:true
    })
  },
  watch:{
    $route:{
      handler(to,from){
        const check = to.path === '/login' ? true : false
        if(check === true){
          this.checkCurrentRouterAndCloseAllDraws()
        }else{
          this.leftDrawerOpen = true
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>
