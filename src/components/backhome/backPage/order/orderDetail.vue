<template>
    <div class="orderDetail">
        <div class="heade">
            <h3>订单管理详情</h3>
        </div>
        <div class="orderCenterDetail">
            <!-- 订单信息 -->
            <h4>订单信息</h4>
            <el-table :data="orders" border>
                <el-table-column prop="orders_number" label="订单号"></el-table-column>
                <el-table-column prop="customers_id" label="客户ID"></el-table-column>
                <el-table-column prop="order_total" label="订单金额"></el-table-column>
                <el-table-column prop="shipping_method" label="运输方式"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{order_status[scope.row.orders_status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="下单时间"></el-table-column>
                <el-table-column prop="pay_success_time" label="付款完成时间"></el-table-column>
                <el-table-column prop="transaction_id" label="交易ID"></el-table-column>
                <el-table-column prop="payment_method" label="支付方式"></el-table-column>
            </el-table>
            <!-- 运输方式信息(暂无数据) -->
            <h4>运输方式信息 （暂无数据）</h4>
            <el-table :data="orders" border>
                <el-table-column prop="orders_number" label="运输方式"></el-table-column>
                <el-table-column prop="customers_id" label="跟踪号"></el-table-column>
                <el-table-column prop="order_total" label="来源"></el-table-column>
            </el-table>
            <!-- 地址信息 -->
            <h4>订单地址信息</h4>
            <div class="orderAddress">
                <div class="list">
                    <h4>Shipping Address</h4>
                    <div class="detail" v-if="orders[0]">
                        <h5>{{orders[0].delivery_name}}</h5>
                        <div class="discription">
                            <p>{{orders[0].delivery_company}}</p>
                            <p>{{orders[0].delivery_street_address}}</p>
                            <p>{{orders[0].delivery_suburb}}</p>
                            <p>
                                {{orders[0].delivery_city}},{{orders[0].delivery_state}},{{orders[0].delivery_postcode}},{{orders[0].delivery_country}}
                            </p>
                            <p>{{orders[0].customers_phone}}</p>
                            <p>{{orders[0].customers_email}}</p>
                        </div>
                    </div>
                </div>
                <div class="list">
                    <h4>Billing Address</h4>
                    <div class="detail" v-if="orders[0]">
                        <h5>{{orders[0].billing_name}}</h5>
                        <div class="discription">
                            <p>{{orders[0].billing_company}}</p>
                            <p>{{orders[0].billing_street_address}}</p>
                            <p>{{orders[0].billing_suburb}}</p>
                            <p>
                                {{orders[0].billing_city}},{{orders[0].billing_state}},{{orders[0].billing_postcode}},{{orders[0].billing_country}}
                            </p>
                            <p>{{orders[0].customers_phone}}</p>
                            <p>{{orders[0].customers_email}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 订单商品信息 -->
            <h4>订单商品信息</h4>
            <el-table :data="orderProducts" border>
                <el-table-column label="商品信息">
                    <template slot-scope="scope">
                        <div class="product">
                            <img :src="scope.row.products_pic" alt="">
                            <div class="detail">
                                <h5>{{scope.row.products_name}}</h5>
                                <p>
                                <span v-for="(item1,index) in JSON.parse(scope.row.sku_attrs)" :key="index">{{item1.attr_name}}:
                                    <span style="color: #333;">{{item1.value.attr_value}}</span>; 
                                </span>
                                </p>
                                <p>${{scope.row.final_price}}<span class="old_price">${{scope.row.products_price}}</span></p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sku_no" label="SKU"></el-table-column>
                <el-table-column prop="products_quantity" label="Quantity"></el-table-column>
                <el-table-column
                    label="Total"
                    width="260">
                    <template slot-scope="scope">
                        <h4>{{(scope.row.final_price*scope.row.products_quantity).toFixed(2)}}</h4>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 订单操作日志 -->
            <h4>订单操作日志</h4>
            <el-table :data="orders_status_history" border>
                <el-table-column label="操作项">
                    <template slot-scope="scope">
                        <span>将订单状态从{{order_status[scope.row.orders_history_status_id]}}修改为{{order_status[scope.row.orders_status_id]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="时间"></el-table-column>
                <el-table-column prop="modify_operator" label="操作人"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {orderDetail} from '@/http/order.js'
export default {
    data(){
        return{
            orderId:'',//订单id
            orders:[],//
            orderProducts:[],//订单商品信息
            orders_status_history:[],//订单操作日志
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
        this.orderId = this.$route.query.id
        if(this.orderId){
            this.getorderDetail()
        }
    },
    methods:{
        getorderDetail(){
            orderDetail({id:this.orderId}).then((res)=>{
                if(res.data.code == 200){
                    this.orders = res.data.data.orders
                    this.orderProducts = res.data.data.orders_products
                    this.orders_status_history = res.data.data.orders_status_history
                }
            })
        }
    }
}
</script>
<style scope>
.orderCenterDetail h4{
    height: 60px;
    line-height: 60px;
}   
.orderAddress{
    width: 1200px;
    display: flex;
}
.orderAddress .list{
    flex: 1;
    border: 1px solid #e5e5e5;
    min-height: 240px;
    padding:10px;
    box-sizing: border-box;
    margin:0 20px 0 0;
    border-radius: 6px;
}
.product{
    display:flex;
}
.product img{
    width: 80px;
    height: 80px;
    margin-right:10px;
}
</style>