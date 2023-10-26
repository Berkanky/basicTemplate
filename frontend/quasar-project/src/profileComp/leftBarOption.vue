<template>
    <q-list class="q-mt-md">
      <q-item
        style="border-radius:7px;"
        v-for="(data,key) in this.options" :key="key"
        clickable
        v-ripple
        v-on:click="selectOption(data)"
        class="text-grey-4"
        :class="this.checkSelectedOption(data) === true ? 'bg-grey-10' : ''"
      >
        <q-item-section avatar>
          <q-icon :name="data.icon" />
        </q-item-section>
        <q-item-section>{{data.label}}</q-item-section>
        <q-item-section avatar>
          <q-icon
            :name="this.checkSelectedOption(data) === true ? 'arrow_right' : 'arrow_left'"
            :color="this.checkSelectedOption(data) === true ? 'blue-4' : 'white'"></q-icon>
        </q-item-section>
      </q-item>
    </q-list>
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
        options:[
          {id:1,label:'Public Profile',icon:'person'},
          {id:2,label:'Account',icon:'settings'},
          {id:3,label:'Notifications',icon:'notifications'}
        ]
      }
    },
    methods:{
      checkSelectedOption(data){
        const check = this.store.selectedOption.hasOwnProperty('id')
        if(check){
          const secCheck = this.store.selectedOption.id === data.id ? true : false
          return secCheck
        }else{
          return false
        }
      },
      selectOption(data){
        Object.assign(this.store.selectedOption,{
          id:data.id
        })
      }
    }
  }
</script>

<style>

</style>
