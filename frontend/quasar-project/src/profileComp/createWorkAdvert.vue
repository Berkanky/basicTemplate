<template>
  <q-card class="bg-transparent text-white" flat>
    <q-card-section class="text-right">
      <q-btn
        v-on:click="this.store.selectedOption.id = this.store.selectedOption.id - 1"
        rounded
        icon-right="arrow_left"
        icon="location_on" no-caps label="Go Location Settings" color="grey-10"></q-btn>
    </q-card-section>
    <q-card-section class="text-subtitle2">
      Create Advert
    </q-card-section>
    <q-card-section>
      <q-card class="bg-transparent text-white" bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="70px">
              <img
                style="object-fit:cover;"
                :src="this.store.myData.userImage ?? this.store.firebaseData.photoURL ??  this.store.defaultPhoto" alt="">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-btn
              v-on:click="this.store.createActivityDialogActive = true"
              class="q-pa-sm"
              color="grey-9"
              icon="filter_list"
              no-caps label="Create Post"
              rounded></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-btn icon="list" flat label="My Adverts" no-caps></q-btn>
    </q-card-section>
    <q-card-section>
      <q-card
        v-for="(data,key) in this.store.myAdverts" :key="key"
        class="bg-transparent text-white" flat bordered>
        <q-item clickable>
          <q-item-section avatar>
            <q-avatar size="70px">
              <img :src="data.activityImage" alt="" style="object-fit:cover;">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ data.activityName ?? '' }}
            <q-item-section caption class="text-weight-bold text-grey-6">
              {{ data.description ?? '' }}
            </q-item-section>
          </q-item-section>
          <q-item-section>
            <q-btn icon="delete_forever" flat color="red-4" v-on:click="deleteMyAdvert(data._id)"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <createActivityVue v-if="this.store.createActivityDialogActive"/>
  </q-card>
</template>

<script>
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
import createActivityVue from 'src/createAdvertComps/createActivity.vue';
export default {
  components:{
    createActivityVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      options:[

      ]
    }
  },
  methods:{
    deleteMyAdvert(id){
        ///:firebaseId/:selectedAdvertId/removeSelectedAdvert
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/${id}/removeSelectedAdvert`)
        .then(res => {
          console.log(res)
          this.store.myAdverts = this.store.myAdverts.filter(
            object => object._id !== id
          )
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    this.$watch('store.firebaseData',(newVal) => {
      const check = newVal.hasOwnProperty('uid')
      if(check === true){
        this.store.getMyDetailFromDb()
        const firebaseId = newVal.uid
        this.store.getMyAdverts(firebaseId)
      }
    },
    {
      immediate:true, deep:true
    })
  },
  watch:{
    $route:{
      handler(to,from){
        //this.store.getMyDetailFromDb()
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
