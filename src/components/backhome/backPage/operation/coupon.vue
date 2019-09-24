<template>
    <div class="coupon">
        <div class="heade">
            <h3>优惠券列表</h3>
        </div>
        <div class="couponList">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select>
                        <el-option label="启用"></el-option>
                        <el-option label="禁用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select placeholder="创建类型">
                        <el-option label="满减券"></el-option>
                        <el-option label="注册券"></el-option>
                        <el-option label="礼包券"></el-option>
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
            <el-table>
                <el-table-column prop="date" label="优惠券名称"></el-table-column>
                <el-table-column prop="date" label="创建类型"></el-table-column>
                <el-table-column prop="date" label="使用说明"></el-table-column>
                <el-table-column prop="date" label="已发送/总数"></el-table-column>
                <el-table-column prop="date" label="有效期"></el-table-column>
                <el-table-column prop="date" label="状态"></el-table-column>
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
export default {
    data(){
        return{
            total:0,
            pageSize:50
        }
    },
    created(){

    },
    methods:{
        changePage(){
            
        }
    }
}
</script>
<style scope>

</style>