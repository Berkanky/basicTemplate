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
          {id:3,label:'My CV Settings',icon:'folder'},
          {id:4,label:'Gallery',icon:'collections_bookmark'},
          {id:5,label:'Location Details',icon:'location_on'},
          {id:6,label:'Create New Work Location Advertise',icon:'work'}
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
        /*           const id = this.store.firebaseData.uid
          this.$router.push(
            {
              path:`/createWorkAdvert/${id}`,
              params:{id:id}
            }
          ) */
      }
    },
    watch:{
      'store.selectedOption':{
        handler(newVal){
          if(newVal){
            const check = newVal.hasOwnProperty('id')
            if(!check){
              Object.assign(this.store.selectedOption,{
                id:1
              })
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
