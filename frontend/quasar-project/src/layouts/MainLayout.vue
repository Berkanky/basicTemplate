<template>
  <q-layout
    view="lHr LpR fFr">

    <q-header
      :style="{
        'background':this.store.defaultMainColor
      }"
      v-if="this.$route.path !== '/login'"
      elevated class="text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          v-if="!this.leftDrawerOpen"
          dense flat color="white"
          icon="menu_open"
          @click="this.leftDrawerOpen =! this.leftDrawerOpen" />

        <q-toolbar-title>
          <q-avatar v-if="!this.leftDrawerOpen">
            <img :src="myLogo" alt="">
          </q-avatar>
        </q-toolbar-title>
        <q-btn dense flat round icon="logout" v-on:click="logoutButton"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      elevated
      :style="{
        'background':this.store.defaultMainColor
      }"
      class=""
      v-model="this.leftDrawerOpen" v-if="this.leftDrawerOpen"
      :width="300"
      :breakpoint="400"
      >
      <div class="row">
        <q-avatar class="q-pa-sm">
          <img
            style="object-fit:cover;"
            :src="myLogo" alt="">
        </q-avatar>
        <q-space></q-space>
        <q-btn
          v-on:Click="this.leftDrawerOpen = false"
          class="q-pa-md"
          icon="cancel" flat color="white"></q-btn>
      </div>
      <q-list padding>
        <q-item
          :class="this.checkCurrentRoute(data) === true ? 'bg-grey-2 text-dark' : 'text-white'"
          flat
          v-on:click="goSelectedRoute(data)"
          v-for="(data,key) in this.leftBarOptions" :key="key"
          clickable v-ripple>
          <q-item-section avatar>
            <q-icon :name="data.icon" />
          </q-item-section>
          <q-item-section>
            {{ data.label }}
          </q-item-section>
          <q-item-section avatar>
            <q-icon
              :name="this.checkCurrentRoute(data) === true ? 'arrow_right' : 'arrow_left'"
            ></q-icon>
          </q-item-section>
        </q-item>
      </q-list>
      <q-card
        class="absolute-bottom bg-transparent text-white text-center"
        flat>
        <q-item>
          <q-item-section class="text-caption">
            @Copyrights Code&Design
          </q-item-section>
        </q-item>
      </q-card>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>



<script>
import myLogo from '../images/myWhiteLogo.png'
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore } from 'src/stores/store'
export default {
  setup () {
    const store = useCounterStore()
    return {
      store,
      myLogo
    }
  },
  data:function(){
    return{
      miniState:true,
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
          message:'Anonymous Users Cannot Access Profile Pages.',
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
          message:'Are You Sure You Want to Logout ?'
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
