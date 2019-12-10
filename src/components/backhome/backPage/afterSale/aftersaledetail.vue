<template>
    <div class="aftersaledetail">
        <div class="heade">
            <h3>售后订单详情</h3>
        </div>
        <div class="orderCenter">
            <div class="orderinfo box">
                <h4>订单信息</h4>
                <el-table :data="order_info" v-if="order_info">
                    <el-table-column prop="orders_number" label="订单号">
                        <template slot-scope="scope">
                            <span>{{refund_info.orders_number}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customers_id" label="客户ID"></el-table-column>
                    <el-table-column prop="order_total" label="订单金额"></el-table-column>
                    <el-table-column prop="shipping_method" label="选择运输方式"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span>{{order_status[scope.row.orders_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_success_time" label="支付时间"></el-table-column>
                    <el-table-column prop="transaction_id" label="交易ID"></el-table-column>
                    <el-table-column prop="payment_method" label="支付方式"></el-table-column>
                </el-table>
            </div>
            <div class="refundproducts box">
                <h4>售后信息</h4>
                <p class="refund_time">申请时间：{{refund_info.created_at}}</p>
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
                    <el-table-column prop="sku_no" label="SKU编号"></el-table-column>
                    <el-table-column prop="refund_quantity" label="退货数量"></el-table-column>
                </el-table>
            </div>
            <div class="refundinfo box">
                <div v-if="refund_info">
                    <p>退款理由：
                        <span v-for="(item,index) in season_refund" :key="index" class="refundreson">【{{season_for_refund[item]}}】</span>
                    </p>
                    <p>退款说明：{{refund_info.refund_instructions}}</p>
                    <p class="refund_imglist">凭证图片：
                        <img v-for="(item,index) in JSON.parse(refund_info.evidence_pictures)" :src="item" alt="" :key="index" class="refundimg">
                    </p>
                    <p>审核结果：{{returnstatus[refund_info.status]}}</p>
                    <p v-if="refund_info.status ==50 || refund_info.status==51">拒绝理由：{{refund_info.feedback_for_refund}}</p>
                    <div v-if="refund_info.status!=50 && refund_info.status!=51">
                        <p>是否退货：{{refund_info.is_return_purchase == 1?'是':'否'}}</p>
                        <p>是否退运费：{{refund_info.is_return_ship_fee == 1?'是':'否'}}</p>
                        <p>寄回运单号：{{refund_info.return_num}}</p>
                    </div>
                </div>
            </div>
            <div class="refundTotal box" v-if="refund_total && (refund_info.status!=50 && refund_info.status!=51)">
                <div>
                    <h5>退款明细：</h5>
                    <p>退款总金额：{{refund_total.final_refund_subtotal}}</p>
                    <p>回退商品总金额：{{refund_total.final_refund_amount}}</p>
                    <p>回退运费金额：{{refund_total.final_refund_ship_fee}}</p>
                    <p>回退税费：{{refund_total.final_refund_tax}}</p>
                </div>
                <p>交易流水号：{{refund_total.transaction_num}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import {SelectContent} from '@/http/after.js'
export default {
    data(){
        return{
            id:'',//订单id
            order_info:[],//订单信息
            refundproducts:[],//售后订单信息
            refund_info:{},//
            refund_total:{},//退款信息
            orderdetail:[],
            returnstatus:{},//售后结果
            season_refund:[],
            season_for_refund:{},//售后理由
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
        this.id = this.$route.query.id
        if(this.id !=''){
            this.getDetail()
            this.getSelect()
        }
    },
    methods:{
        //下拉款列表
        getSelect(){
            SelectContent().then((res)=>{
                this.season_for_refund = res.data.data.season_for_refund
                this.returnstatus = res.data.data.status
            })
        },
        getDetail(){
            this.$axios.get(`/backend/refund/${this.id}`).then((res)=>{
                if(res.data.code == 200){
                    this.order_info.push(res.data.data.order_info)
                    this.refundproducts = res.data.data.refund_products
                    this.refund_info = res.data.data.refund_info
                    this.season_refund = JSON.parse(this.refund_info.season_for_refund)
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
.refundreson{
    display: inline-block;
    margin-right: 10px;
}
.refund_imglist{
    display:flex;
}
.refund_imglist .refundimg{
    width:80px;
    height: 80px;
    margin-right: 20px;
}
.refund_time{
    font-size: 12px;
    margin:5px 0;
}
</style>