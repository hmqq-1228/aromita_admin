<template>
    <div class="hotword">
        <div class="heade">
            <h3>热搜词</h3>
            <el-button type="primary">新建热搜词</el-button>
        </div>
        <el-table
            :data="hotList"
            style="width: 100%"
            max-height="780px">
            <el-table-column prop="name" label="热搜词"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteList(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {hotwordList,deleteHotword} from '@/http/word.js'
export default {
    data(){
        return{
            page:1,
            pageSize:15,
            total:0,
            hotList:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取列表
        getList(){
            hotwordList({page:this.page}).then((res)=>{
                if(res.data.code == 200){
                    this.hotList = res.data.data.data
                    this.total = res.data.data.total
                }
            })
        },
        //分页
        changePage(val){
            console.log(val)
            this.page = val
            this.getList()
        },
        //删除热搜词
        deleteList(id){
            deleteHotword({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        }
    }
}
</script>
<style scoped>

</style>