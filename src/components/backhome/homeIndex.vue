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
              <el-submenu index="0">
                <template slot="title">
                  <span>Aromita后台管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item @click="outLogin()">退出</el-menu-item>
                  <el-menu-item @click="updateUserPass()">修改密码</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu v-for="(item,index) in menuList" :index="String(item.id)" :key="index">
                <template slot="title" v-if="item.parent_id == 0">
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(item1,index1) in item.children" :index="item1.url" :key="index1">{{item1.name}}</el-menu-item>
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
    <el-dialog
        title="修改密码"
        :visible.sync="passVisible"
        width="300px">
        <el-form :model="passform" :rules="rules" ref="passform">
          <el-form-item label="旧密码：" prop="password">
              <el-input type="password" v-model="passform.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newpassword">
              <el-input type="password" v-model="passform.newpassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="newpassword_confiramation">
              <el-input type="password" v-model="passform.newpassword_confiramation"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUserPassSub('passform')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {updatepass} from '@/http/home.js'
export default {
  data () {
    return {
      height: '',
      activeRoute: 'index',
      menulist:[],
      passVisible:false,
      passform:{
        password:'',
        newpassword:'',
        newpassword_confiramation:''
      },
      rules:{
        password:[
          {required: true, message: '密码必填', trigger: 'blur'},
        ],
        newpassword:[
          {required: true, message: '新密码必填', trigger: 'blur'},
        ],
        newpassword_confiramation:[
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
        ]
      }
    }
  },
  watch:{

  },
  created(){
    this.getScreenHeight()
    var menuList = JSON.parse(localStorage.getItem("menuList"))
    if(menuList){
      console.log(menuList)
      var fristAttr = []
      var childList = []
      for(var i=0;i<menuList.length;i++){
          var obj = menuList[i]
          if(obj.parent_id == 0){
              fristAttr.push(obj)
          }else{
              childList.push(obj)
          }
      }
      for(var i=0;i<fristAttr.length;i++){
          var obj = childList.filter(n=>n.parent_id == fristAttr[i].id)
          fristAttr[i]["children"] = obj
      }
      this.menuList = fristAttr
      console.log(this.menuList)
    }else{
      this.$message.warning("登录已过期，请重新登录")
      this.$router.push('/')
    }
  },
  methods:{
    //修改密码
    updateUserPass(){
        this.passVisible = true;
    },
    //修改密码
    updateUserPassSub(form){
      this.$refs[form].validate((valid) => {
          if(valid){
              updatepass(this.passform).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                      type:'success',
                      message:"修改成功，请重新登录"
                    })
                    this.$router.push('/')
                }else{
                    this.$message({
                      type:'error',
                      message:res.data.msg
                    })
                }
              })
          }
      })
    },
    //退出登录
    outLogin () {
      this.$confirm('此操作将退出该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.$axios.post('backend/admin/loginout',{}).then((res)=>{
            if (res.data.code === 200) {
              this.$router.push('/')
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
