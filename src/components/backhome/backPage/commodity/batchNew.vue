<template>
    <div 
        class="batchNew" 
        v-loading="loading"
        element-loading-text="正在解析数据，请耐心等待"
        element-loading-spinner="el-icon-loading">
        <div class="heade">
            <h3>批量新建SKU</h3>
        </div>
        <div class="addspuCenter">
            <div class="errormsg">
                <p>{{errorMsg}}</p>
                <p>{{dataMsg}}</p>
            </div>
            <el-form ref="form" :rules="rules" :model="addspuform" label-width="120px">
                <el-form-item label="请输入SKU：" prop="name">
                    <el-input type="textarea" :rows="40" v-model="addspuform.sku_nos" placeholder="SKU以回车键隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addskuSub()">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {batchCreate,batchgetCount} from '@/http/commodity.js'
import qs from 'qs'
export default {
    data(){
        return{
            loading:false,
            errorMsg:'',
            dataMsg:'',
            addspuform:{
                sku_nos:'',
            },
            rules: {
                name: [
                    { required: true, message: '请输入SKU编码', trigger: 'blur,change' }
                ]
            },
            exportPre:{},
            export:null
        }
    },
    mounted() {

    },
    created(){

    },
    methods:{
        //回车符替换
        foo(str){
            var temp = str.split(/[\n,]/g).join(',');
            return temp
        },
        //新建spu
        addskuSub(){ 
            var nos = this.foo(this.addspuform.sku_nos)
            let pre={
                sku_nos:nos
            }
            var attrLength = nos.split(',').length
            if(attrLength>1000){
                this.$message({
                    message:'批量新建数不能超过1000个',
                    type:'warning'
                });
                return false
            }else{
                this.loading = true
                batchCreate(pre).then((res)=>{
                    this.errorMsg = ''
                    this.dataMsg = ''
                    if(res.data.code == 200){
                        this.loading = false
                        this.exportPre={
                            file_id:res.data.data.file_id,
                            count:res.data.data.file_id
                        }
                        this.exportData()
                    }else if(res.data.code == 40002){
                        this.loading = false
                        this.errorMsg = res.data.msg
                        this.dataMsg = res.data.data
                    }else{
                        this.loading = false
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(error => {
                    this.loading = false
                    this.$message({
                        message:'请求失败，请稍后再试',
                        type:'error'
                    });
                })
            }
        },
        //导入数据
        exportData(){
            batchgetCount(this.exportPre).then((res)=>{
                this.loading = true
                if(res.data.status == 1){
                    this.loading = false
                    this.$message({
                        message:'导入成功',
                        type:'success'
                    });
                }
            }).catch(error => {
                this.loading = false
                this.$message({
                    message:'请求失败，请稍后再试',
                    type:'error'
                });
            })
        }
    }
}
</script>
<style scoped>
.addspuCenter .el-textarea{
    width:400px!important;
}
.editBox{
    width: 1200px;
    height: 500px;
}
.addspuCenter .quill-editor{
    width: 1200px!important;
    height: 400px!important;
}
.addspu .el-input{
    width: 300px!important;
}
.batchNew{
    min-height: 100vh;
}
.errormsg{
    font-size: 12px;
    color:red;
    padding-left:50px;
    margin-bottom: 10px;
}
</style>
