<template>
    <div class="coupon">
        <div class="heade">
            <h3>优惠券列表</h3>
        </div>
        <div class="couponList">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="coupon_name" placeholder="优惠券名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="coupon_status" placeholder="优惠券状态" clearable>
                        <el-option label="未生效" value="0"></el-option>
                        <el-option label="已生效" value="1"></el-option>
                        <el-option label="已失效" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="coupon_type" placeholder="创建类型" clearable>
                        <el-option label="节日券" value="F"></el-option>
                        <el-option label="周年庆" value="B"></el-option>
                        <el-option label="注册券" value="N"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchCoupon()">查询</el-button>
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
                <el-table-column label="已领取/发放总数">
                    <template slot-scope="scope">
                        {{scope.row.coupon_number_receive}}/{{scope.row.coupon_number}}
                    </template>
                </el-table-column>
                <el-table-column label="有效期" width="280px">
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
                        <!-- <el-button type="primary">查看</el-button> -->
                        <el-button type="primary" v-if="scope.row.coupon_status == '1'" @click="stopList(scope.row.id)">终止</el-button>
                        <el-button type="primary" v-else disabled>终止</el-button>
                        <el-button type="danger" v-if="scope.row.coupon_status != '0' && scope.row.coupon_number_receive == 0" @click="delList(scope.row.id)">删除</el-button>
                        <el-button type="danger" v-else disabled>删除</el-button>
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
import {couponList,delCoupon,stopCoupon} from '@/http/coupon.js'
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
                '1':"已生效",
                '2':"已失效"
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
                page:this.page,
                coupon_name:this.coupon_name,
                coupon_status:this.coupon_status,
                coupon_type:this.coupon_type,
            }
            couponList(pre).then((res)=>{
                this.couponTable = res.data.data.data
            })
        },
        //搜索优惠券列表
        searchCoupon(){
            this.getList()
        },
        //删除优惠券
        delList(id){
            this.$confirm('是否删除优惠券?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delCoupon({id:id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //终止优惠券
        stopList(id){
            this.$confirm('是否终止优惠券?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stopCoupon({id:id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '已终止!'
                        });
                        this.getList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
            
        },
        //分页器
        changePage(){
            
        }
    }
}
</script>
<style scope>

</style>