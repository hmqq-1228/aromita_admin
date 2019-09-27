<template>
  <div class="hello">
    <div class="login_form">
        <el-form label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input type="password" show-password v-model="formLabelAlign.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('formLabelAlign')">立即登录</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import {userLogin} from '@/http/order.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      formLabelAlign:{
        name:'',
        password:''
      },
      rules:{
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    var that = this;
    document.onkeydown = function () {
      var key = window.event.keyCode;
      if (key === 13) {
        that.submitForm('formLabelAlign')
      }
    }
  },
  methods:{
    submitForm(formName){
      var pre = {
        username: this.formLabelAlign.name,
        password: this.formLabelAlign.password
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userLogin(pre).then((res)=>{
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              localStorage.setItem('username',res.data.data)
              this.$router.push({
                path:'/homeIndex'
              })
            } else{
              this.$message.warning(res.data.msg)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style scoped>
.login_form{
  width: 400px;
  height: 400px;
  margin:10% auto;
  border:1px solid #e5e5e5;
  padding:40px;
  box-sizing: border-box;
}
</style>
