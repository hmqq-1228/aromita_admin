import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'

//后台首页
import BackIndex from '@/components/backhome/homeIndex.vue'
import Index from '@/components/backhome/index.vue'

// 属性管理
import attribute from '@/components/backhome/backPage/attribute/attribute.vue'
import addAttr from '@/components/backhome/backPage/attribute/addAttr.vue'
import coefficient from '@/components/backhome/backPage/attribute/coefficient.vue'
//分类管理
import categoryList from '@/components/backhome/backPage/category/categoryList.vue'
import classification from '@/components/backhome/backPage/category/classification.vue'

//商品管理
import commodity from '@/components/backhome/backPage/commodity/commodity.vue'
import commodityhand from '@/components/backhome/backPage/commodity/commodityhand.vue'
import addsku from '@/components/backhome/backPage/commodity/addSku.vue'
import addSpu from '@/components/backhome/backPage/commodity/addSpu.vue'

Vue.use(Router)
export default new Router({
  routes: [
    //登陆页
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/homeIndex',
      redirect:'/index',
      name: 'BackIndex',
      component: BackIndex,
      children:[
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        //属性管理
        {
          path: '/addAttr',
          name: 'addAttr',
          component: addAttr
        },
        {
          path: '/attribute',
          name: 'attribute',
          component: attribute
        },
        {
          path: '/coefficient',
          name: 'coefficient',
          component: coefficient
        },
        //分类管理
        {
          path: '/categoryList',
          name: 'categoryList',
          component: categoryList
        },
        //分类对应关系列表
        {
          path: '/classification',
          name: 'classification',
          component: classification
        },
        //带上货商品管理
        {
          path: '/commodity',
          name: 'commodity',
          component: commodity
        },
        {
          path: '/commodityhand',
          name: 'commodityhand',
          component: commodityhand
        },
        {
          path: '/addSku',
          name: 'addsku',
          component: addsku
        },
        {
          path: '/addSpu',
          name: 'addSpu',
          component: addSpu
        },
      ]
    }
  ]
})
