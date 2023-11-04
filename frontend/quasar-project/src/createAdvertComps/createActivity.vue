<template>
  <q-dialog
    persistent
    v-model="this.store.createActivityDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'top'"
  >
    <q-card


      class="bg-grey-1 text-grey-9"
      :style="{
        'width':this.store.mobileActive ? '100%' : '700px',
        'max-width':this.store.mobileActive ? '100%' : '700px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat v-on:click="goBack"></q-btn>
        <q-space></q-space>
      </q-card-section>
      <q-separator color="grey-5"></q-separator>
      <q-card-section>
        <q-card
          flat
          style="height:250px;"
          class="bg-transparent">
          <q-file
              ref="openImageSelecter"
              style="display:none;"
              rounded filled
              class="q-pa-md"
              dark color="white"
              v-model="this.selectedImage"
              @update:model-value="selecNewImage"
              label="Pick New Profile Image"
            >
              <template v-slot:prepend>
                <q-icon name="collections_bookmark"></q-icon>
              </template>
            </q-file>
          <q-btn
            v-if="!this.checkSelectedImage()"
            v-on:click="openImageSelector"
            class="full-width full-height"
            size="lg"
            icon="photo_camera">
              <q-tooltip>
                Add Picture
              </q-tooltip>
            </q-btn>
          <q-img
            v-if="this.checkSelectedImage()"
            style="object-fit:cover;height:100%;"
            :src="this.newData.activityImage"
          >
            <div class="absolute-center full-width text-center">
              <q-btn icon="remove" flat color="white" v-on:click="delete this.newData.activityImage"></q-btn>
            </div>
          </q-img>
        </q-card>
      </q-card-section>
      <q-card-section class="q-pa-lg">
        <div class="text-subtitle2">
          Activity Type
        </div>
        <q-option-group
          v-model="this.group"
          :options="this.activityOptions"
          color="blue-4"
          inline
        />
      </q-card-section>
      <q-card-section>
        <q-select
          @update:model-value="updateActivityType"
          color="grey-8"
          :disable="this.group !== '' ? false : true"
          :options="this.activityTypeOptions"
          label="Select Type"
          v-model="this.activityType"
        >
          <template v-slot:prepend>
            <q-icon name="category"></q-icon>
          </template>
        </q-select>
        <q-input
          class="q-mt-md"
          type="text"
          color="grey-8"
          v-model="this.newData.activityName"
          label="Activity Name"
        >
          <template v-slot:prepend>
            <q-icon name="title"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row">
        <q-date
          class="col"
          color="orange" dark
          v-model="this.newData.activityStartDate" mask="YYYY-MM-DD" />
          <q-time
            class="col q-ml-xs"
            dark
            v-model="this.newData.activityStartHour" mask="HH:mm" color="orange" />
      </q-card-section>
      <q-card-section>
        <q-checkbox
          :color="this.newData.limitActive === true ? 'green-6' : 'red-4'"
          :label="this.newData.limitActive === true ? 'Limit Active' : 'Limit Not Active'"
          v-model="this.newData.limitActive" />

        <q-range
          :disable="this.newData.limitActive === true ? false : true "
          :color="this.newData.limitActive === true ? 'green-6' : 'red-4'"
          v-model="this.minMax"
          marker-labels
          :min="0"
          :max="20"
        />
      </q-card-section>
      <q-card-section class="">
        <q-input
          color="grey-8"
          label="Description"
          type="text"
          class="q-mt-sm"
          v-model="this.newData.description"
        >
          <template v-slot:prepend>
            <q-icon name="description"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="text-subtitle2" v-if="this.offerList.length">
        <q-icon name="info" color="grey-7" size="md"></q-icon>
          Result : {{ this.offerList.length }}
        </q-card-section>
      <q-card-section class="row">
        <q-card
          class="bg-grey-2 col-6"
          v-on:click="removeUser(data)"
          v-for="(data,key) in this.offerList" :key="key">
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar>
                <img
                  style="object-fit:cover;"
                  :src="data.userImage ?? data.googleImage" alt="">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ data.email ?? data.name ?? data.displayName }}
            </q-item-section>
            <q-item-section>
              <q-btn icon="arrow_right" flat color="grey-8"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
      </q-card-section>
      <q-card-section>
        <q-input
          v-on:keyup="searchUserFunc"
          v-model="this.searchUser"
          color="grey-8"
          type="text"
          label="Search User"
        >
          <template v-slot:prepend>
            <q-icon name="search"></q-icon>
          </template>
          <template v-slot:append>
            <q-btn
              v-if="this.searchUser"
              icon="remove" size="sm" color="red-4" v-on:click="this.searchUser = ''"></q-btn>
          </template>
        </q-input>
        <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeInRight slower">
          <q-card
            class="q-mt-xs bg-grey-2"
            v-on:click="selectUser(data)"
            v-for="(data,key) in this.findedUsers" :key="key">
            <q-item clickable>
              <q-item-section avatar>
                <q-avatar>
                  <img
                    style="object-fit:cover;"
                    :src="data.userImage ?? data.googleImage" alt="">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ data.email ?? data.name ?? data.displayName }}
                <q-item-section caption class="text-grey-6 text-weight-bold">
                  {{
                    this.checkAlreadyAdded(data) ? 'Already Added' : ''
                  }}
                </q-item-section>
              </q-item-section>
              <q-item-section>
                <q-btn icon="arrow_right" flat color="grey-8"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </transition-group>
      </q-card-section>
      <map-vue @newObjForNewData="getnewObjForNewData"/>
      <q-card-section class="row" v-if="this.checkNewData()">
        <q-btn
          class="col"
          v-on:click="createActivityPost"
          color="green-4"
          no-caps label="Create"
          icon="edit"
        ></q-btn>
        <q-btn
          class="col"
          v-on:click="clearAll"
          color="red-4"
          icon="clear_all"
          no-caps label="Clear"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {useCounterStore} from '../stores/store'
import axios from 'axios'
import mapVue from './map.vue'
export default {
  components:{
    mapVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      searchUser:'',
      minMax:{},
      findedUsers:[],
      activityType:'',
      newData:{},
      selectedImage:'',
      group:'',
      activityOptions:[
        {id:1,label: 'Online',value:'Online'},
        {id:2,label:'Face To Face',value:'Face to Face'}
      ],
      activityTypeOptions:[],
      offerList:[]
    }
  },
  methods:{
    getnewObjForNewData(data){
      if(data){
        Object.assign(this.newData,{
          locationDetails:data
        })

      }
    },
    createActivityPost(){
      const allBody = {
        newData:this.newData
      }
      console.log(allBody)
        ///:firebaseId/postAdvert
      axios.post(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/postAdvert`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkNewData(){
      const check = Object.keys(this.newData).length
      if(check > 0){
        return true
      }else{
        return false
      }
    },
    clearAll(){
      this.newData = {}
    },
    checkAlreadyAdded(data){
      const check = this.offerList.some(
        object => object._id === data._id
      )
      return check
    },
    removeUser(data){
      this.offerList = this.offerList.filter(
        object => object._id !== data._id
      )
    },
    selectUser(data){
      console.log(data)
      const check = this.offerList.some(
        object => object._id === data._id
      )
      if(!check){
        this.offerList.push(data)
      }

    },
    searchUserFunc(){
      if(this.searchUser !== ''){
        ///:firebaseId/findUsers
        const allBody = {
          searchUser : this.searchUser
        }
        axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/findUsers`, allBody)
          .then(res => {
            console.log(res)
            this.findedUsers = res.data.findedUser
          })
          .catch(err => {
            console.log(err)
          })
      }else{
        this.findedUsers = []
      }
    },
    updateActivityType(val){
      if(val){
        Object.assign(this.newData,{
          activityType:val.label
        })
      }
    },
    checkGroup(){
      const faceValId = 2
      const onlineId = 1

      const faceVal = this.activityOptions.find(
        object => object.id === faceValId
      )
      const onlineVal = this.activityOptions.find(
        object => object.id === onlineId
      )

      const check = this.group === onlineVal.label ? true : false


      let faceValOptions = [
        {id:1,label:'Select On Map'},
        {id:2,label:'Start Discussion'}
      ]

      let onlineValOptions  = [
        {id:1,label:'Google Meet'},
        {id:2,label:'Others'}
      ]

      if(check === true){
        this.activityTypeOptions = onlineValOptions
      }else{
        this.activityTypeOptions = faceValOptions
      }

    },
    checkSelectedImage(){
      const check = this.newData.hasOwnProperty('activityImage')
      return check
    },
    openImageSelector(){
      this.$refs.openImageSelecter.$el.click()
    },
    goBack(){
      this.store.createActivityDialogActive = false
    },
    selecNewImage(val){
      if(val){
        const newObject = {
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
                Object.assign(this.newData,{
                  activityImage:newObject.url
                })
              }
        };
        reader.readAsDataURL(val);
      }
    },
  },
  created(){

  },
  watch:{
    offerList:{
      handler(newVal,oldVal){
        if(newVal.length){
          let newList = []

          this.offerList.forEach(element => {
            const check = newList.some(
              object => object.userFirebaseId === element.fireBaseId
            )
            if(!check){
              newList.push({userFirebaseId : element.fireBaseId})
            }
          });

          Object.assign(this.newData,{
            offerList:newList
          })
        }else{
          this.newData.offerList = []
        }
      },
      immediate:true, deep:true
    },
    minMax:{
      handler(newVal){
        const check = this.newData.hasOwnProperty('limitActive')
        if(check === true){
          if(this.newData.limitActive === true){
            Object.assign(this.newData,{
              minRange:newVal.min,
              maxRange:newVal.max
            })
          }
        }
      },
      immediate:true, deep:true
    },
    group:{
      handler(newVal){
        console.log(newVal)
        if(newVal){
          this.checkGroup()
        }
      },
      immediate:true, deep:true
    },
    newData:{
      handler(newVal){
        const checkLimitActive = newVal.hasOwnProperty('limitActive')
        if(checkLimitActive){
          if(this.newData.limitActive === false){
            delete this.newData.minRange
            delete this.newData.maxRange
          }
        }
        const check = Object.keys(newVal).length
        if(check > 0){
          const obj = newVal
          for(const key in obj){
            if(obj[key] === '' || obj[key] === null){
              delete obj[key]
            }
          }
        }
        console.log('newVal',newVal)
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
