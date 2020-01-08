<template>
    <div class="suggestions">
        <div class="heade">
            <h3>客户建议管理</h3>
        </div>
        <el-form :inline="true" :model="suggestionsform" class="demo-form-inline">
            <el-form-item label="时间">
                <el-date-picker
                    v-model="time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="suggestionsform.customer_id" clearable placeholder="请输入客户ID" class="customersId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="suggestionsform.customer_name" clearable placeholder="请输入客户名称" class="customersId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="suggestionsform.customer_email" clearable placeholder="请输入客户邮箱" class="customersId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查 询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="suggestionsTable"
            style="width: 100%"
            max-height="700px">
            <el-table-column prop="customer_id" label="客户ID"></el-table-column>
            <el-table-column prop="customer_name" label="姓名"></el-table-column>
            <el-table-column prop="customer_email" label="邮箱"></el-table-column>
            <el-table-column prop="created_at" label="反馈时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="viewdetail(scope.row.id)">查看详情</el-button>
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
        <!-- 查看详情 -->
        <el-dialog
            title="反馈详情"
            :visible.sync="detailVisible"
            width="600px">
            <p>{{this.suggestions}}</p>
        </el-dialog>
    </div>
</template>
<script>
import {suggestions,suggestionsdetail} from '@/http/customer.js'
export default {
    data(){
        return{
            pageSize:15,
            total:0,
            time:[],
            //客户建议搜索
            suggestionsform:{
                page:1,
                created_at_start:'',
                created_at_stop:'',
                customer_id:'',
                customer_name:'',
                customer_email:''
            },
            suggestionsTable:[],
            detailVisible:false,
            suggestions:''
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            if(this.time && this.time.length!=0){
                this.suggestionsform.created_at_start = this.time[0]
                this.suggestionsform.created_at_stop = this.time[1]
            }else{
                this.suggestionsform.created_at_start = ''
                this.suggestionsform.created_at_stop = ''
            }
            suggestions(this.suggestionsform).then((res)=>{
                this.suggestionsTable = res.data.data.data
                this.total = res.data.data.total
            })
        },
        changePage(val){
            this.suggestionsform.page = val
            this.getList()
        },
        onSubmit(){
            this.suggestionsform.page = 1
            this.getList()
        },
        //查看详情
        viewdetail(id){
            this.detailVisible = true
            suggestionsdetail({id:id}).then((res)=>{
                this.suggestions = res.data.data.customer_suggestions
            })
        }
    }
}
</script>