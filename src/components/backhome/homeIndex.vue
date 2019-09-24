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
              <el-menu-item index="index">
                <span slot="title">Aromita 后台管理系统</span>
              </el-menu-item>
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
                  <span>分类管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/categoryList">分类列表</el-menu-item>
                  <el-menu-item index="/classification">分类对应关系列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-shopping-bag-1"></i>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/commodity">待上货商品管理</el-menu-item>
                  <el-menu-item index="/commodityhand">已上货商品管理</el-menu-item>
                  <!-- <el-menu-item index="/addsku">新增SKU</el-menu-item>
                  <el-menu-item index="/addSpu">新增SPU</el-menu-item> -->
                  <el-menu-item index="/coefficient">利润系数</el-menu-item>
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
