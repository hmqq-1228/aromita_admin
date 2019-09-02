<template>
  <div class="hello">
    <div class="login_form">
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="用户名：">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="formLabelAlign.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login()">登陆</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      formLabelAlign:{
        name:'',
        password:''
      }
    }
  },
  methods:{
    login(){
      this.$router.push({
        path:'/homeIndex'
      })
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
