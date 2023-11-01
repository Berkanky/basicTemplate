<template>
  <q-card class="bg-transparent text-white">
    <q-card-section class="text-right">
      <q-btn
        icon-right="arrow_right"
        v-on:Click="this.store.selectedOption.id = 4"
        icon="collections_bookmark" no-caps label="Go My Gallery" color="grey-10" size="md" rounded></q-btn>
    </q-card-section>
    <q-card-section class="text-subtitle2">
      CV Settings
    </q-card-section>
    <q-separator size="" color="grey-8"></q-separator>
    <q-card-section>
      <q-card
        bordered
        class="bg-transparent text-white"
      >
        <q-item>
          <q-item-section avatar>
            <q-icon
              :color="this.checkMyCvIfThere() === true ? 'grey' : 'red-4'"
              name="fa-regular fa-file" size="md"></q-icon>
          </q-item-section>
          <q-item-section class="text-capitalize">
            {{ this.currentCv.selectedCvFileName ?? this.currentCv.message ?? 'No File' }}
          </q-item-section>
          <q-item-section>
            <q-btn-dropdown
              :disable="this.checkMyCvIfThere() === true ? false : true"
              dark no-caps flat
              label="CV File Detail"
            >
              <div class="row no-wrap q-pa-md">
                <div class="col-4 text-left">
                  <div class="text-h6 q-mb-md">Details</div>
                  <div class="text-caption">
                    <q-icon name="info" color="grey-8"></q-icon>
                    {{ this.currentCv.selectedCvFileType ?? 'No Info About Type' }}
                  </div>
                  <div class="text-caption">
                    <q-icon name="event" color="grey-8"></q-icon>
                    {{ this.currentCv.selectedCvDate ?? 'No Info About Date' }}
                  </div>
                  <div class="text-caption">
                    <q-icon name="folder" color="grey-8"></q-icon>
                    {{ this.currentCv.selectedCvFileName ?? 'No Info About File Name' }}
                  </div>
                  <q-btn icon="swipe" flat color="grey-8" v-on:click="swipeToOldBackupFiles"></q-btn>
                  <q-btn icon="download" flat color="green-4" v-on:click="downloadCurrentCv"></q-btn>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="col text-center">
                  <q-avatar size="72px">
                   <img
                    v-if="this.myData.userImage || this.store.firebaseData.photoURL"
                    :src="this.myData.userImage ?? this.store.firebaseData.photoURL" alt="">
                    <q-btn icon="person" flat color="grey-8" v-else></q-btn>
                  </q-avatar>

                  <div class="text-subtitle2 q-mt-md q-mb-xs">
                    @
                    {{ this.myData.email ?? '' }}
                  </div>

                  <q-btn
                    color="red-4"
                    label="Close"
                    push
                    flat
                    size="sm"
                    v-close-popup
                  />

                  <q-btn
                    icon="delete_forever"
                    push size="sm" label="Delete CV"
                    color="red-4"
                    class="q-ml-xs"
                    v-on:click="deleteMyCurrentCv"
                  ></q-btn>
                </div>
              </div>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2 q-pa-sm">
        Backup CV Files
      </div>
      <q-card
        v-for="(data,key) in this.myBackupFiles" :key="key"
        class="bg-transparent" flat>
        <q-item>
          <q-item-section avatar>
            <q-btn icon="download" size="md" v-on:click="this.downloadFile(data)"></q-btn>
              <q-btn icon="fa-regular fa-file" size="md"></q-btn>
          </q-item-section>
          <q-item-section>
            {{ data.selectedCvFileName ?? 'No Name' }}
            <q-item-section caption class="text-grey-6">
              {{ data.selectedCvDate ?? '' }}
            </q-item-section>
          </q-item-section>
          <q-item-section avatar>
            <q-btn icon="delete_forever" flat color="red-4"></q-btn>
            <q-btn icon="expand_less" flat  color="white" v-on:click="makeItCurrentCv(data)"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-file
        class="q-mt-sm"
        dark color="white"
        @update:model-value="selectFileFunction"
        v-model="this.selectedCvString" label="Select CV">
          <template v-slot:prepend>
            <q-icon name="folder"></q-icon>
          </template>
          <template v-slot:append>
            <q-btn
              v-on:click="clearCvSelected"
              icon="remove" size="sm" color="red-4" v-if="this.selectedCvString"></q-btn>
          </template>
      </q-file>
    </q-card-section>
    <q-card-section>
      <q-btn
        :disable="this.checkNewSelectedFileForUpdateButton() === true ? false : true"
        color="green-4"
        no-caps label="Update" outline v-on:click="updateProfileFunc"
      ></q-btn>
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
      myData:{},
      currentCv:{},
      selectedCvString:'',
      myBackupFiles:[]
    }
  },
  methods:{
    downloadCurrentCv(){
      const data = this.currentCv
      console.log(data)
      this.downloadFile(data)
    },
    async downloadFile(data){
      const response = await fetch(data.selectedCvFileUrl);
      const blob = await response.blob();

      // Get a string containing the image's URL.
      const objectUrl = URL.createObjectURL(blob);

      // Create an anchor element and use it to download the image.
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = data.selectedCvFileName ?? data.selectedCvDate;
      anchor.click();

      // Remove the object URL from memory.
      URL.revokeObjectURL(objectUrl);
    },
    makeItCurrentCv(data){
      console.log(data)

      ///:firebaseId/makeSelectedCvCurrentCv

      const allBody = {
        currentCv:this.currentCv,
        selectedCv:data
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/makeSelectedCvCurrentCv`, allBody)
        .then(res => {
          console.log(res)
          this.getMyDetailFromDb()
        })
        .catch(err => {
          console.log(err)
        })

    },
    swipeToOldBackupFiles(){
      ///:firebaseId/addToMyOldCvFiles
      const allBody = {
        currentCv:this.currentCv,
      }
      console.log(allBody)
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addToMyOldCvFiles`, allBody)
        .then(res => {
          console.log(res)
          const newData = res.data.getmeagain
          this.getMyDataBackupFiles(newData)

          this.currentCv = {}
          this.myData.selectedCvFile = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyDataBackupFiles(newData){
      const check = newData.hasOwnProperty('backupCvFiles')
      if(check === true){
        this.myBackupFiles = newData.backupCvFiles
      }else{
        this.myBackupFiles = []
      }

      console.log('myBackupFiles',this.myBackupFiles)
    },
    checkMyCvIfThere(){
      const check = this.currentCv.hasOwnProperty('selectedCvFileUrl')
      return check
    },
    deleteFileDBFunc(){
      //selectedCvDate
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/removeMyCV`)
        .then(res => {
          console.log(res)
          this.currentCv = {}
          this.myData.selectedCvFile = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteMyCurrentCv(){
      this.$q.dialog(
        {
          dark:true,
          color:'red-4',
          cancel:true,
          title:'Warning',
          message:'You Sure For Delete  Current CV From The DB ?'
        }
      ).onOk(
        () => {
          this.deleteFileDBFunc()
        }
      )
    },
    clearCvSelected(){
      delete this.store.newData.selectedCvFile
      this.selectedCvString = ''
    },
    checkNewSelectedFileForUpdateButton(){
      const check = this.store.newData.hasOwnProperty('selectedCvFile')
      return check
    },
    updateProfileFunc(){
      this.store.updateProfile()
      this.selectedCvString = ''
    },
    selectFileFunction(val){
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
          Object.assign(newObject,{
            url : reader.result
          })
          const fileNewObjSchema = {
            selectedCvFileUrl:newObject.url,
            selectedCvFileName:newObject.name,
            selectedCvFileType:newObject.type
          }
          Object.assign(this.store.newData,{
            selectedCvFile:fileNewObjSchema
          })
          console.log('newData',this.store.newData)
        };
        reader.readAsDataURL(val);
      }
    },
    getCvFromDb(newData){
      const check = newData.hasOwnProperty('selectedCvFile')
      if(check === true){
        Object.assign(this.currentCv,newData.selectedCvFile)
      }else{
        Object.assign(this.currentCv,{
          message:'No Cv'
        })
      }
      console.log('currentCv',this.currentCv)
    },
    getMyDetailFromDb(){
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.get(`${url}/app/${fid}/getCurrentUser`)
        .then( res => {
          console.log(res)
          this.myData = res.data.currentuser

          const newData = res.data.currentuser
          this.getCvFromDb(newData)
          this.getMyDataBackupFiles(newData)
          console.log('myData',this.myData)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
  },
  watch:{
    'store.myData':{
      handler(newVal){
        if(newVal){
          this.getMyDetailFromDb()
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('uid')
          if(check === true){
            this.getMyDetailFromDb()
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
