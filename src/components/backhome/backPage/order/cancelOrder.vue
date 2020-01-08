<template>
    <div class="cancelOrder">
        <div class="heade">
            <h3>Orders</h3>
        </div>
        <div class="orderCenter">
            <el-form :inline="true" :model="orderform" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="orderform.orders_number" clearable placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.customer_id" clearable placeholder="客户ID" class="customersId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.transaction_id" clearable placeholder="请输入交易流水号" class="customersId"></el-input>
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
                <el-table-column prop="customer_id" label="客户ID" width="60px"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{order_status[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="refund_total" label="退款金额（$）"></el-table-column>
                <el-table-column prop="transaction_id" label="交易流水号"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="orderDetail(scope.row.orders_id)">详情</el-button>
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
                @current-change="changeOrderPage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {refundIndex} from '@/http/order.js'
export default {
    data(){
        return{
            pageSize:15,
            total:0,
            orderform:{
               page:1,
               orders_number:'',//订单号
               customer_id:'',//客户id
               transaction_id:'',//交易ID
            },
            orderTable:[],//订单列表
            order_status:{
                '10':"退款完成",
                '20':"Processing",
                '30':"Processing (Payment Review)",
                '40':"Shipped",
                '50':"Cancelled",
                '60':"pending"
            },
        }
    },
    created(){
        this.getList()
    },
    methods:{
        changeOrderPage(val){
            this.orderform.page = val
            this.getList()
        },
        getList(){
            refundIndex(this.orderform).then((res)=>{
                if(res.data.code == 200){
                    this.orderTable = res.data.data.data
                    this.total = res.data.data.total
                }
            })
        },
        onSubmit(){
            this.orderform.page = 1
            this.getList()
        },
        //查看详情
        orderDetail(id){
            this.$router.push({path:'/cancelorderDetail',query:{id:id}})
        }
    }
}
</script>