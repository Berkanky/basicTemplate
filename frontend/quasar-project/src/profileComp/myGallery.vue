<template>
  <q-card
    class="bg-transparent text-white" flat
  >
  <q-card-section class="text-right">
    <q-btn
      color="grey-10" rounded
      icon="fa-regular fa-file" no-caps label="Go CV Settings" icon-right="arrow_left"></q-btn>
  </q-card-section>
  <q-card-section class=" row">
    <div class="text-subtitle2">
      My Gallery
    </div>
    <q-space></q-space>
    <q-btn-dropdown
      v-if="this.selectedImages.length"
      color="red-4" outline label="Options" no-caps dropdown-icon="change_history">
      <q-list>
        <q-item
          v-for="(data,key) in this.selectedImagesOptions" :key="key"
          clickable v-close-popup @click="selectedImagesSelect(data)">
          <q-item-section>
            <q-item-label>{{data.label}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-card-section>
  <q-separator color="grey-7"></q-separator>

  <q-scroll-area
    style="width:100%;"
    :style="{
      'height':this.store.mobileActive ? '550px' : '550px'
    }"
  >
  <q-card-section class="text-right">
    <q-btn
      flat
      icon="fiber_manual_record"
      :color="this.checkForSelectAllButton() === true ? 'red-4' : 'grey-4'"
      v-on:click="selectAllImageButton"
      :label="this.checkForSelectAllButton() === true ? 'Clear All Selected Images' : 'Select All Images'"
      no-caps
      ></q-btn>

  </q-card-section>
  <q-card-section class="row">
    <q-card
      v-for="(data,key) in this.myImages" :key="key"
      class="col-4 bg-transparent"
      style="height:150px;"
    >
      <q-img
        style="height:100%;object-fit:cover;"
        loading="lazy"
        :src="data.imageUrl"
        spinner-color="white"
        alt="">
          <div class="absolute-top-right" style="border-radius:4px;">
            <q-btn-dropdown dropdown-icon="more_vert" flat>
              <q-list>
                <q-item
                  v-on:click="selectOption(menu,data)"
                  v-for="(menu,key) in this.imageOptions" :key="key"
                  clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>{{menu.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class="absolute-center text-center full-width" v-if="this.checkSelectedOrNot(data)">
            <q-icon name="check"></q-icon>
          </div>
        </q-img>
    </q-card>
    <q-card
      bordered
      style="height:150px;"
      class=" col-4 bg-transparent">
      <q-btn
        v-on:click="addImage"
        flat color="green-4"
        icon="add"
        size="lg"
        class="full-width full-height"
      >
        <q-tooltip>
          Add New Image
        </q-tooltip>
      </q-btn>
    </q-card>
  </q-card-section>

  <q-card-section class="row" v-if="this.newAddedImages.length">
    <q-card
      v-for="(data,key) in this.newAddedImages" :key="key"
      class="col-4 bg-transparent"
      style="height:150px;"
    >
      <q-img
        :src="data.url"
        style="height:100%;object-fit:cover;"
        loading="lazy"
        spinner-color="white"
        alt="">
          <div class="absolute-top-right bg-transparent">
            <q-btn icon="cancel" class="" flat color="grey-8" v-on:click="removeFromNewAddedList(data)"></q-btn>
          </div>
        </q-img>
    </q-card>
    <q-card
      bordered
      style="height:150px;"
      class="col-4 bg-transparent">
      <q-btn
        v-on:click="uploadImage"
        flat color="green-4"
        icon="upload"
        size="md"
        class="full-width full-height"
      >
        <q-tooltip>
          Upload Images
        </q-tooltip>
      </q-btn>
    </q-card>
  </q-card-section>
</q-scroll-area>
<q-separator color="grey-7" class="q-mt-md"></q-separator>
  <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
  </q-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myImages:[],
      newAddedImages:[],
      selectAllActive:false,
      selectedImages:[],
      imageOptions:[
        {id:1,label:'Select',icon:'delete_forever'},
      ],
      selectedImagesOptions:[
        {id:1,label:'Delete All Selecteds',icon:'delete_forever'},
        {id:2,label:'Hide All Selecteds',icon:'edit'},
        {id:3,label:'Clear Selected Images List',icon:'clear_all'}
      ]
    }
  },
  methods:{
    selectAllImageButton(){
/*       this.selectAllActive =! this.selectAllActive

      const check = this.selectAllActive === false ? false : true
      if(!check){
        this.selectedImages = []
      } */

      const myImagesLength = this.myImages.length
      const selectedImagesLength = this.selectedImages.length
      const check = Number(myImagesLength) === Number(selectedImagesLength) ? true : false

      if(check === false){
        this.myImages.forEach(element => {
          const result = this.selectedImages.some(
            object => object.imageId === element.imageId
          )
          if(!result){
            this.selectedImages.push(element)
          }
        });

      }else if(check === true){
        this.selectedImages = []
      }
    },
    checkForSelectAllButton(){
      const myImagesLength = this.myImages.length
      const selectedImagesLength = this.selectedImages.length

      const check = Number(myImagesLength) === Number(selectedImagesLength) ? true : false
      return check
    },
    selectedImagesSelect(data){
      if(data.id === 1){
        ///:firebaseId/deleteAllSelecteds
        const allBody = {
          selectedImages:this.selectedImages
        }
        axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/deleteAllSelecteds`, allBody)
          .then(res => {
            console.log(res)
            this.selectedImages = []

            res.data.selectedImages.forEach(element => {
              this.myImages = this.myImages.filter(
                object => object._id !== element._id
              )
            });

          })
          .catch(err => {
            console.log(err)
          })
      }else if(data.id === 3){
        this.selectedImages = []
      }
    },
    checkSelectedOrNot(data){
      const result = this.selectedImages.some(
        object => object.imageId === data.imageId
      )
      return result
    },
    selectOption(menu,data){
      if(menu.id === 1){
        const result = this.selectedImages.some(
          object => object.imageId === data.imageId
        )
        if(!result){
          this.selectedImages.push(data)
        }else{
          this.selectedImages = this.selectedImages.filter(
            object => object.imageId !== data.imageId
          )
        }
      }
    },
    removeFromNewAddedList(data){
      this.newAddedImages = this.newAddedImages.filter(object => object.imageId !== data.imageId)
    },
    uploadImageDbFunction(){
      ///:firebaseId/addImages
      const allBody = {
        newAddedImages:this.newAddedImages
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addImages`, allBody)
        .then(res => {
          console.log('addImages',res)
          this.newAddedImages = []
          this.store.getMyDetailFromDb()
        })
        .catch(er => {
          console.log(er)
        })
    },
    uploadImage(){
      this.$q.dialog(
        {
          cancel:true,
          title:'Warning',
          message:'Are You Sure to Upload Selected Images To DataBase ?',
          fullHeight:this.store.mobileActive ? true : false,
          maximized:this.store.mobileActive ? true : false,
          color:'red-4'
        }
      ).onOk(() => {
        this.uploadImageDbFunction()
      })
    },
    addImage(){
      this.$refs.fileInput.$el.click()
    },
    getMyGallery(){
      this.myImages = this.store.myData.myImages
      console.log('myImags',this.myImages)
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
                this.newAddedImages.push(newObject)
                console.log(this.newAddedImages)
              }
        };
        reader.readAsDataURL(val);
      }
    },
  },
  mounted(){
    //
  },
  created(){
    this.getMyGallery()
  },
  watch:{
    selectedImages:{
      handler(newVal){
        if(newVal){
          console.log('selectedImages',newVal)
        }
      },
      immediate:true, deep:true
    },
    'store.myData':{
      handler(newVal){
        if(newVal){
          this.getMyGallery()
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
