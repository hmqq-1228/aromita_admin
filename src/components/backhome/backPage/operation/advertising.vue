<template>
    <div class="advertising">
        <div class="header">
            <span>广告管理</span>
            <router-link to="/floatwinone">
                <el-button type="primary">顶部浮窗广告</el-button>
            </router-link>
            <router-link to="/floatwintwo">
                <el-button type="primary">订阅浮窗广告</el-button>
            </router-link>
        </div>
        <div class="orderCenter">
            <el-form :inline="true" :model="adverteform" class="demo-form-inline">
                <el-form-item label="状态：">
                    <el-select clearable>
                        <el-option v-for="(key,item,index) in season_for_refund" :label="key" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告时段：">
                    <el-date-picker
                        v-model="adverteform.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input clearable placeholder="请输入广告名称/广告标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查 询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="adverteTable"
                style="width: 100%"
                max-height="700px">
                <el-table-column prop="orders_id" label="广告名称"></el-table-column>
                <el-table-column prop="customers_id" label="广告标题"></el-table-column>
                <el-table-column prop="season_for_refund" label="广告开始时间"></el-table-column>
                <el-table-column prop="refund_result" label="广告结束时间"></el-table-column>
                <el-table-column prop="final_refund_amount" label="广告状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary">编辑</el-button>
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
                @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            pageSize:15,
            total:0,
            adverteform:{
                page:1,
                time:'',
            },
            adverteTable:[],//广告列表
            season_for_refund:{},//状态
        }
    },
    created(){

    },
    methods:{
        //分页
        changePage(){

        },
        //查询
        onSubmit(){

        }
    }
}
</script>
<style scoped>
.advertising .header{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.advertising .header span{
    margin-right: 20px;
    font-size: 16px;
    font-weight: bolder;
}
.advertising .header a{
    margin-right: 20px;
}
</style>