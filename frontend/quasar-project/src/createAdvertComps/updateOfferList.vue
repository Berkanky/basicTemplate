<template>
  <q-dialog
    v-model="this.store.offerListUpdateDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    persistent
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'max-width':this.store.mobileActive ? '100%' : '600px'
      }"
      class="bg-dark text-white">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="groups" flat color="white"></q-btn>
        </q-card-section>
        <q-separator color="grey-5"></q-separator>
        <q-card-section>
          <transition-group appear enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutRight slower">
          <q-card
            class="bg-transparent" flat
            v-for="(data,key) in this.offerList" :key="key">
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar size="xl">
                  <img
                    style="object-fit:cover;"
                    :src="data.userImage ?? data.googleImage" alt="">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ data.email ?? '' }}
                <q-item-section caption class="text-caption text-grey-5">
                  {{ data.name ?? data.displayName }}
                </q-item-section>
              </q-item-section>
              <q-item-section>
                <q-btn-dropdown color="white" flat icon="">
                  <q-list>
                    <q-item
                      v-for="(menu,key) in this.options" :key="key"
                      clickable v-close-popup @click="selectOption(menu.id,data.fireBaseId)">
                      <q-item-section>
                        <q-item-label>{{menu.label}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-section>
            </q-item>
          </q-card>
        </transition-group>
        </q-card-section>
        <q-card-section v-if="this.newOfferList.length">
          <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
          <q-card
            flat
            class="q-mt-xs bg-dark text-white"
            v-on:click="selectUser(data)"
            v-for="(data,key) in this.newOfferList" :key="key">
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar size="xl">
                  <img
                    style="object-fit:cover;"
                    :src="data.userImage ?? data.googleImage" alt="">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ data.email ?? data.name ?? data.displayName }}
                <q-item-section caption class="text-grey-6 text-weight-bold">
                  {{
                    data.active === true ? 'Online' : 'Offline'
                  }}
                </q-item-section>
              </q-item-section>
              <q-item-section>
                <q-btn icon="info" flat color="grey-8"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </transition-group>
        </q-card-section>
        <q-card-section>
          <q-input
            v-on:keyup="this.searchUserFunc()"
            v-model="this.searchUser"
            type="text" dark color="grey-5" label="Search User"
          >
            <template v-slot:prepend>
              <q-icon name="search"></q-icon>
            </template>
            <template v-slot:append v-if="this.searchUser">
              <q-btn icon="remove" flat color="red-4" v-on:click="this.searchUser = ''"></q-btn>
            </template>
          </q-input>
          <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
          <q-card
            flat
            class="q-mt-sm bg-dark text-white"
            v-on:click="selectUser(data)"
            v-for="(data,key) in this.findedUsers" :key="key">
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar size="xl">
                  <img
                    style="object-fit:cover;"
                    :src="data.userImage ?? data.googleImage" alt="">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ data.email ?? data.name ?? data.displayName }}
                <q-item-section caption class="text-grey-6 text-weight-bold">
                  {{
                    this.checkAlreadyAdded(data) ? 'Already Added' : ''
                  }}
                </q-item-section>
              </q-item-section>
              <q-item-section>
                <q-btn icon="info" flat color="grey-8"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </transition-group>
        </q-card-section>
        <q-card-section v-if="this.newOfferList.length">
          <q-btn
            v-on:click="sendNotifyToOfferList"
            class="full-width"
            icon="send" outline color="green-3" no-caps label="Send Request"></q-btn>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      searchUser:'',
      advertDetail:{},
      offerList:[],
      options:[
        {id:1,label:'Delete User',icon:'delete_forever'},
        {id:2,label:'Send Request Again',icon:'send'},
        {id:3,label:'Request Cancel',icon:'restart_alt'}
      ],
      findedUsers:[],
      newOfferList:[]
    }
  },
  methods:{
    sendNotifyToOfferList(){
      this.$q.dialog(
        {
          dark:true,
          cancel:true,
          title:'Warning',
          message:'Are You for Send Request to Selected Users ?',
          color:'red-4',
          fullHeight:this.store.mobileActive ? true : false,
          maximized:this.store.mobileActive ? true : false
        }
      ).onOk(() => {
        ///:selectedAdvertId/:currentUserId/sendNotifyToOfferList
        const allBody = {
            offerList:this.newOfferList
          }
        axios.put(`${this.store.baseUrl}/app/${this.advertDetail._id}/${this.store.firebaseData.uid}/sendNotifyToOfferList`, allBody)
          .then(res => {
            console.log(res)
            this.newOfferList = []
            const id = this.advertDetail._id
            this.getOffersList(id)
            })
          .catch(err => {
            console.log(err)
          })
      })
    },
    checkAlreadyAdded(data){
      const check = this.newOfferList.some(
        object => object._id === data._id
      )
      return check
    },
    selectUser(data){
      console.log(data)
      const check = this.newOfferList.some(
        object => object._id === data._id
      )
      if(!check){
        this.newOfferList.push(data)
      }else{
        this.newOfferList = this.newOfferList.filter(
          object => object._id !== data._id
        )
      }
    },
    searchUserFunc(){
      if(this.searchUser){
        const allBody = {
          searchUser:this.searchUser
        }

        axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/findUsers`, allBody)
          .then(res => {
            console.log(res)
            this.findedUsers = res.data.findedUser
          })
          .catch(err => {
            console.log(err)
          })
      }else{
        this.findedUsers = []
      }
    },
    removeUser(id){
      ///:selectedAdvertId/:selectedUserFirebaseId/removeFromOfferList
      axios.put(`${this.store.baseUrl}/app/${this.advertDetail._id}/${id}/removeFromOfferList`)
        .then(res => {
          console.log(res)
          this.offerList = this.offerList.filter(
            object => object.fireBaseId !== id
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    requestBackFunction(fid){
      ///:selectedAdvertId/:selectedUserFirebaseId/offerRequestBack
      axios.put(`${this.store.baseUrl}/app/${this.advertDetail._id}/${fid}/offerRequestBack`)
        .then(res => {
          console.log(res)
          this.offerList = this.offerList.filter(
            object => object.fireBaseId !== fid
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectOption(menuId,fid){
      if(menuId === 1){
        const id = fid
        //console.log(id)
        this.removeUser(id)
      }else if(menuId === 2){

      }else if(menuId === 3){
        this.requestBackFunction(fid)
      }
    },
    getOffersList(id){
      ///:selectedAdvertId/findUsersWithId
      const allBody =  {
        offerList:this.advertDetail.offerList
      }
      axios.put(`${this.store.baseUrl}/app/${id}/findUsersWithId`, allBody)
        .then(res => {
          console.log(res)
          this.offerList = res.data.offerList
        })
        .catch(err => {
          console.log(err)
        })
    },
    goBack(){
      this.store.offerListUpdateDialogActive = false
    }
  },
  created(){
  },
  watch:{
    searchUser:{
      handler(newVal){
        if(!this.searchUser){
          this.findedUsers = []
        }
      },
      immediate:true, deep:true
    },
    'store.selectedAdvertDetailDB':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check === true){
            this.advertDetail = newVal
            const id = newVal._id
            this.getOffersList(id)
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
