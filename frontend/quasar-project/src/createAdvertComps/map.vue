<template>
  <q-card>
    <q-card-section class="text-right">
      <q-btn
        outline label="Find Me" no-caps
        color="green-7" icon="location_on"
        v-on:click="getCurrentLocationLatLng"></q-btn>
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2">
        <q-icon name="info" color="grey-8"></q-icon>
        Update Circle Radius -
      </div>
      <q-slider v-model="this.newData.radius" :min="0" :max="10000"/>
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
import {useCounterStore} from '../stores/store'
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
    getUpdatedData(e){
      const newLocationData = {
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      }
      console.log(newLocationData)
      this.newData.defaultLocation = []
      this.newData.defaultLocation[0] = newLocationData.lat
      this.newData.defaultLocation[1] = newLocationData.lng
    }
  },
  created(){

  },
  watch:{
    newData:{
      handler(newVal){
        if(newVal){
          console.log(newVal)
          const check = Number(newVal.defaultLocation.length) === 2 ? true : false
          if(check === true){
            Object.assign(this.newData,{
              lat:this.newData.defaultLocation[0],
              lng:this.newData.defaultLocation[1]
            })
          }


          const newObjForNewData = {
            lat:this.newData.lat,
            lng:this.newData.lng,
            radius:this.newData.radius
          }
          this.$emit("newObjForNewData",newObjForNewData)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
