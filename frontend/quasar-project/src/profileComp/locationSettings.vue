<template>
  <q-card
    class="bg-transparent text-white  " flat
  >
  <q-card-section class="text-right">
    <q-btn
      v-on:click="this.store.selectedOption.id = 4"
      icon="collections_bookmark" rounded no-caps label="Go Gallery" color="grey-10" icon-right="arrow_left"></q-btn>
  </q-card-section>
    <q-card-section class="text-subtitle2">
      Favourited Locations
    </q-card-section>
    <q-card-section class=" row">
      <q-space></q-space>
      <q-btn
        :disable="this.checkCurrentLocation() === true ? false : true"
        outline
        rounded
        class="q-mr-sm"
        v-on:click="deleteCurrentLocation" label="Delete Location" no-caps
        icon="delete_forever" color="red-4"></q-btn>
      <q-btn
        rounded
        label="Get Current Location" no-caps color="grey-4"
        v-on:click="getLocationButton"
        icon="location_on" outline
      >
        <q-tooltip>
          Get Location !
        </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section>
      <q-card
        class="bg-transparent text-white" flat bordered
      >
        <q-card-section>
          Location Settings
        </q-card-section>
        <q-separator color="grey-5"></q-separator>
        <q-card-section>
          <div>
            <q-toggle
              @update:model-value="updateLocationHideSettings"
              :color="this.currentLocation.hideLocationActive === false ? 'red-4' : 'green'"
              v-model="this.currentLocation.hideLocationActive"
              :icon="this.currentLocation.hideLocationActive === false ? 'toggle_on' : 'toggle_on' "
              :label="this.currentLocation.hideLocationActive === false ? 'Active Location' : 'Hide Location'"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <div

        :style="{
          'width':this.store.mobileActive ? '100%' : '100%',
          'height':this.store.mobileActive ? '500px' : '500px'
        }"
      >
        <l-map
          :use-global-leaflet="false"
          ref="map" v-model:zoom="zoom" :center="this.defaultLocation">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker
            @dragend="getUpdatedData"
            draggable="true"
            :lat-lng="this.defaultLocation" >
            <l-popup>
              Selected Location
            </l-popup>
          </l-marker>
          <l-circle
            v-if="this.checkCurrentLocation()"
            :lat-lng="this.defaultLocation"
            :radius="this.circle.radius"
            :color="this.circle.color"
          />
        </l-map>
      </div>
    </q-card-section>
    <q-card-section>
      <q-card
        class="bg-transparent text-white" bordered
      >
      <q-card-section class="text-subtitle2">
        <q-icon name="location_on"></q-icon>
        Location Details
      </q-card-section>
      <q-card-section horizontal>
        <q-card-section class="col">
        <q-card class="bg-dark text-white" bordered>
          <q-card-section>
            <div>
              Lat : {{ this.currentLocation.lat ? this.currentLocation.lat : '0' }}
            </div>
          </q-card-section>
        </q-card>
        <q-card class="bg-dark text-white" bordered>
          <q-card-section>
            <div class="q-mt-sm">
              Lng : {{ this.currentLocation.lng ? this.currentLocation.lng : '0' }}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="col">
        <q-card class="bg-dark text-white" bordered>
          <q-card-section>
            <div>
              Country : {{ this.currentLocation.country ? this.currentLocation.country : 'No Country Info' }}
            </div>
          </q-card-section>
        </q-card>
        <q-card class="bg-dark text-white" bordered>
          <q-card-section>
            <div class="q-mt-sm">
              City : {{ this.currentLocation.city ? this.currentLocation.city : 'No City Info' }}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      </q-card-section>
      <q-card-section class="">
        <div>
          Formatted Address : {{ this.currentLocation.address ? this.currentLocation.address : 'No Adress Info' }}
        </div>
      </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-btn
        v-on:click="updateFunc"
        outline color="green-4" no-caps label="Update"
      ></q-btn>
    </q-card-section>
  </q-card>
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
import { useCounterStore } from 'src/stores/store';
import axios from "axios";
export default {
  components:{
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LCircle
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      zoom:10,
      defaultLocation:[47.41322, -1.219482],
      currentLocation:{
        address:'',
        country:'',
        city:''
      },
      circle: {
        radius: 700,
        color: 'red'
      }
    }
  },
  methods:{
    updateLocationHideSettings(val){
      const check = this.store.newData.hasOwnProperty('preferedLocation')
      if(check){
        Object.assign(this.store.newData.preferedLocation,{
          hideLocationActive:val
        })
      }else{
        Object.assign(this.store.newData,{
          preferedLocation:{hideLocationActive:val}
        })
      }

      const secCheck = this.currentLocation.hasOwnProperty('preferedLocation')
      if(secCheck){
        Object.assign(this.currentLocation.preferedLocation,{
          hideLocationActive:val
        })
      }else{
        Object.assign(this.currentLocation,{
          preferedLocation:{hideLocationActive:val}
        })
      }

      console.log('currentLocation',this.currentLocation)
      console.log('newData',this.store.newData)
    },
    getMyLocationHideActive(){
      const check = this.currentLocation.hasOwnProperty('hideLocationActive')
      if(check === true){
        const secCheck = this.currentLocation.hideLocationActive === true ? true : false
        Object.assign(this.currentLocation,{
          hideLocationActive:secCheck
        })
      }else{
        Object.assign(this.currentLocation,{
          hideLocationActive:false
        })
      }
    },
    deleteCurrentLocationDB(){
      ///:firebaseId/removeCurrentLocation
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/removeCurrentLocation`)
        .then(res => {
          console.log(res)
          this.currentLocation.address = ''
          this.currentLocation.country = ''
          this.currentLocation.city = ''

          delete this.currentLocation.lat
          delete this.currentLocation.lng
        })
        .catch(err=>{
          console.log(err)
        })
    },
    deleteCurrentLocation(){
      this.$q.dialog(
        {
          dark:true,
          title:'Warning',
          message:'Are You Sure for Delete Selected Location From DataBase ?',
          cancel:true,
          color:'red-4'
        }
      ).onOk(
        () => {
          this.deleteCurrentLocationDB()
        }
      )
    },
    updateFunc(){
      const check = ['lat','lng'].every(
        (key) => key in this.currentLocation
      )
      if(check === true){
        Object.assign(this.store.newData,{
          preferedLocation:this.currentLocation
        })
        console.log(this.store.newData)
        this.store.updateProfile()

        delete this.store.newData.preferedLocation
      }
    },
    async afterDragGetMoreDetailFromOpenCage(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()

      Object.assign(this.currentLocation,{
        city:resData.results[0].components.province,
        country:resData.results[0].components.country,
        address:resData.results[0].formatted
      })
    },
    getUpdatedData(e){
      const newLocationData = {
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      }

      const allBody = {
        lat:newLocationData.lat,
        lng:newLocationData.lng
      }

      this.afterDragGetMoreDetailFromOpenCage(allBody)
      Object.assign(this.currentLocation,{
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      })

    },
    checkCurrentLocation(){
      const newVal = this.currentLocation

      const check = ['lat','lng'].every(
        (key) => key in newVal
      )
      if(check === true){
        const secondCheck = newVal.lat !== '' && newVal.lat !== null && newVal.lng !== null && newVal.lng !== '' ? true : false
        return secondCheck
      }else{
        return false
      }
    },
    getLocationButton(){
      this.getCurrentLocationLatLng()
    },
    async getCurrentLocationDetails(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()
      console.log('resData',resData)
      const formData = {}

      const lat = allBody.lat
      const lng = allBody.lng
      const address = resData.results[0].formatted
      const country = resData.results[0].components.country
      const city = resData.results[0].components.province
      Object.assign(formData,{
        address,country,city,lat,lng,locationUpdateDate:new Date().toLocaleString()
      })

      Object.assign(this.currentLocation,formData)

      console.log(formData)
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
        this.getCurrentLocationDetails(allBody)
      });
    },
    checkMyPreferedLocationFromDB(newVal){
      const check = newVal.hasOwnProperty('preferedLocation')
      if(check === true){
        const secCheck = ['lat','lng'].every(
          (key) => key in newVal.preferedLocation
        )
        if(secCheck){
          const thirdCheck = newVal.preferedLocation.lat !== '' && newVal.preferedLocation.lat !== null && newVal.preferedLocation.lng !== '' && newVal.preferedLocation.lng !== null ? true : false
          return thirdCheck
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getMyLocationDB(newVal){
      console.log('newVal,prefereclocation',newVal.preferedLocation)
      Object.assign(this.currentLocation,newVal.preferedLocation)
      this.getMyLocationHideActive()
    }
  },
  created(){

  },
  watch:{
    'store.myData':{
      handler(newVal){
        if(newVal){
          if(this.checkMyPreferedLocationFromDB(newVal)){
            this.getMyLocationDB(newVal)
          }
        }
      },
      immediate:true, deep:true
    },
    currentLocation:{
      handler(newVal){
        if(newVal){
          const check = ['lat','lng'].every(
            (key) => key in newVal
          )
          if(check){
            this.defaultLocation = []
            this.defaultLocation[0] = newVal.lat
            this.defaultLocation[1] = newVal.lng
          }
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('uid')
          if(check === true){
            this.store.getMyDetailFromDb()
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
