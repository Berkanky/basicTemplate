<template>
  <q-dialog
    v-model="this.store.updateActivityDialogActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >

    <q-card
      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '700px',
        'max-width':this.store.mobileActive ? '100%' : '700px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn
          v-on:click="updateAdvert"
          color="green-4"
          no-caps label="Update" outline
          icon="update"></q-btn>
      </q-card-section>
      <q-separator color="grey-5"></q-separator>
      <q-card-section>
        <q-card style="height:180px;" class="bg-transparent">
          <q-btn
            v-if="!this.advertDetail.activityImage"
            icon="photo_camera"
            class="full-width full-height"
            color="grey-8"
            v-on:click="selectImageFunc"
          ></q-btn>
          <q-img
            loading="lazy"
            sizes="lg"
            spinner-color="white"
            v-on:click="this.advertDetail.activityImage = ''"
            style="height:180px;object-fit:cover;"
            :src="this.advertDetail.activityImage"
          >
            <div class="absolute-center full-width text-center">
              <q-btn icon="fa-solid fa-remove" flat></q-btn>
            </div>
          </q-img>
        </q-card>
      </q-card-section>
      <q-card-section class="row">
        <q-input
          class="col-6"
          type="text"
          label="Activity Name"
          v-model="this.advertDetail.activityName"
          dark color="white"
        >
          <template v-slot:prepend>
            <q-icon name="title"></q-icon>
          </template>
        </q-input>
        <q-input
          class="col-6"
          type="text"
          label="Activity Type"
          v-model="this.advertDetail.activityType"
          dark color="white"
        >
          <template v-slot:prepend>
            <q-icon name="category"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="">
        <q-input
          color="white" dark
          label="Description"
          v-model="this.advertDetail.description"
          type="textarea"
        >
          <template v-slot:prepend>
            <q-icon name="info" size="xs"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-mt-sm">
        <q-range
          dark
          color="orange-4"
          v-model="this.minMaxVal"
          :min="0"
          :max="50"
          label-always
        />
      </q-card-section>
      <q-card-section class="row">
        <q-card
          class="col-4 bg-transparent"
          v-for="(data,key) in this.advertDetail.advertImages" :key="key"
          style="height:150px;">
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.imageUrl"
            style="object-fit:cover;height:100%;">
            <div class="absolute-center full-width text-center">
                <q-btn icon="fa-solid fa-remove" flat v-on:click="removeImageFromdb(data)"></q-btn>
            </div>
            </q-img>
        </q-card>
        <q-card
          class="col-4 bg-transparent"
          v-for="(data,key) in this.newAddedImages" :key="key"
          style="height:150px;">
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.imageUrl ?? data.url"
            style="object-fit:cover;height:100%;">
              <div class="absolute-center full-width text-center">
                <q-btn icon="fa-solid fa-remove" flat v-on:click="removeFromAddedImages(data)"></q-btn>
              </div>
            </q-img>
        </q-card>
        <q-card
          class="bg-dark col-4"
          style="height:150px;"
        >
          <q-btn
            size="xl"
            v-on:click="addNewImage()"
            icon="add" class="full-width full-height" color="green-4" flat></q-btn>
        </q-card>
      </q-card-section>
      <q-card-section class="row">
        <q-date
          v-model="this.advertDetail.activityStartDate"
          dark color="grey-6"
          mask="YYYY-MM-DD"
          class="col-6"
        />
        <q-time
          class="col-6"
          v-model="this.advertDetail.activityStartHour"
          mask="HH:mm" color="grey-6" dark />
      </q-card-section>
      <q-card-section class="text-right">
        <q-btn icon="location_on" outline color="green-4" no-caps label="Find Location" v-on:click="this.getCurrentLocationLatLng()"></q-btn>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">
          <q-icon name="info" color="grey-8"></q-icon>
          Update Circle Radius -
        </div>
        <q-slider
          dark
          color="orange-4"
          v-model="this.newData.radius" :min="0" :max="100000"/>
      </q-card-section>
      <div
        :style="{
          'width':this.store.mobileActive ? '100%' : '100%',
          'height':this.store.mobileActive ? '500px' : '500px'
        }"
      >
        <l-map
          :use-global-leaflet="false"
          ref="map" v-model:zoom="this.newData.zoom" :center="this.newData.defaultLocation">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker
                @dragend="getUpdatedData"
                draggable="true"
                :lat-lng="this.newData.defaultLocation" >
              <l-popup>
                Selected Location
              </l-popup>
            </l-marker>
            <l-circle
              :lat-lng="this.newData.defaultLocation"
              :radius="this.newData.radius"
              :color="this.newData.color"
            />
        </l-map>
      </div>
      <q-card-section>
        <q-card class="bg-transparent" flat>
          <q-item clickable>
            <q-item-section>
              <q-btn icon="groups" v-on:click="this.store.offerListUpdateDialogActive = true"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
      </q-card-section>
    </q-card>
    <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
    <q-file ref="fileInputSecond" v-model="this.imageSecond" style="display: none" @update:model-value="selectNewFileSecond"/>
    <updateOfferList v-if="this.store.offerListUpdateDialogActive"/>
  </q-dialog>
</template>

<script>
import "leaflet/dist/leaflet.css";
import
  {
   LMap,
   LTileLayer,
   LMarker,
   LPopup,
   LCircle
  } from "@vue-leaflet/vue-leaflet";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
import updateOfferList from "./updateOfferList.vue";
export default {
  components:{
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LCircle,
    updateOfferList
  },
  props:['selectedAdvertDetail'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      defaultLocation:[47.41322, -1.219482],
      advertDetail:{},
      imageSecond:'',
      image:'',
      minMaxVal:{},
      newAddedImages:[],
      updatedNewAddedImages:[],
      newData:{
        radius:700,
        lat:0,
        lng:0,
        color: 'red',
        zoom:10,
        defaultLocation:[46,50],
      },
    }
  },
  methods:{
    getCurrentLocation(){
      const check = this.advertDetail.hasOwnProperty('locationDetails')
      if(check === true){
        this.newData.defaultLocation = []
        this.newData.defaultLocation[0] = Number(this.advertDetail.locationDetails.lat)
        this.newData.defaultLocation[1] = Number(this.advertDetail.locationDetails.lng)
      }
    },
    updateLocationDetails(){
      const newlocationDetails = {
        lat:this.newData.defaultLocation[0],
        lng:this.newData.defaultLocation[1],
        radius:this.newData.radius
      }

      Object.assign(this.advertDetail,{
        locationDetails:newlocationDetails
      })
    },
    getUpdatedData(e){
      const newLocationData = {
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      }
      console.log(newLocationData)
      this.newData.defaultLocation = []
      this.newData.defaultLocation[0] = newLocationData.lat
      this.newData.defaultLocation[1] = newLocationData.lng
    },
    getCurrentLocationLatLng(){
      const navigator = window.navigator;
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const allBody = {
          lat:latitude,
          lng:longitude
        }
        console.log(allBody)
        this.newData.defaultLocation = []
        this.newData.defaultLocation[0] = allBody.lat
        this.newData.defaultLocation[1] = allBody.lng
      });
    },
    removeImageFromdb(data){
      this.advertDetail.advertImages = this.advertDetail.advertImages.filter(
        object => object.imageId !== data.imageId
      )
    },
    removeFromAddedImages(data){
      this.newAddedImages = this.newAddedImages.filter(
        object => object.imageId !== data.imageId
      )
    },
    selectNewFileSecond(val){
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
              }
        };
        reader.readAsDataURL(val);
      }
    },
    addNewImage(){
      this.$refs.fileInputSecond.$el.click()
    },
    selectImageFunc(){
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
                Object.assign(this.advertDetail,{
                  activityImage:newObject.url
                })
              }
        };
        reader.readAsDataURL(val);
      }
    },
    addAdvertImages(){
      if(this.updatedNewAddedImages.length){
        let totalList = this.advertDetail.advertImages.concat(this.updatedNewAddedImages)
        Object.assign(this.advertDetail,{
          advertImages:totalList
        })
        this.newAddedImages = []
        this.updatedNewAddedImages = []
      }
    },
    updateAdvert(){
      this.$q.dialog(
        {
          dark:true,
          cancel:true,
          color:'red-4',
          title:'Warning',
          message:'Are You Sure For Update Selected Advert ?'
        }
      ).onOk(
        () => {
          this.updateLocationDetails()
          this.addAdvertImages()
          console.log(this.advertDetail)
          const newData = this.advertDetail
          this.store.updateAdvert(newData)
        }
      )
    },
    goBack(){
      this.store.selectedAdvertDetailDB = {}
      this.store.updateActivityDialogActive = false
    },
    checkObject(param){
      const check = param.hasOwnProperty('_id')
      return check
    },
    updateMinMaxRange(newVal){
      const check = newVal.hasOwnProperty('minRange')
      const secCheck = newVal.hasOwnProperty('maxRange')

      Object.assign(this.minMaxVal,{
        min:check === true ? newVal.minRange : 0,
        max:secCheck === true ? newVal.maxRange : 0
      })
    }
  },
  created(){

  },
  watch:{
    newAddedImages:{
      handler(newVal){
        if(newVal.length){
          let updatedNewAddedImages = []
          newVal.forEach(element => {
            const newObj = {
              imageName:element.name,
              imageType:element.type,
              imageUrl:element.url,
              imageId:element.imageId
            }
            updatedNewAddedImages.push(newObj)
          });
          this.updatedNewAddedImages = updatedNewAddedImages
          console.log('updatedNewAddedImages',this.updatedNewAddedImages)
        }
      },
      immediate:true, deep:true
    },
    advertDetail:{
      handler(newVal){
        if(newVal){
          console.log('advertDetail',newVal)
        }
      },
      immediate:true, deep:true
    },
    minMaxVal:{
      handler(newVal){
        if(newVal){
          console.log(newVal)
          const checkMinVal = newVal.hasOwnProperty('min')
          if(checkMinVal){
            Object.assign(this.advertDetail,{
              minRange:newVal.min
            })
          }

          const secCheck = newVal.hasOwnProperty('max')
          if(secCheck){
            Object.assign(this.advertDetail,{
              maxRange:newVal.max
            })
          }

        }
      },
      immediate:true, deep:true
    },
    'store.selectedAdvertDetailDB':{
      handler(newVal){
        if(this.checkObject(newVal) === true){
          console.log(newVal)
          this.advertDetail = newVal
          this.updateMinMaxRange(newVal)
          this.getCurrentLocation()
        }
      },
      immediate:true, deep:true
    },
    selectedAdvertDetail:{
      handler(newVal){
        const check = newVal.hasOwnProperty('id')
        if(check === true){
          const id = newVal.id
          this.store.getAdvertDetail(id)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
