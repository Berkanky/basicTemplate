<template>
  <q-card
    v-for="(data,key) in this.store.newAddedImages" :key="key"
    style="height:150px;" class="bg-dark col-4">
    <q-img
      :src="data.url"
      style="object-fit:cover;height:100%;"></q-img>
  </q-card>
</template>

<script>
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
  created(){

  },
  watch:{
  }
}
</script>

<style>

</style>
