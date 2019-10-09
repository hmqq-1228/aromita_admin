<template>
  <div class="backIndex">
    <el-container>
      <el-container>
        <div class="left_menu">
          <el-aside width="180px">
            <el-menu
              :default-active="activeRoute"
              class="el-menu-vertical-demo"
              background-color="#003764"
              text-color="#fff"
              active-text-color="#ffd04b"
              router>
              <!--<el-menu-item index="index">-->
                <!--<span slot="title">Aromita 后台管理系统</span>-->
              <!--</el-menu-item>-->
              <el-submenu index="0">
                <template slot="title">
                  <!--<i class="el-icon-s-grid"></i>-->
                  <span>Aromita后台管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item @click="outLogin()">退出</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!--<div class="loginOut">-->
                <!--<div style="width: 40px;margin: 0 auto;" title="退出" @click="outLogin()"><i class="el-icon-right"></i></div>-->
              <!--</div>-->
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-s-grid"></i>
                  <span>属性管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/attribute">属性列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-files"></i>
                  <span>类别管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/categoryList">类别列表</el-menu-item>
                  <el-menu-item index="/classification">类别对应关系设置</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-shopping-bag-1"></i>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/commodity">待上货商品管理</el-menu-item>
                  <el-menu-item index="/commodityhand">已上货SPU管理</el-menu-item>
                  <el-menu-item index="/coefficient">利润系数设置</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span>订单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/orderList">订单列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-user"></i>
                  <span>客户管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/customerList">客户列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="6">
                <template slot="title">
                  <i class="el-icon-picture-outline"></i>
                  <span>首页管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/banner">Banner设置</el-menu-item>
                  <el-menu-item index="/collections">Collections主图</el-menu-item>
                  <el-menu-item index="/collections2">Collections副图</el-menu-item>
                  <el-menu-item index="/bestSeller">Best Seller设置</el-menu-item>
                  <el-menu-item index="/newArrivals">New Arrivals设置</el-menu-item>
                  <el-menu-item index="/hotstyle">Hot Style设置</el-menu-item>
                  <el-menu-item index="/loginRegerster">登录注册设置</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="7">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>底部管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/footerShere">底部社交设置</el-menu-item>
                  <el-menu-item index="/serveMethod">特色服务设置</el-menu-item>
                  <el-menu-item index="/payMethod">支付方式设置</el-menu-item>
                  <el-menu-item index="/settings">网站功能设置</el-menu-item>
                  <el-menu-item index="/copyright">版权信息设置</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="8">
                <template slot="title">
                  <i class="el-icon-s-ticket"></i>
                  <span>运营活动</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/coupon">优惠券列表</el-menu-item>
                  <el-menu-item index="/addcoupon">新建优惠券</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
        </div>
        <el-main class="cont" :style="'height:' + height + 'px' ">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: '',
      activeRoute: 'index'
    }
  },
  watch:{

  },
  created(){
    this.getScreenHeight()
  },
  methods:{
    outLogin () {
      var that = this
      that.$confirm('此操作将退出该系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.post('backend/admin/loginout',{}).then((res)=>{
          if (res.data.code === 200) {
            that.$router.push('/')
          }
        })
      }).catch(() => {
        return false
      });
    },
    getScreenHeight:function () {
      this.height = $(window).height() - 40
      var path = this.$route.path.split('/')
      var pathName = path[1]
      this.activeRoute = '/' + pathName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-menu{
  border-right: 0!important;
}
.loginOut{
  text-align: center;
  color: #fff;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
}
.loginOut:hover{
  color: #ffd04b;
}
.el-submenu .el-menu-item{
  min-width: 180px!important;
  text-align: left !important;
}
.el-submenu{
  text-align: left !important;
}
.el-menu-item-group__title{
  padding: 0 !important;
}
.left_menu{
    width: 180px;
    min-height: 100vh;
    background: #003764;
}
.heade{
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.heade h3{
    margin-right: 20px;
}
.backIndex{
    display: flex;
}
/* 分页样式 */
.pagination{
  margin:20px 0 0 0;
  text-align: right;
}
</style>
