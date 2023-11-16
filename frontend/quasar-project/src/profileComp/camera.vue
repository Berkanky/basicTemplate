<template>
  <q-dialog
    v-model="this.store.cameraDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      class="bg-dark text-white"
      :style="{
        width: this.store.mobileActive ? '100%' : '600px',
        'max-width': this.store.mobileActive ? '100%' : '600px',
        'border-radius': this.store.mobileActive ? '0px' : '15px',
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="grey-4" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn-dropdown
          :disable="this.myImageList.length > 0 ? false : true"
          flat color="white" @click="onMainClick">
          <q-list>
            <q-item
              v-for="(data,key) in this.cameraOptions" :key="key"
              clickable v-close-popup @click="selectCameraOption(data)">
              <q-item-section avatar>
                <q-avatar :icon="data.icon" color="dark" text-color="white"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{data.label}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="grey-8" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
      <q-separator color="grey-7"></q-separator>
      <q-card-section>
        <q-btn
          v-if="!this.isCameraOpen"
          class="full-width"
          outline
          icon="camera"
          label="Open Web Camera"
          no-caps
          color="green-4"
          v-on:click="openCamera"
        ></q-btn>
        <q-btn
          class="full-width"
          icon="cancel"
          color="red-4"
          no-caps
          outline
          v-on:click="openCamera"
          v-else
          label="Close Web Camera"
        ></q-btn>
      </q-card-section>

      <q-card-section class="text-center">
        <div
          style=""
          v-if="isCameraOpen"
          v-show="!isLoading"
          class="camera-box"
          :class="{ flash: isShotPhoto }"
        >
          <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>

          <video
            style=""
            v-show="!isPhotoTaken"
            ref="camera"
            :height="337.5"
            autoplay
          ></video>
          <canvas
            v-show="isPhotoTaken"
            id="photoTaken"
            ref="canvas"
            :width="450"
            :height="337.5"
          ></canvas>
        </div>
        <div v-if="!this.isCameraOpen" class="text-center q-pa-md">
          <q-spinner-cube color="green-4" size="8.5em" />
        </div>
        <q-card-section v-if="isCameraOpen && !isLoading" class="row">
          <q-btn
            outline
            icon="camera"
            color="grey-6"
            class="col"
            size="md"
            v-on:Click="takePhoto"
          >
            <q-tooltip> Shot Photo </q-tooltip>
          </q-btn>
          <q-btn
            id="downloadPhoto"
            download="my-photo.jpg"
            outline
            v-if="this.isPhotoTaken && this.isCameraOpen"
            color="green-4"
            icon="download"
            class="col"
            size="md"
            v-on:click="downloadImage"
          >
            <q-tooltip> Download Image </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card-section>

      <q-card-section class="row">

        <q-avatar
          style="border:4px solid grey;"
          size="150px"
          class="bg-transparent q-mr-sm"
          v-if="this.currentImage.imageUrl">
          <img
            style="object-fit:cover;"
            :src="this.currentImage.imageUrl" alt="">
        </q-avatar>

        <q-card
          style="height: 150px"
          flat
          class="col-12 col-md-4 col-sm-4 q-mt-xs q-pa-xs bg-transparent"
          v-for="(data, key) in this.myImageList"
          :key="key"
        >
          <q-img class="" style="object-fit: Cover; height: 100%" :src="data.url">
            <div class="absolute-center full-width text-center">
              <q-btn
                v-on:click="removeImage(data)"
                size="sm"
                icon="fa-solid fa-remove"
                outline
                round
                color="white"
              ></q-btn>
            </div>
          </q-img>
        </q-card>
        <q-card
          bordered
          v-if="this.myImageList.length"
          style="height: 150px"
          class="col-12 col-md-4 col-sm-4 bg-dark q-mt-xs"
        >
          <q-btn
            v-on:click="addSelectedImages"
            size="xl"
            icon="add"
            color="green-4"
            flat
            class="full-width full-height"
          ></q-btn>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useCounterStore } from "src/stores/store";
export default {
  setup() {
    const store = useCounterStore();
    return {
      store,
    };
  },
  data: function () {
    return {
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: "#",
      myImageList: [],
      currentImage:{},
      cameraOptions: [
        {id:1, label:'Select Image For Update Profile Picture', icon:'person'},
        {id:2,label:'Clear All Images And Changes', icon:'clear_all'}
      ],
    };
  },
  methods: {
    updateCurrentImageData(imageData){

      const newImageData = imageData

      Object.assign(newImageData,{
        imageUrl:imageData.url
      })
      this.currentImage = newImageData
      console.log('currentImageData',this.currentImage)
    },
    selectCameraOption(data){
      if(data.id === 1){
        Object.assign(this.store.newData,{
          userImage:this.currentImage.imageUrl ?? this.currentImage.url
        })

        this.store.cameraDialogActive = false
        this.myImageList = []

      }else if(data.id === 2){
        this.myImageList = []
        this.currentImage = {}
      }
    },
    addSelectedImagesToDb(){
      const allBody = {
        newAddedImages:this.myImageList
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addImages`, allBody)
        .then(res => {
          console.log('addImages',res)
          this.store.getMyDetailFromDb()
          this.myImageList = []
          this.currentImage = {}

          this.store.cameraDialogActive = false
        })
        .catch(er => {
          console.log(er)
        })
    },
    addSelectedImages() {
      this.$q.dialog(
        {
          dark:true,
          cancel:true,
          color:'red-4',
          title:'Warning',
          message:'Selected Images Will Be Added To DB If You Continue !'
        }
      ).onOk(
        () => {
          this.addSelectedImagesToDb()
        }
      )
    },
    removeImage(data) {
      this.myImageList = this.myImageList.filter(
        (object) => object.imageKey !== data.imageKey
      );
    },
    createCameraElement() {
      this.isLoading = true;
      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(stream);
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },
    closeAll() {
      this.isCameraOpen = false;
      this.isPhotoTaken = false;
      this.isShotPhoto = false;
      this.stopCameraStream();
    },
    openCamera() {
      if (this.isCameraOpen) {
        this.closeAll();
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },
    goBack() {
      this.store.cameraDialogActive = !this.store.cameraDialogActive;
    },
    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);

      const imageData = {};
      const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg");
      //console.log(canvas)
      Object.assign(imageData, {
        imageId: uuidv4(),
        url: canvas,
        imageKey: uuidv4(),
      });
      this.myImageList.push(imageData);
      this.updateCurrentImageData(imageData)
      console.log(imageData);
    },
    async downloadImageFunction(imageData){
      const response = await fetch(imageData.url);
      const blob = await response.blob();

      // Get a string containing the image's URL.
      const objectUrl = URL.createObjectURL(blob);

      // Create an anchor element and use it to download the image.
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'image.png';
      anchor.click();
      // Remove the object URL from memory.
      URL.revokeObjectURL(objectUrl);
    },
    downloadImage() {
      this.$q
        .dialog({
          dark: true,
          cancel: true,
          title: "Warning",
          message: "Are Sure For Download Current Image ? ",
          fullHeight: this.store.mobileActive ? true : false,
          maximized: this.store.mobileActive ? true : false,
        })
        .onOk(() => {
          const imageData = {};
          const download = document.getElementById("downloadPhoto");
          const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg");
          //console.log(canvas)
          Object.assign(imageData, {
            url: canvas,
          });
          this.downloadImageFunction(imageData)
          console.log(imageData);
        })
        .onCancel(() => {
          //
        });
    },
  },
  created() {
    this.isCameraOpen = true;
    this.createCameraElement();
    const video = document.querySelector("video");
    if (video) {
      console.log("video.hasAttribute", video.hasAttribute("border-radius")); // true veya false döndürür
    }
  },
  watch: {
    myImageList: {
      handler(newVal) {
        if (newVal) {
          console.log("watch myImagesList", this.myImageList);
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style>
.camera-box video {
  border-radius: 4px !important;
}

.camera-box canvas {
  border-radius: 4px !important;
}
</style>
