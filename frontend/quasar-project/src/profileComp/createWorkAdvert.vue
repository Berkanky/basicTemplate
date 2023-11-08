<template>
  <q-card class="bg-transparent text-white" flat>
    <q-card-section class="text-right">
      <q-btn
        v-on:click="this.store.selectedOption.id = this.store.selectedOption.id - 1"
        rounded
        icon-right="arrow_left"
        icon="location_on" no-caps label="Go Location Settings" color="grey-10"></q-btn>
    </q-card-section>
    <q-card-section class="text-subtitle2">
      Create Advert
    </q-card-section>
    <q-card-section>
      <q-card class="bg-transparent text-white" bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="70px">
              <img
                style="object-fit:cover;"
                :src="this.store.myData.userImage ?? this.store.firebaseData.photoURL ??  this.store.defaultPhoto" alt="">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-btn
              v-on:click="this.store.createActivityDialogActive = true"
              class="q-pa-sm"
              color="grey-9"
              icon="filter_list"
              no-caps label="Create Post"
              rounded></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <q-card-section class="row">
      <q-btn icon="list" flat label="My Adverts" no-caps></q-btn>
      <q-space></q-space>
      <q-btn
        color="white" text-color="dark"
        :label="this.store.myAdverts.length " round></q-btn>
    </q-card-section>
    <q-card-section>
      <q-scroll-area
        style="height:500px;width:100%;"
      >
      <q-card
        v-for="(data,key) in this.store.myAdverts" :key="key"
        class="bg-transparent text-white" flat bordered>
        <q-item clickable>
          <q-item-section avatar>
            <q-avatar size="70px" v-on:click="goActivity(data)">
              <img :src="data.activityImage" alt="" style="object-fit:cover;">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ data.activityName ?? '' }}
            <q-item-section caption class="text-weight-bold text-grey-6 text-caption row">
              <q-icon name="info"></q-icon>
              {{ data.description ?? '' }}
            </q-item-section>
          </q-item-section>
          <q-item-section>
            <q-btn flat icon="info" v-on:click="getDetail(data)">
              <q-menu v-if="this.store.checkselectedUserDetail()">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Informations</div>
                    <div class="text-subtitle2 text-grey-7">
                      Name : {{ this.store.selectedUserDetail.name ?? this.store.selectedUserDetail.displayName ?? '' }}
                    </div>
                    <div class="text-subtitle2 text-grey-7">
                      {{ this.store.selectedUserDetail.active === true ? 'Online' : this.store.selectedUserDetail.lastLoginDate }}
                    </div>
                  </div>
                  <q-separator vertical inset class="q-mx-lg" />
                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img
                        style="object-fit:cover;"
                        :src="this.store.selectedUserDetail.userImage ?? this.store.selectedUserDetail.googleImage">
                    </q-avatar>
                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                      {{ this.store.selectedUserDetail.email ? `@${this.store.selectedUserDetail.email}`  :  '@' }}
                    </div>
                    <q-btn
                      color="red-4"
                      label="Close"
                      flat
                      size="sm"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn
              icon="edit" flat color="white" v-on:click="updateActive(data._id)"
            ></q-btn>
            <q-btn icon="delete_forever" flat color="red-4" v-on:click="deleteMyAdvert(data._id)"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-scroll-area>
    </q-card-section>
    <createActivityVue v-if="this.store.createActivityDialogActive"/>
    <updateActivity
      :selectedAdvertDetail="this.selectedAdvertDetail"
      v-if="this.store.updateActivityDialogActive"/>
  </q-card>
</template>

<script>
import updateActivity from 'src/createAdvertComps/updateActivity.vue';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
import createActivityVue from 'src/createAdvertComps/createActivity.vue';
export default {
  components:{
    createActivityVue,
    updateActivity
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      options:[],
      selectedAdvertDetail:{}
    }
  },
  methods:{
    updateActive(id){
      console.log(id)
      Object.assign(this.selectedAdvertDetail,{
        id:id
      })

      this.store.updateActivityDialogActive = true
    },
    goActivity(data){
      this.$q.dialog(
        {
          dark:true,
          title:'Warning',
          message:'Are You Sure for Continue Detail for Selected Activity ?',
          cancel:true
        }
      ).onOk(
        () => {
          this.$router.push(
            {
              path:`/activityDetail/${data._id}`,
              params:{id:data._id}
            }
          )
        }
      )
    },
    getDetail(data){
      const id = data.advertAdminFirebaseId
      this.store.getSelectedUserDetail(id)
    },
    deleteMyAdvert(id){
        ///:firebaseId/:selectedAdvertId/removeSelectedAdvert
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/${id}/removeSelectedAdvert`)
        .then(res => {
          console.log(res)
          this.store.myAdverts = this.store.myAdverts.filter(
            object => object._id !== id
          )
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    this.$watch('store.firebaseData',(newVal) => {
      const check = newVal.hasOwnProperty('uid')
      if(check === true){
        this.store.getMyDetailFromDb()
        const firebaseId = newVal.uid
        this.store.getMyAdverts(firebaseId)
      }
    },
    {
      immediate:true, deep:true
    })
  },
  watch:{
    $route:{
      handler(to,from){
        //this.store.getMyDetailFromDb()
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
