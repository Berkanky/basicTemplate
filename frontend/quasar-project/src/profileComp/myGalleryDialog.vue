<template>
  <q-dialog
    v-model="this.store.myGalleryDialogActive"
    :full-height="this.store.mobileActive === true ? true : false"
    :maximized="this.store.mobileActive ? true  :  false"
    persistent
  >
  <q-card
    class="bg-dark text-white"
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'max-width':this.store.mobileActive ? '100%' : '600px'
    }"
  >
    <q-card-section class="row">
      <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      <q-space></q-space>
      <q-btn
        v-if="this.checknewSelectedImage()"
        icon="clear_all" outline color="red-4" no-caps label="Clear Changes"
        v-on:click="this.newSelectedImage = {}"></q-btn>
    </q-card-section>
    <q-separator size="1.5px" color="grey-7"></q-separator>
    <q-card-section class="text-center">
      <q-avatar
        style="border:3px solid grey;"
        size="170px" v-on:click="console.log('avatar')">
        <img
          v-if="!this.checknewSelectedImage()"
          style="object-fit:cover;"
          loading="lazy"
          :src="this.store.myData.userImage ?? this.store.firebaseData.photoURL ?? this.store.defaultPhoto" alt="">
          <img
          v-else
          style="object-fit:cover;"
          :src="this.newSelectedImage.imageUrl" alt="">
      </q-avatar>
    </q-card-section>
    <q-card-section class="row text-grey-6">
      <div class="text-subtitle2">
        <q-icon name="info" class=""></q-icon>
        Click 2 Times To Image for Change Profile Picture.
      </div>
    </q-card-section>
    <q-card-section class="row">
      <q-card
        bordered
        @dblclick="selectNewImage(data)"
        class="col-4 bg-transparent"
        style="height:150px;"
        v-for="(data,key) in this.myImages" :key="key">
        <q-img
          class=""
          loading="lazy"
          spinner-color="white"
          style="height:150px;" :src="data.imageUrl">
          <div class="absolute-center full-width text-center" v-if="this.checkSelectedImage(data)">
            <q-btn
              v-on:click="this.newSelectedImage = {}"
              icon="fa-solid fa-remove" size="sm" color="grey-4" outline round></q-btn>
          </div>
        </q-img>
      </q-card>
    </q-card-section>
    <q-separator size="1.2px"></q-separator>
    <q-card-section v-if="this.checknewSelectedImage()">
      <q-btn
        v-on:click="updateImage"
        icon="edit" class="full-width" outline color="green-4"
        no-caps label="Update Profile Image"
      ></q-btn>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myImages:[],
      newSelectedImage:{}
    }
  },
  methods:{
    updateImage(){
      this.$q.dialog(
        {
          cancel:true,
          title:'Warning',
          message:'Are You Sure For Update Profile Picture ?',
          fullHeight:this.store.mobileActive ? true : false,
          maximized:this.store.mobileActive ? true : false,
          dark:true,
          color:'red-4',
        }
      ).onOk(() => {
        Object.assign(this.store.newData,{
          userImage:this.newSelectedImage.imageUrl
        })
        this.store.updateProfile()
        this.newSelectedImage = {}
        this.$q.notify(
          {
            type:'positive',
            position:'right',
            message:'Profile Image Updated.',
            icon:'info'
          }
        )
      })
    },
    checkSelectedImage(data){
      const check = this.newSelectedImage.hasOwnProperty('imageUrl')
      if(check === true){
        const secCheck = data._id === this.newSelectedImage._id ? true : false
        return secCheck
      }else{
        return false
      }
    },
    checknewSelectedImage(){
      const check = this.newSelectedImage.hasOwnProperty('imageUrl')
      console.log('check',check)
      return check
    },
    selectNewImage(data){
      this.newSelectedImage = data
      console.log(this.newSelectedImage)
    },
    getMyGallery(){
      this.myImages = this.store.myData.myImages
    },
    goBack(){
      this.newSelectedImage = {}

      this.store.myGalleryDialogActive =! this.store.myGalleryDialogActive
    }
  },
  created(){
    this.getMyGallery()
  }
}
</script>

<style>

</style>
