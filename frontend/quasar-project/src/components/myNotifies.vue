<template>
  <q-dialog
    v-model="this.store.myNotifyDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      style=""
      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px',
        'max-width':this.store.mobileActive ? '100%' : '500px',
        'border-radius':this.store.mobileActive ? '0px' : '12px'
      }"
    >
      <q-card-section class="text-right">
        <q-btn
          size="sm"
          icon="fa-solid fa-remove" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-separator size="" color="grey-7"></q-separator>
      <q-card-section v-if="this.offerList.length">
        <q-card
          class="bg-transparent" flat
          v-for="(data,key) in this.offerList" :key="key">
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar size="xl">
                <img
                  style="object-fit:cover;"
                  :src="data.advertDetail.activityImage" alt="">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ data.advertDetail.activityName }}
              <q-item-section class="text-caption text-grey-5" caption>
                {{ data.advertDetail.description }}
              </q-item-section>
              <q-item-section caption class="text-caption text-grey-5">
                {{ data.offerDetail.message }}
              </q-item-section>
            </q-item-section>
            <q-item-section>
              <q-btn icon="delete_forever" flat color="red-4" v-on:click="removeNotify(data)"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
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
      mynotifies:{},
      offerList:[]
    }
  },
  methods:{
    removeNotify(data){
      console.log(data)
      ///:currentUserId/:selectedNotifyId/removeSelectedNotify
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/${data.offerDetail._id}/removeSelectedNotify`)
        .then(res => {
          console.log(res)
          this.offerList = this.offerList.filter(
            object => object.offerDetail._id !== data.offerDetail._id
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    getmynotifiesfunc(id){
      ///:currentUserId/getMyNotifies
      axios.get(`${this.store.baseUrl}/app/${id}/getMyNotifies`)
        .then(res => {
          console.log('getMyNotifies',res)
          this.offerList = res.data.offerList
        })
        .catch(err => {
          console.log(err)
        })
    },
    goBack(){
      this.store.myNotifyDialogActive = false
    }
  },
  created(){

  },
  watch:{
    'store.firebaseData':{
      handler(newVal){
        const check = newVal.hasOwnProperty('uid')
        if(check === true){
          const id = newVal.uid
          this.getmynotifiesfunc(id)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
