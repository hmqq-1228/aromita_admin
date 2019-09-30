<template>
  <div class="addAttr">
    <div class="heade">
      <h3>新增属性和属性值</h3>
    </div>
    <div class="addAttrCenter">
      <el-form label-width="120px" :rules="rules" :model="attrFrom">
        <el-form-item label="属性名称：" prop="attr_name">
          <el-input v-model="attrFrom.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值：" required>
          <div class="attrFromList">
            <div class="attrFromInput">
              <div v-for="(item,index) in attrFrom.attr_value" :key="index" class="attrvaluelist">
                <el-input class="attrvalue" v-model="attrFrom.attr_value[index]"></el-input>
                <i class="el-icon-delete" v-if="index>0" @click="delValue(index)"></i>
              </div>
            </div>
            <div class="attrFromAdd">
              <el-button type="primary" @click="addValue">添加</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="subAttr()">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addAttr} from '@/http/attr.js'
export default {
  data(){
    return{
      attrFrom:{
        attr_name:'',
        attr_value:[""]
      },
      rules:{
        attr_name:[
          { required: true, message:'属性名称必填',trigger: 'blur'}
        ]
      },
      attrid:'',
    }
  },
  created(){
    this.attrid = this.$route.query.id
    if(this.attrid){
      this.attrDetail()
    }
  },
  methods:{
    //添加属性值
    addValue(){
      this.attrFrom.attr_value.push("")
    },
    //删除属性值
    delValue(dex){
      this.attrFrom.attr_value.splice(dex,1);
    },
    //创建属性值
    subAttr(){
      if(this.attrFrom.attr_name == ''){
          this.$message({
            message: '属性名称必填',
            type: 'error'
          });
          return false
      }else{
          var attrValue = this.attrFrom.attr_value
          for(var i in attrValue){
            if(attrValue[i] == ''){
              this.$message({
                message: '属性值必填',
                type: 'error'
              });
              return false
            }
          }
          addAttr(this.attrFrom).then((res)=>{
              if(res.data.code == 200){
                this.$message({
                  message: '创建成功',
                  type: 'success'
                });
                this.$router.push({ path:'/attribute'}) 
              }else{
                this.$message({
                  message:res.data.msg,
                  type: 'error'
                });
              }
          })
      }
    }
  }
}
</script>
<style scope>
.addAttrCenter .el-form{
  width: 400px;
}
.attrFromList{
  display: flex;
}
.attrvaluelist{
  display: flex;
  align-items: center;
}
.el-icon-delete{
  color: red;
  font-size: 16px;
}
.attrvalue{
  width: 280px;
  margin:0 10px 10px 0;
  float: left;
}
</style>
