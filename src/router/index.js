import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: {
      name: "Home"
    }
  },
  {
    path: "/Home",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/PointTable",
    name: "PointTable",
    component: resolve => require(['../views/PointTable/index.vue'], resolve),
  },
  {
    path: "/AddPoint",
    name: "AddPoint",
    component: resolve => require(['../views/AddPoint.vue'], resolve),
  },
  {
    path: "/Abstract/:id",
    name: "Abstract",
    component: resolve => require(['../views/AbstractView.vue'], resolve),
  },
  {
    path: "/UserTable",
    name: "UserTable",
    component: resolve => require(['../views/UserTable/index.vue'], resolve),
  },
  {
    path: "/AbstractTable",
    name: "AbstractTable",
    component: resolve => require(['../views/AbstractTable/index.vue'], resolve),
  },
  {
    path: "/UserDetail/:id",
    name: "UserDetail",
    component: resolve => require(['../views/UserTable/Detail.vue'], resolve),
  },
  {
    path: "/PointDetail/:id",
    name: "PointDetail",
    component: resolve => require(['../views/PointTable/Detail.vue'], resolve),
  },
  {
    path: "/UserEdit/:id",
    name: "UserEdit",
    component: resolve => require(['../views/UserTable/Edit.vue'], resolve),
  },
  {
    path: "/PointEdit/:id",
    name: "PointEdit",
    component: resolve => require(['../views/PointTable/Edit.vue'], resolve),
  },
  {
    path: "/AbstractEdit/:id",
    name: "AbstractEdit",
    component: resolve => require(['../views/AbstractTable/Edit.vue'], resolve),
  },
  {
    path: "/PickPoint",
    name: "PickPoint",
    component: resolve => require(['../views/PickPoint.vue'], resolve),
  },
  {
    path: "/AbstractImageEdit/:id",
    name: "AbstractImageEdit",
    component: resolve => require(['../views/AbstractTable/ImageEdit.vue'], resolve),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router