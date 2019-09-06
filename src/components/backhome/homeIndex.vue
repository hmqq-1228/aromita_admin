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
            active-text-color="#ffd04b">
            <el-menu-item index="index" @click="routerLink('index')">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="page1" @click="routerLink('page1')">用户管理</el-menu-item>
                <el-menu-item index="1-2">角色管理</el-menu-item>
                <el-menu-item index="1-3">权限管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-shopping-bag-1"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="page2" @click="routerLink('page2')">SPU管理</el-menu-item>
                <el-menu-item index="1-2">SKU管理</el-menu-item>
                <el-menu-item index="1-3">商品分类</el-menu-item>
                <el-menu-item index="attribute" @click="routerLink('attribute')">属性管理</el-menu-item>
                <el-menu-item index="1-5">属性值管理</el-menu-item>
                <el-menu-item index="1-6">利润系数</el-menu-item>
                <el-menu-item index="1-7">分类对应关系</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="4">
              <i class="el-icon-shopping-bag-1"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
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
      this.activeRoute = pathName
    },
    routerLink:function (name) {
      var that = this
      switch (name) {
        case 'index':
          that.$router.push('/index')
          break
        case 'page1':
          that.$router.push('/page1')
          break
        case 'page2':
          that.$router.push('/page2')
          break
        case 'attribute':
          that.$router.push('/attribute')
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
