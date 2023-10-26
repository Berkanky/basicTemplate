<template>
  <q-card class="bg-transparent text-white" flat>
    <q-card-section class="text-right">
      <q-btn
        v-on:Click="this.store.selectedOption.id = 2"
        icon="settings" no-caps label="Go to Account Settings" color="grey-10" size="md" rounded></q-btn>
    </q-card-section>
    <q-card-section class="text-subtitle2">
      Public Profile
    </q-card-section>
    <q-separator color="grey-10"></q-separator>
    <q-card-section class="row">
      <q-card-section class="col-12 col-md-8 col-sm-8">
        <q-card-section>
          <q-input
            bottom-slots
            type="text"
            outlined
            dark color="grey-6"
            v-model="this.store.newData.name"
            :label="this.store.myData.name ? this.store.myData.name : 'Name'"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
            <template v-slot:hint>
              <div class="text-grey-5">
                Your name may appear around codeToDesign where you contribute or are mentioned. You can remove it at any time.
              </div>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            disable
            type="email"
            outlined
            bottom-slots
            :label="this.store.myData.email ? this.store.myData.email : 'Email'"
            dark color="grey-6"
          >
          <template v-slot:prepend>
              <q-icon name="mail"></q-icon>
            </template>
            <template v-slot:hint>
              <div class="text-grey-5">
                You have set your email address to private. To toggle email privacy, go to email settings and uncheck "Keep my email address private."
              </div>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            type="textarea"
            bottom-slots
            :label="this.store.myData.userDescription ? this.store.myData.userDescription : 'Bio'"
            dark v-model="this.store.newData.userDescription"
            color="grey-8" outlined
          >
            <template v-slot:hint>
              <div class="text-grey-5">
                You can @mention other users and organizations to link to them.
              </div>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="row">
          <q-btn
            v-for="(data,key) in this.genderOptions" :key="key"
            :icon="data.icon"
            :flat="this.checkSelectedGender(data) === true || this.checkMyDataGender(data) === true ? false : true"
            :color="data.color" v-on:click="this.store.newData.gender = data.label"
          >
            <q-tooltip>
              {{ data.label }}
            </q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-pa-sm">
            Social Accounts
          </div>

          <div class="text-caption text-grey-7 text-weight-bold q-pa-sm">
            <q-icon name="info"></q-icon>
            Any change to the social links will affect all links. Be sure to add all links.
          </div>

          <q-input
            color="grey-8"
            v-model="data.url"
            dark outlined type="text"
            :label="data.currentUrl ??  data.label" class="q-mt-xs"
            v-for="(data,key) in this.socialMediaLinks" :key="key"
          >
            <template v-slot:prepend>
              <q-icon :name="data.icon" :color="data.color"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn
                v-on:click="openLink(data)"
                icon="link" flat color="white" v-if="data.currentUrl"></q-btn>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-pa-sm">
            Location
          </div>
          <q-input
            bottom-slots color="grey-8" dark outlined
            type="text"
            :label="this.getMyLocation()"
            v-model="this.locationAdressDetail.country"
          >
            <template v-slot:prepend>
              <q-icon name="location_on"></q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="row">
          <q-btn no-caps label="Update Profile" color="green" v-on:click="updateProfile"></q-btn>
          <q-btn
            v-if="this.checkForStoreNewData()"
            no-caps label="Clear Updates" color="red-4" v-on:click="clearChanges"></q-btn>
        </q-card-section>

      </q-card-section>

      <q-card-section class="col-12 col-md-4 col-sm-4 text-right">
        <q-card class="bg-transparent" flat>
          <q-card-section class="text-center">
            <q-avatar size="180px">
              <img
                style="object-fit:cover;"
                :src="this.store.newData.userImage ?? this.store.myData.userImage ?? this.store.firebaseData.photoURL" alt="">
            </q-avatar>
            <q-file
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
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios';
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
      selectedImage:'',
      genderOptions:[
        {id:1,label:'male',icon:'male',color:'blue-4'},
        {id:2,label:'female',icon:'female',color:'pink'},
        {id:3,label:'hidden',icon:'password',color:'grey-7'}
      ],
      socialMediaLinks:[
        {id:1,label:'Linkedin',icon:'fa-brands fa-linkedin-in',color:'blue-4',url:'',currentUrl:''},
        {id:2,label:'Instagram',icon:'fa-brands fa-instagram', color:'pink-4',url:'',currentUrl:''},
        {id:3,label:'Google',icon:'fa-brands fa-google',color:'red-4',url:'',currentUrl:''}
      ],
      locationAdressDetail:{}
    }
  },
  methods:{
    getMyLocation(){
      const check = this.store.myData.hasOwnProperty('locationAdressDetail')
      if(check === true){
        const secCheck = this.store.myData.locationAdressDetail.country ? true : false
        if(secCheck === true){
          return  this.store.myData.locationAdressDetail.country
        }else{
          return 'Country'
        }
      }else{
        return 'Country'
      }
    },
    openLink(data){
      window.open(data.currentUrl, "_blank");
    },
    checkMyCurrentSocialMediaLinks(){
      console.log('socialMediaLinks',this.store.myData.socialMediaLinks)

      this.socialMediaLinks.forEach(element => {
        const result = this.store.myData.socialMediaLinks.find(
          object => object.linkName === element.label
        )
        if(result){
          element.currentUrl = result.linkUrl
        }
      });

    },
    checkMyDataGender(data){
      const check = ['gender'].every(
        (key) => key in this.store.myData
      )
      if(check === true){
        const secCheck = this.store.myData.gender === data.label ? true : false
        return secCheck
      }else{
        return false
      }
    },
    checkSelectedGender(data){
      const check = this.store.newData.hasOwnProperty('gender')
      if(check === true){
        const secCheck = this.store.newData.gender === data.label ? true : false
        return secCheck
      }else{
        return false
      }
    },
    checkForStoreNewData(){
      const check = Object.keys(this.store.newData).length > 0 ? true : false
      return check
    },
    clearChanges(){
      this.store.newData = {}
      this.selectedImage = ''
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
                Object.assign(this.store.newData,{
                  userImage:newObject.url ?? ''
                })
              }
        };
        reader.readAsDataURL(val);
      }
    },
    updateProfile(){
      ///:firebaseId/updateMyProfile
      const fid = this.store.firebaseData.uid
      const url = this.store.baseUrl
      const allBody = {
        newData:this.store.newData
      }
      axios.put(`${url}/app/${fid}/updateMyProfile`, allBody)
        .then(res => {
          console.log(res)
          this.store.getMyDetailFromDb()
          this.store.newData = {}
          this.selectedImage = ''
          this.locationAdressDetail = {}
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
  },
  watch:{
    locationAdressDetail:{
      handler(newVal){
        if(newVal){
          const obj = newVal
          for(const key in obj){
            if(obj[key] === null || obj[key]  === ''){
              delete obj[key]
              const check = this.store.newData.hasOwnProperty('locationAdressDetail')
              if(check === true){
                delete this.store.newData.locationAdressDetail
              }
            }else{
              Object.assign(this.store.newData,{
                locationAdressDetail:newVal
              })
            }
          }
        }
      },
      immediate:true, deep:true
    },
    socialMediaLinks:{
      handler(newVal){
        if(newVal){
          //console.log(newVal)

          let addedLinks = []
          newVal.forEach(element => {
            const check = element.url !== '' ? true : false
            if(check === true){
              const newObj = {
                linkUrl:element.url,
                linkName:element.label,
                linkIcon:element.icon,
              }
              addedLinks.push(newObj)
            }
          });

          const addedLinksCheck = addedLinks.length > 0 ? true : false
          if(addedLinksCheck){
            Object.assign(this.store.newData,{
              socialMediaLinks:addedLinks
            })
          }else{
            delete this.store.newData.socialMediaLinks
          }
          console.log(addedLinks)
        }
      },
      immediate:true, deep:true
    },
    'store.myData':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check === true){
            console.log('mydata',newVal)
            this.checkMyCurrentSocialMediaLinks()
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
