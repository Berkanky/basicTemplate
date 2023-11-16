
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',name:'home', component: () => import('pages/IndexPage.vue') },
      { path:'/login', name:'login',component: () => import('pages/login.vue')},
      { path:'/profile/:id',name:'profile',component:()=>import('pages/profile.vue')},
      { path:'/activityDetail/:id',name:'activityDetail',component:() => import('pages/activityDetail.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
