import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
//后台首页
import BackIndex from '@/components/backhome/homeIndex.vue'
import Index from '@/components/backhome/index.vue'
import page1 from '@/components/backhome/backPage/page/page1.vue'
import page2 from '@/components/backhome/backPage/page/page2.vue'
import attribute from '@/components/backhome/backPage/page/attribute.vue'
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
        {
          path: '/page1',
          name: 'page1',
          component: page1
        },
        {
          path: '/page2',
          name: 'page2',
          component: page2
        },
        {
          path: '/attribute',
          name: 'attribute',
          component: attribute
        },
      ]
    }
  ]
})
