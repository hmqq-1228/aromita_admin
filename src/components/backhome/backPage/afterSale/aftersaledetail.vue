<template>
    <div class="aftersaledetail">
        <div class="heade">
            <h3>售后订单详情</h3>
        </div>
        <div class="orderCenter">
            <div class="orderinfo box">
                <h4>订单信息</h4>
                <el-table :data="order_info" v-if="order_info">
                    <el-table-column prop="orders_number" label="订单号"></el-table-column>
                    <el-table-column prop="customers_id" label="客户ID"></el-table-column>
                    <el-table-column prop="order_total" label="订单金额"></el-table-column>
                    <el-table-column prop="shipping_method" label="选择运输方式"></el-table-column>
                    <el-table-column prop="orders_status" label="状态"></el-table-column>
                    <el-table-column prop="pay_success_time" label="支付时间"></el-table-column>
                    <el-table-column prop="transaction_id" label="交易ID"></el-table-column>
                    <el-table-column prop="payment_method" label="支付方式"></el-table-column>
                </el-table>
            </div>
            <div class="refundproducts box">
                <h4>售后信息</h4>
                <el-table :data="refundproducts" v-if="refundproducts">
                    <el-table-column label="Product">
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
                                    <p>${{scope.row.final_price}}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="refund_quantity" label="退货数量"></el-table-column>
                </el-table>
            </div>
            <div class="refundinfo box">
                <div v-if="refund_info">
                    <p>退款理由：{{refund_info.season_for_refund}}</p>
                    <p>退款说明：{{refund_info.refund_instructions}}</p>
                    <p>凭证图片：</p>
                    <p>审核结果：</p>
                    <p>是否退货：{{refund_info.is_return_purchase}}</p>
                    <p>是否退运费：{{refund_info.is_return_ship_fee}}</p>
                    <p>寄回运单号：{{refund_info.return_num}}</p>
                </div>
            </div>
            <div class="refundTotal box" v-if="refund_total">
                <div>
                    <h5>退款明细：</h5>
                    <p>退款总金额：{{refund_total.final_refund_subtotal}}</p>
                    <p>回退商品总金额：{{refund_total.final_refund_amount}}</p>
                    <p>回退运费金额：{{refund_total.final_refund_ship_fee}}</p>
                    <p>回退税费：{{refund_total.final_refund_tax}}</p>
                    <p>回退积分数：</p>
                </div>
                <p>交易流水号：{{refund_total.transaction_num}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            id:'',//订单id
            order_info:[],//订单信息
            refundproducts:[],//售后订单信息
            refund_info:{},//
            refund_total:{},//退款信息
            orderdetail:[]
        }
    },
    created(){
        this.id = this.$route.query.id
        if(this.id !=''){
            this.getDetail()
        }
    },
    methods:{
        getDetail(){
            this.$axios.get(`/backend/refund/${this.id}`).then((res)=>{
                if(res.data.code == 200){
                    this.order_info.push(res.data.data.order_info)
                    this.refundproducts = res.data.data.refund_products
                    this.refund_info = res.data.data.refund_info
                    this.refund_total = res.data.data.refund_total
                }
            })
        }
    }
}
</script>
<style>
.aftersaledetail .box{
    margin-bottom: 20px;
}
.aftersaledetail .product{
    display:flex;
}
.aftersaledetail .product img{
    width: 80px;
    height: 80px;
    margin-right:10px;
}
.aftersaledetail .product .detail{
    text-align: left;
}
.refundinfo p{
    margin-bottom: 20px;
}
.refundTotal p{
    margin-bottom: 20px;
}
</style>