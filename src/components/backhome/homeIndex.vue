<template>
  <div class="backIndex">
    <el-container>
      <el-header>Aromita 后台管理系统</el-header>
      <el-container>
        <el-aside width="250px">
          <el-menu
            :default-active="activeRoute"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router>
            <el-menu-item index="index">
              <i class="el-icon-house"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="page1">用户管理</el-menu-item>
                <el-menu-item index="">角色管理</el-menu-item>
                <el-menu-item index="">权限管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu> -->
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
                <el-menu-item index="/addsku">新增SKU</el-menu-item>
                <el-menu-item index="/addSpu">新增SPU</el-menu-item>
                <el-menu-item index="/coefficient">利润系数</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
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
      this.height = $(window).height() - 60
      var path = this.$route.path.split('/')
      var pathName = path[1]
      console.log('kkkkk', pathName)
      this.activeRoute = '/' + pathName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.heade{
  margin-bottom: 20px;
}
.backIndex{
    display: flex;
}
.el-header, .el-footer {
  background-color: #3c4752;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}
.el-main {
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}
.foot{
  margin-top: 20px;
  text-align: right;
}
</style>
