<template>
  <q-page>
    <div>
      <q-input label="enter bla bla" v-model="this.testData.name" v-on:keyup.enter="sendData"></q-input>
      <div>
        {{ this.testData.name ?? '' }}
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
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
      testData:{}
    }
  },
  methods:{
    sendData(){
      console.log(this.testData)
      const allBody = {
        testData:this.testData
      }
      axios.post(`${this.store.baseUrl}/app/sendTest`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err =>{
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
