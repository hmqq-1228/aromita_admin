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

// 客户管理
import customerList from '@/components/backhome/backPage/customer/customerList.vue'
import pointsDetail from '@/components/backhome/backPage/customer/pointsDetail.vue'
import suggestions from '@/components/backhome/backPage/customer/suggestions.vue'

//商品管理
import commodity from '@/components/backhome/backPage/commodity/commodity.vue'
import commodityhand from '@/components/backhome/backPage/commodity/commodityhand.vue'
import addsku from '@/components/backhome/backPage/commodity/addSku.vue'
import addSpu from '@/components/backhome/backPage/commodity/addSpu.vue'
import skuDetail from '@/components/backhome/backPage/commodity/skuDetail.vue'
import spuskulist from '@/components/backhome/backPage/commodity/spuskulist.vue'
import setPictures from '@/components/backhome/backPage/commodity/setPictures.vue'
import batchNew from '@/components/backhome/backPage/commodity/batchNew.vue'
import attributeOrder from '@/components/backhome/backPage/commodity/attributeOrder.vue'
import scenetags from '@/components/backhome/backPage/commodity/scenetags.vue'

//订单管理
import orderList from '@/components/backhome/backPage/order/orderList.vue'
import orderDetail from '@/components/backhome/backPage/order/orderDetail.vue'
import cancelOrder from '@/components/backhome/backPage/order/cancelOrder.vue'
import cancelorderDetail from '@/components/backhome/backPage/order/cancelorderDetail.vue'

//首页管理
import banner from '@/components/backhome/backPage/homeManagement/banner.vue'
import collections from '@/components/backhome/backPage/homeManagement/collections.vue'
import collections2 from '@/components/backhome/backPage/homeManagement/collections2.vue'
import bestSeller from '@/components/backhome/backPage/homeManagement/bestSeller.vue'
import hotstyle from '@/components/backhome/backPage/homeManagement/hotstyle.vue'
import newArrivals from '@/components/backhome/backPage/homeManagement/newArrivals.vue'
import footerShere from '@/components/backhome/backPage/homeManagement/footerShere.vue'
import serveMethod from '@/components/backhome/backPage/homeManagement/serveMethod.vue'
import payMethod from '@/components/backhome/backPage/homeManagement/payMethod.vue'
import loginRegerster from '@/components/backhome/backPage/homeManagement/loginRegerster.vue'
import settings from '@/components/backhome/backPage/homeManagement/settings.vue'
import copyright from '@/components/backhome/backPage/homeManagement/copyright.vue'

//运营活动
import coupon from '@/components/backhome/backPage/operation/coupon.vue'
import addcoupon from '@/components/backhome/backPage/operation/addcoupon.vue'
import hotword from '@/components/backhome/backPage/operation/hotword.vue'
import linkword from '@/components/backhome/backPage/operation/linkword.vue'
import newlink from '@/components/backhome/backPage/operation/newlink.vue'
//广告管理
import advertising from '@/components/backhome/backPage/operation/advertising.vue'
import floatwinone from '@/components/backhome/backPage/operation/floatwinone.vue'
import floatwintwo from '@/components/backhome/backPage/operation/floatwintwo.vue'
//活动模块
import activeList from '@/components/backhome/backPage/operation/activeList.vue'
import addActive from '@/components/backhome/backPage/operation/addActive.vue'
import renovation from '@/components/backhome/backPage/operation/renovation.vue'
import setCommodity from '@/components/backhome/backPage/operation/setCommodity.vue'
import activedetial from '@/components/backhome/backPage/operation/activedetial.vue'

//权限管理
import jurisdiction from '@/components/backhome/backPage/jurisdiction/jurisdiction.vue'
import role from '@/components/backhome/backPage/jurisdiction/role.vue'
import authority from '@/components/backhome/backPage/jurisdiction/authority.vue'

//日志管理
import journal from '@/components/backhome/backPage/journal/journal.vue'
import journaldetail from '@/components/backhome/backPage/journal/journaldetail.vue'

//系统设置
import system from '@/components/backhome/backPage/system/system.vue'
import screening from '@/components/backhome/backPage/system/screening.vue'

//售后设置
import aftersale from '@/components/backhome/backPage/system/aftersale.vue'

//邮箱服务设置
import servicemail from '@/components/backhome/backPage/system/servicemail.vue'
import addEmail from '@/components/backhome/backPage/system/addEmail.vue'

//售后列表
import afterlist from '@/components/backhome/backPage/afterSale/afterList.vue'
import aftersaledetail from '@/components/backhome/backPage/afterSale/aftersaledetail.vue'

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
        //活动管理
        {
          path: '/activeList',
          name: 'activeList',
          component: activeList
        },
        {
          path: '/activedetial',
          name: 'activedetial',
          component: activedetial
        },
        {
          path: '/addActive',
          name: 'addActive',
          component: addActive
        },
        {
          path: '/renovation',
          name: 'renovation',
          component: renovation
        },
        //添加活动商品
        {
          path: '/setCommodity',
          name: 'setCommodity',
          component: setCommodity
        },
        //广告管理 
        {
          path: '/advertising',
          name: 'advertising',
          component: advertising
        },
        {
          path: '/floatwinone',
          name: 'floatwinone',
          component: floatwinone
        },
        {
          path: '/floatwintwo',
          name: 'floatwintwo',
          component: floatwintwo
        },
        //售后管理
        {
          path: '/afterlist',
          name: 'afterlist',
          component: afterlist
        },
        {
          path: '/aftersaledetail',
          name: 'aftersaledetail',
          component: aftersaledetail
        },
        //日志管理
        {
          path: '/journal',
          name: 'journal',
          component: journal
        },
        {
          path: '/journaldetail',
          name: 'journaldetail',
          component: journaldetail
        },
        //系统设置
        {
          path: '/system',
          name: 'system',
          component: system
        },
        {
          path: '/screening',
          name: 'screening',
          component: screening
        },
        //售后服务
        {
          path: '/aftersale',
          name: 'aftersale',
          component: aftersale
        },
        //服务邮件设置
        {
          path: '/servicemail',
          name: 'servicemail',
          component: servicemail
        },
        {
          path: '/addEmail',
          name: 'addEmail',
          component: addEmail
        },
        //权限管理
        {
          path: '/jurisdiction',
          name: 'jurisdiction',
          component: jurisdiction
        },
        {
          path: '/role',
          name: 'role',
          component: role
        },
        {
          path: '/authority',
          name: 'authority',
          component: authority
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
        //客户管理
        {
          path: '/customerList',
          name: 'customerList',
          component: customerList
        },
        {
          path: '/pointsDetail',
          name: 'pointsDetail',
          component: pointsDetail
        },
        {
          path: '/suggestions',
          name: 'suggestions',
          component: suggestions
        },
        //待上货商品管理
        {
          path: '/commodity',
          name: 'commodity',
          component: commodity
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
        {
          path: '/skuDetail',
          name: 'skuDetail',
          component: skuDetail
        },
        {
          path: '/spuskulist',
          name: 'spuskulist',
          component: spuskulist
        },
        //批量新建sku
        {
          path: '/batchNew',
          name: 'batchNew',
          component: batchNew
        },
        //属性排序 
        {
          path: '/attributeOrder',
          name: 'attributeOrder',
          component: attributeOrder
        },
        //标签列表
        {
          path: '/scenetags',
          name: 'scenetags',
          component: scenetags
        },
        //设置图片
        {
          path:'/setPictures',
          name:'setPictures',
          component:setPictures
        },
        //已上货商品管理
        {
          path: '/commodityhand',
          name: 'commodityhand',
          component: commodityhand
        },
        //订单管理模块
        {
          path: '/orderList',
          name: 'orderList',
          component: orderList
        },
        {
          path: '/orderDetail',
          name: 'orderDetail',
          component: orderDetail
        },
        //取消订单列表
        {
          path: '/cancelOrder',
          name: 'cancelOrder',
          component: cancelOrder
        },
        {
          path: '/cancelorderDetail',
          name: 'cancelorderDetail',
          component: cancelorderDetail
        },
        //首页管理
        {
          path: '/banner',
          name: 'banner',
          component: banner
        },
        {
          path: '/collections',
          name: 'collections',
          component: collections
        },
        {
          path: '/collections2',
          name: 'collections2',
          component: collections2
        },
        {
          path: '/bestSeller',
          name: 'bestSeller',
          component: bestSeller
        },
        {
          path: '/hotstyle',
          name: 'hotstyle',
          component: hotstyle
        },
        {
          path: '/newArrivals',
          name: 'newArrivals',
          component: newArrivals
        },
        {
          path: '/footerShere',
          name: 'footerShere',
          component: footerShere
        },
        {
          path: '/serveMethod',
          name: 'serveMethod',
          component: serveMethod
        },
        {
          path: '/payMethod',
          name: 'payMethod',
          component: payMethod
        },
        {
          path: '/loginRegerster',
          name: 'loginRegerster',
          component: loginRegerster
        },
        {
          path: '/settings',
          name: 'settings',
          component: settings
        },
        {
          path: '/copyright',
          name: 'copyright',
          component: copyright
        },
        //运营活动
        {
          path: '/coupon',
          name: 'coupon',
          component: coupon
        },
        {
          path: '/addcoupon',
          name: 'addcoupon',
          component: addcoupon
        },
        //热搜词
        {
          path: '/hotword',
          name: 'hotword',
          component: hotword
        },
        //链接词 
        {
          path: '/linkword',
          name: 'linkword',
          component: linkword
        },
        {
          path: '/newlink',
          name: 'newlink',
          component: newlink
        }
      ]
    }
  ]
})

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
