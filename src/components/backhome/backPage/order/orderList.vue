<template>
    <div class="orderList">
        <div class="heade">
            <h3>Orders</h3>
        </div>
        <div class="orderCenter">
            <el-form :inline="true" :model="orderform" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="orderform.orders_number" clearable placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderform.customers_id" clearable placeholder="客户ID" class="customersId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="orderform.orders_status" clearable placeholder="订单状态">
                        <el-option v-for="(item,index) in order_statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="orderform.payment_method" clearable placeholder="支付方式">
                        <el-option label="PayPal" value="paypal"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="ordertime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始下单日期"
                        end-placeholder="结束下单日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="Paymenttime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="起始付款时间"
                        end-placeholder="结束付款时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="orderTable"
                style="width: 100%"
                max-height="700px">
                <el-table-column prop="orders_number" label="订单号"></el-table-column>
                <el-table-column prop="customers_id" label="客户ID" width="60px"></el-table-column>
                <el-table-column label="订单状态">
                    <template slot-scope="scope">
                        <span>{{order_status[scope.row.orders_status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_total" label="订单金额"></el-table-column>
                <el-table-column prop="shipping_method" label="运输方式"></el-table-column>
                <el-table-column prop="created_at" label="下单时间"></el-table-column>
                <el-table-column prop="pay_success_time" label="付款完成时间"></el-table-column>
                <el-table-column prop="payment_method" label="支付方式"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="orderDetail(scope.row.id)">详情</el-button>
                        <el-button type="warning" @click="Edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="20">
            </el-pagination>
        </div>
        <!-- 编辑订单状态弹框-->
        <el-dialog
            title="修改订单状态"
            :visible.sync="orderVisible"
            width="40%">
            <el-form :model="orderDetailForm" class="demo-form-inline" label-width="100px">
                <el-form-item label="订单ID:">
                    <el-input v-model="orderDetailForm.ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单号:">
                    <el-input v-model="orderDetailForm.orders_number" disabled></el-input>
                </el-form-item>
                <el-form-item label="客户ID:">
                    <el-input v-model="orderDetailForm.customers_id" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单金额:">
                    <el-input v-model="orderDetailForm.order_total" disabled></el-input>
                </el-form-item>
                <el-form-item label="运输方式:">
                    <el-input v-model="orderDetailForm.shipping_method" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单状态:">
                    <el-select v-model="orderDetailForm.orders_status" clearable placeholder="订单状态">
                        <el-option v-for="(item,index) in order_statusList" :key="index" :label="item.label" :value="Number(item.value)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="editorderSub()">修 改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {orderList,orderUpdate,orderEdit} from '@/http/order.js'
import { stringify } from 'querystring'
export default {
    data(){
       return{
            total:0,
            ordertime:[],//下单时间
            Paymenttime:[],//付款完成时间
            orderform:{
               orders_status:'',//订单状态
               payment_method:'',//支付方式
               orders_number:'',//订单号
               customers_id:'',//客户id
               created_at_start:'',//起始下单时间
               created_at_stop:'',//结束下单时间
               pay_success_time_start:'',//起始付款时间
               pay_success_time_stop:'',//结束付款时间
            },
            order_statusList:[
                {value:'10',label:'pending'},
                {value:'20',label:'Processing'},
                {value:'30',label:'Processing (Payment Review)'},
                {value:'40',label:'Shipped'},
                {value:'50',label:'Cancelled'},
                {value:'60',label:'pending'},
            ],
            order_status:{
                '10':"pending",
                '20':"Processing",
                '30':"Processing (Payment Review)",
                '40':"Shipped",
                '50':"Cancelled",
                '60':"pending"
            },
            orderTable:[],//订单列表
            orderVisible:false,
            orderDetailForm:{
                id:'',//订单id
                orders_number:'',
                customers_id:'',
                order_total:'',
                shipping_method:'',
                orders_status:0,
            },
            username:'',//用户名
       } 
    },
    created(){
        if(localStorage.getItem('username')){
            this.username = localStorage.getItem('username')
        }
        this.getorderList()
    },
    methods:{
        //订单列表
        getorderList(){
            if(this.ordertime.length!=0){
                this.orderform.created_at_start = this.ordertime[0]
                this.orderform.created_at_stop = this.ordertime[1]
            }
            if(this.Paymenttime.length!=0){
                this.orderform.pay_success_time_start = this.Paymenttime[0]
                this.orderform.pay_success_time_stop = this.Paymenttime[1]
            }
            orderList(this.orderform).then((res)=>{
                this.orderTable = res.data.data.data
                this.total = res.data.data.total
            })
        },
        //查询列表
        onSubmit(){
            this.getorderList()
        },
        //订单详情
        orderDetail(id){
            this.$router.push({ path: 'orderDetail', query: { id: id }})
        },
        //订单编辑
        Edit(obj){
            this.orderVisible = true;
            this.orderDetailForm = JSON.parse(JSON.stringify(obj))
        },
        //修改订单状态提交
        editorderSub(){
            let pre={
                id:this.orderDetailForm.id,
                orders_status:this.orderDetailForm.orders_status,
                username:this.username
            }
            orderEdit(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '修改成功!',
                        type: 'success'
                    });
                    this.orderVisible = false;
                    this.getorderList()
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
</script>
<style>
.customersId{
    width: 100px;
}
</style>