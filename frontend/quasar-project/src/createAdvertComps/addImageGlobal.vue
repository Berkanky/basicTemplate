<template>
  <q-dialog
    v-model="this.store.addImageActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card
      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'max-width':this.store.mobileActive ? '100%' : '600px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn
          v-on:click="clearAllImages"
          dense color="white" flat round icon="delete_forever" class="q-ml-md">
          <q-badge color="red" floating>
            {{ this.store.newAddedImages.length }}
          </q-badge>
        </q-btn>
      </q-card-section>
      <q-separator color="grey-7"></q-separator>
      <q-card-section class="row">
        <q-card
          class="bg-dark col-4"
          style="height:150px;">
          <q-btn
            v-on:click="uploadImage"
            icon="add" color="dark" text-color="green-4"
            class="full-width full-height"></q-btn>
        </q-card>
        <q-card
          class="col-4"
          v-for="(data,key) in this.store.newAddedImages" :key="key"
          style="height:150px;">
          <q-img :src="data.url ?? data.imageUrl" style="object-fit:cover;height:100%;">
            <div class="absolute-center full-width text-center">
              <q-btn icon="fa-solid fa-remove" color="white" flat v-on:click="removeImage(data)" size="sm"></q-btn>
            </div>
          </q-img>
        </q-card>
      </q-card-section>
    </q-card>
    <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
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
      image:'',
    }
  },
  methods:{
    clearAllImages(){
      this.store.newAddedImages = []
    },
    removeImage(data){
      this.store.newAddedImages = this.store.newAddedImages.filter(
        object => object.imageId !== data.imageId
      )
    },
    goBack(){
      this.store.addImageActive =! this.store.addImageActive
    },
    uploadImage(){
      this.$refs.fileInput.$el.click()
    },
    selectNewFile(val){
      if(val){
        const newObject = {
          imageId:uuidv4(),
          _key: val._key ?? '',
          lastModified: val.lastModified ?? '',
          lastModifiedDate: val.lastModifiedDate ?? '',
          name: val.name ?? '',
          size: val.size ?? '',
          type: val.type ?? '',
          webKitRelativePath: val.webKitRelativePath ?? '',
        };
        const reader = new FileReader();
        reader.onloadend = () => {
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
              Object.assign(newObject,{
                url : reader.result
              })
              console.log(newObject)
              const check = newObject.type === 'image/jpeg' || newObject.type === 'image/png' ? true : false
              if(check){
                this.store.newAddedImages.push(newObject)
                console.log(this.store.newAddedImages)
              }
        };
        reader.readAsDataURL(val);
      }
    },
  },
  created(){

  }
}
</script>

<style>

</style>
