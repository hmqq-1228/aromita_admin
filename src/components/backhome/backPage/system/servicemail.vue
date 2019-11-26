<template>
    <div class="servicemail">
        <div class="heade">
            <h3>服务邮件管理</h3>
        </div>
        <el-form :inline="true" :model="emailFrom">
            <el-form-item label="邮件状态">
                <el-select placeholder="请选择" v-model="emailFrom.status" clearable>
                    <el-option label="开启" value="1"></el-option>
                    <el-option label="关闭" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入邮件中文名称" v-model="emailFrom.cn_name" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入邮件英文名称" v-model="emailFrom.en_name" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入发件邮箱" v-model="emailFrom.send_email" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList()">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addEmail">新 建</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="emailData">
            <el-table-column prop="cn_name" label="中文名称"></el-table-column>
            <el-table-column prop="en_name" label="英文名称"></el-table-column>
            <el-table-column prop="send_email" label="发件邮箱"></el-table-column>
            <el-table-column prop="send_rate" label="发件频率"></el-table-column>
            <el-table-column label="邮件状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">开启</span>
                    <span v-if="scope.row.status == 0">关闭</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editList(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {emailList} from '@/http/system.js'
export default {
    data(){
        return{
            emailFrom:{
                status:'',
                cn_name:'',
                en_name:'',
                send_email:''
            },
            //邮箱列表
            emailData:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //搜索
        searchList(){
            this.getList()
        },
        //获取邮箱列表
        getList(){
            emailList(this.emailFrom).then((res)=>{
                if(res.data.code ==200){
                    this.emailData = res.data.data
                }
            })
        },
        //新建邮箱
        addEmail(){
            this.$router.push({path:'/addEmail'})
        },
        //编辑邮箱
        editList(id){
            this.$router.push({path:'/addEmail',query:{id:id}})
        }
    }
}
</script>
<style scoped>

</style>