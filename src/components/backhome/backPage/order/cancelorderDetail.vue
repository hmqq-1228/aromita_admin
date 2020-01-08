<template>
    <div class="cancelorderDetail">
        <div class="heade">
            <h3>Orders</h3>
        </div>
        <div class="orderCenter">
            <h4>订单信息</h4>
            <el-table :data="orderdetail" v-if="orderdetail">
                <el-table-column prop="orders_number" label="订单号"></el-table-column>
                <el-table-column prop="customers_id" label="客户ID"></el-table-column>
                <el-table-column prop="order_total" label="订单金额"></el-table-column>
                <el-table-column prop="shipping_method" label="选择运输方式"></el-table-column>
                <el-table-column prop="orders_status" label="状态">
                    <template slot-scope="scope">
                        <span>{{order_status[scope.row.orders_status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_success_time" label="支付时间"></el-table-column>
                <el-table-column prop="transaction_id" label="交易ID"></el-table-column>
                <el-table-column prop="payment_method" label="支付方式"></el-table-column>
            </el-table>
            <br>
            <h4>订单信息</h4>
            <br>
            <div class="refund" v-if="orderdetail[0]">
                <b>退款明细：</b>
                <span>退款总金额：{{orderdetail[0].refund_total}}</span>
                <span>回退积分数：{{orderdetail[0].Points}}</span>
            </div>
            <br>
            <div v-if="orderdetail[0]">
                <b>交易流水号：</b><span>{{orderdetail[0].transaction_id}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import {refundDetail} from '@/http/order.js'
export default {
    data(){
        return{
            orders_id:'',
            orderdetail:[],
            order_status:{
                '10':"pending",
                '20':"Processing",
                '30':"Processing (Payment Review)",
                '40':"Shipped",
                '50':"Cancelled",
                '60':"pending"
            },
        }
    },
    created(){
        this.orders_id = this.$route.query.id
        if(this.orders_id){
            this.getDetail()
        }
    },
    methods:{
        //获取订单详情
        getDetail(){
            refundDetail({orders_id:this.orders_id}).then((res)=>{
                if(res.data.code == 200){
                    this.orderdetail.push(res.data.data)
                }
            })  
        }
    }
}
</script>
<style scoped>
.refund span{
    display: inline-block;
    margin-right: 20px;
}
</style>