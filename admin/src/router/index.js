import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import("../views/Login.vue")

  },
  {
    path: '/home',
    name: 'home',
    component: ()=>import("../views/Home.vue"),
    redirect:'/findPerson',
    children:[
      {
        path:'/findPerson',
        name:'findPerson',
        component: ()=>import("../views/FindPerson.vue")
      },
      {
        path:'/findGoods',
        name:'findGoods',
        component: ()=>import("../views/FindGoods.vue")
      },
      {
        path:'/User',
        name:'User',
        component: ()=>import("../views/User.vue")
      },
      {
        path:'/Admin',
        name:'Admin',
        component: ()=>import("../views/Admin.vue")
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
