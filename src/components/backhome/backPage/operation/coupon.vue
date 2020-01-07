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
                        <el-option label="待发放" value="待发放"></el-option>
                        <el-option label="发放中" value="发放中"></el-option>
                        <el-option label="已结束" value="已结束"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="coupon_type" placeholder="创建类型" clearable>
                        <el-option label="节日券" value="F"></el-option>
                        <!-- <el-option label="周年庆" value="B"></el-option> -->
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
            <el-table :data="couponTable" max-height="740px">
                <el-table-column label="优惠券名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.coupon_name}}</span> &nbsp;&nbsp;&nbsp;
                        <el-tag type="danger" v-if="scope.row.is_register_send == 1">注册优惠券</el-tag>
                        <el-tag type="danger" v-if="scope.row.is_subscribe_send == 1">订阅优惠券</el-tag>
                    </template>
                </el-table-column>
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
                        <span>{{listStatus[scope.$index]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="操作" width="260px">
                    <template slot-scope="scope">
                        <el-button type="success" v-if="listStatus[scope.$index] != '已结束' && scope.row.coupon_type == 'F'" @click="_setCoupon(scope.row.id,scope.row.coupon_type)">设置为订阅coupon</el-button>
                        <el-button type="danger" v-if="listStatus[scope.$index] != '已结束' && scope.row.coupon_type == 'N'" @click="_setCoupon(scope.row.id,scope.row.coupon_type)">设置为注册coupon</el-button>
                        <el-button type="primary" v-if="listStatus[scope.$index] == '发放中'" @click="stopList(scope.row.id)">终止</el-button>
                        <el-button type="danger" v-else-if="listStatus[scope.$index] == '待发放'" @click="delList(scope.row.id)">删除</el-button>
                        <el-button type="info" v-else disabled>不可操作</el-button>
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
import {couponList,delCoupon,stopCoupon,setcoupon} from '@/http/coupon.js'
export default {
    data(){
        return{
            page:1,
            total:0,
            pageSize:20,
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
            },
            listStatus:[],//优惠券状态
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
                this.couponTable = res.data.data.data.data
                this.listStatus = res.data.data.status
                this.total = res.data.data.data.total
            })
        },
        //设置优惠券
        _setCoupon(id,type){
            setcoupon({id:id,type:type}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: '设置成功!'
                    });
                    this.getList()
                }else{
                    this.$message({
                        type: 'error',
                        message:res.data.msg
                    });
                }
            })
        },
        //查询优惠券列表
        searchCoupon(){
            this.page = 1
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
        changePage(val){
            this.page = val
            this.getList()
        }
    }
}
</script>
<style scope>

</style>