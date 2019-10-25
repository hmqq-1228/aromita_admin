<template>
    <div class="journal">
        <div class="heade">
            <h3>日志管理</h3>
        </div>
        <el-table
            :data="journalList"
            style="width: 100%"
            max-height="780px">
            <el-table-column prop="oper_name" label="操作者"></el-table-column>
            <el-table-column prop="created_at" label="操作时间"></el-table-column>
            <el-table-column prop="oper_ip" label="IP"></el-table-column>
            <el-table-column prop="log_channel" label="日志所在模块"></el-table-column>
            <el-table-column label="日志内容" width="500px">
                <template slot-scope="scope">
                   <span class="content">
                       {{scope.row.log_content}}
                   </span>
                </template>
            </el-table-column>
            <el-table-column prop="log_extra" label="日志扩展信息"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :total="total"
                layout="prev, pager, next"
                :page-size="50"
                @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {getJournalList} from '@/http/journal.js'
export default {
    data(){
        return{
            total:0,
            page:1,
            journalList:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            getJournalList({page:this.page}).then((res)=>{
                if(res.data.code == 200){
                    this.journalList = res.data.data.data
                    this.total = res.data.data.total
                }
            })
        },
        changePage(val){
            this.page = val
            this.getList()
        },
        viewDetail(id){
            this.$router.push({path:'/journaldetail',query:{id:id}})
        }
    }
}
</script>
<style scope>
    .journal .content{
        display: inline-block;
        min-height: 40px;
        max-height: 200px;
        overflow-y: auto;
    }
</style>