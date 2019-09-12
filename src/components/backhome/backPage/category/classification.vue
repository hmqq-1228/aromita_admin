<template>
    <div class="classification">
        <div class="heade">
            <h3>分类对应关系列表</h3>
        </div>
        <el-table :data="List" border style="width: 100%" max-height="700">	
            <el-table-column prop="erp_cat_id" label="ERP分类ID"></el-table-column>
            <el-table-column prop="erp_cat_name" label="ERP分类名称"></el-table-column>
            <el-table-column prop="web_first_name" label="网站一级分类名称"></el-table-column>
            <el-table-column prop="web_first_id" label="网站一级分类ID"></el-table-column>
            <el-table-column prop="web_sec_name" label="网站二级分类名称"></el-table-column>
            <el-table-column prop="web_sec_id" label="网站二级分类ID"></el-table-column>
            <el-table-column prop="operator" label="操作者"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column prop="updated_at" label="操作时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary">编 辑</el-button>
                    <el-button type="danger" @click="delList(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="foot">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :total="100">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {classlist} from '@/http/category.js'
import qs from 'qs'
export default {
    data(){
        return{
            List:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取列表
        getList(){
            classlist().then((res)=>{
                this.List = res.data.data.data
            })
        },
        //删除列表
        delList(id){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/backend/product/webCategory/${id}`,{}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.getList()
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>