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

    }
  },
  methods:{
  },
  beforeRouteEnter(to, from,next) {
    next(vm => {
      const check = to.params.hasOwnProperty('id')
      if(check){
        const id = to.params.id
        vm.store.getAdvertDetail(id)
      }
    })
  },
  created(){
  },
  watch:{
    $route:{
      handler(to,from){
        console.log(to)

      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
