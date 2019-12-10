<template>
    <div class="afterlist">
        <div class="heade">
            <h3>售后订单管理</h3>
        </div>
        <div class="orderCenter">
            <el-form :inline="true" :model="orderform" class="demo-form-inline">
                <el-form-item label="售后理由：">
                    <el-select v-model="orderform.season_for_refund" clearable>
                        <el-option v-for="(key,item,index) in season_for_refund" :label="key" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="售后结果：">
                    <el-select v-model="orderform.status" clearable>
                        <el-option v-for="(key,item,index) in returnstatus" :label="key" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.customers_id" clearable placeholder="请输入客户ID" class="customersId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.orders_id" clearable placeholder="请输入订单号" class="customersId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.transaction_num" clearable placeholder="请输入交易流水号" class="customersId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查 询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="orderTable"
                style="width: 100%"
                max-height="700px">
                <el-table-column prop="orders_number" label="订单号"></el-table-column>
                <el-table-column prop="customers_id" label="客户ID" width="60px"></el-table-column>
                <el-table-column prop="return_reason" label="售后理由"></el-table-column>
                <el-table-column prop="refund_result" label="售后结果"></el-table-column>
                <el-table-column label="退款金额（$）">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 50 || scope.row.status == 51"> / </span>
                        <span v-else>{{scope.row.final_refund_amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="交易流水号">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 50 || scope.row.status == 51"> / </span>
                        <span v-else>{{scope.row.transaction_num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="orderDetail(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
import {afterList,SelectContent} from '@/http/after.js'
export default {
    data(){
        return{
            pageSize:15,
            total:0,
            orderform:{
                page:1,
                season_for_refund:'',
                status:'',
                customers_id:'',
                orders_id:'',
                transaction_num:''
            },
            season_for_refund:{},//售后理由
            returnstatus:{},//售后结果
            orderTable:[]
        }
    },
    created(){
        this.getSelect()
        this.getList()
    },
    methods:{
        //下拉款列表
        getSelect(){
            SelectContent().then((res)=>{
                this.season_for_refund = res.data.data.season_for_refund
                this.returnstatus = res.data.data.status
            })
        },
        getList(){
            afterList(this.orderform).then((res)=>{
                if(res.data.code == 200){
                    this.orderTable = res.data.data.data
                }
            })
        },
        //分页
        changePage(val){

        },
        orderDetail(id){
            this.$router.push({path:'/aftersaledetail',query:{id:id}})
        },
        onSubmit(){
            this.page = 1
            this.getList()
        }
    }
}
</script>
<style scoped>

</style>