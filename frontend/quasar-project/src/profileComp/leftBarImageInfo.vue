<template>
  <q-card
    flat
    class="bg-transparent text-white">
    <q-item>
      <q-item-section avatar>
        <q-avatar size="xl">
          <img
            style="object-fit:cover;"
            :src="this.store.firebaseData.photoURL"
          >
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ this.store.firebaseData.email ?? '' }}
          </q-item-label>
          <q-item-label caption class="text-grey-6 text-weight-bold">Your Personal Account</q-item-label>
        </q-item-section>
    </q-item>
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
  methods:{
    getName(){


    }
  }
}
</script>

<style>

</style>
