<template>
    <div class="coupon">
        <div class="heade">
            <h3>优惠券列表</h3>
        </div>
        <div class="couponList">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="coupon_name" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="coupon_status" placeholder="优惠券状态">
                        <el-option label="未生效" value="0"></el-option>
                        <el-option label="生效" value="1"></el-option>
                        <el-option label="失效" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="coupon_type" placeholder="创建类型">
                        <el-option label="节日券" value="F"></el-option>
                        <el-option label="周年庆" value="B"></el-option>
                        <el-option label="注册券" value="N"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <router-link to="/addcoupon">
                        <el-button type="success">新建优惠券</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
            <el-table :data="couponTable">
                <el-table-column prop="coupon_name" label="优惠券名称"></el-table-column>
                <el-table-column label="创建类型">
                    <template slot-scope="scope">
                        {{couponType[scope.row.coupon_type]}}
                    </template>
                </el-table-column>
                <el-table-column prop="coupon_description" label="使用说明"></el-table-column>
                <el-table-column label="已发送/总数">
                    <template slot-scope="scope">
                        {{scope.row.coupon_number_receive}}/{{scope.row.coupon_number}}
                    </template>
                </el-table-column>
                <el-table-column label="有效期">
                    <template slot-scope="scope">
                        <span v-if="scope.row.coupon_type == 'N'">{{scope.row.coupon_expire_date}}天</span>
                        <span v-else>{{scope.row.coupon_start_time}} 至 {{scope.row.coupon_end_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{couponStatus[scope.row.coupon_status]}}
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary">查看</el-button>
                        <el-button type="info">终止</el-button>
                        <el-button type="danger">删除</el-button>
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
    </div>
</template>
<script>
import {couponList} from '@/http/coupon.js'
export default {
    data(){
        return{
            total:0,
            pageSize:50,
            couponTable:[],//优惠券列表
            coupon_name:'',//优惠券名称
            coupon_status:'',//优惠券状态
            coupon_type:'',//优惠券类型
            couponType:{
                'F':"节日券",
                'B':"周年庆",
                'N':"注册券"
            },
            couponStatus:{
                '0':"未生效",
                '1':"生效",
                '2':"失效"
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取优惠券列表
        getList(){
            let pre={
                coupon_name:this.coupon_name,
                coupon_status:this.coupon_status,
                coupon_type:this.coupon_type,
            }
            couponList(pre).then((res)=>{
                this.couponTable = res.data.data.data
            })
        },
        changePage(){
            
        }
    }
}
</script>
<style scope>

</style>