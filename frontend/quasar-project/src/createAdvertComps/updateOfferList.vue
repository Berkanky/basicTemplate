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
        <q-card-section>
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </q-card-section>
        <q-separator color="grey-5"></q-separator>
        <q-card-section>
          <q-card
            class="bg-transparent" flat
            v-for="(data,key) in this.offerList" :key="key">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
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
                <q-btn icon="more_vert" flat color="white"></q-btn>
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
      advertDetail:{},
      offerList:[]
    }
  },
  methods:{
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
