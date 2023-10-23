<template>
  <q-page></q-page>
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
      myData:{}
    }
  },
  methods:{
    getCurrentUserDetail(){
      ///:firebaseId/getCurrentUser
      const url = this.store.baseUrl
      const fid = this.$route.params.id ??  this.store.firebaseData.uid

      axios.get(`${url}/app/${fid}/getCurrentUser`)
        .then( res => {
          console.log(res)
          this.myData = res.data.currentuser
          console.log('currentuser',this.myData)
        })
        .catch(err => {
          console.log(err)
        })

    }
  },
  created(){
    const check = this.store.firebaseData.hasOwnProperty('uid')
    if(check === true){
      //
    }

    this.$watch('store.firebaseData',(newVal) => {
      if(newVal){
        const check = newVal.hasOwnProperty('uid')
        if(check ){
          this.getCurrentUserDetail()
        }
      }
    },
    {
      immediate:true, deep:true
    })
  },
  watch:{

  }
}
</script>

<style>


</style>
