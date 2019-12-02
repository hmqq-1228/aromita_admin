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
                    <el-select clearable v-model="adverteform.status">
                        <el-option label="开启" :value="1"></el-option>
                        <el-option label="关闭" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input clearable placeholder="请输入广告名称" v-model="adverteform.top_ad_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input clearable placeholder="请输入广告标题" v-model="adverteform.top_ad_title"></el-input>
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
                    <el-button type="primary" @click="onSubmit">查 询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="adverteTable"
                style="width: 100%"
                max-height="700px">
                <el-table-column prop="top_ad_name" label="广告名称"></el-table-column>
                <el-table-column prop="top_ad_title" label="广告标题"></el-table-column>
                <el-table-column prop="ad_start_time" label="广告开始时间"></el-table-column>
                <el-table-column prop="ad_end_time" label="广告结束时间"></el-table-column>
                <el-table-column prop="status" label="广告状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="changestatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editList(scope.row.id)">编辑</el-button>
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
import {advertlist,updatEdit,editadvert} from '@/http/advert.js'
export default {
    data(){
        return{
            pageSize:15,
            total:0,
            time:'',
            adverteform:{
                page:1,
                status:'',
                top_ad_name:'',
                top_ad_title:'',
                ad_start_time:'',
                ad_end_time:''
            },
            adverteTable:[],//广告列表
            season_for_refund:{},//状态
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //开启或关闭广告
        changestatus(data){
            updatEdit(data).then((res)=>{
                if(res.data.code ==200){
                    this.$message.success('修改成功');
                    this.getList()
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        //分页
        changePage(val){
            console.log(val)
            this.getList()
        },
        //广告列表
        getList(){
            if(this.time && this.time.length!=0){
                this.adverteform.ad_start_time = time[0]
                this.adverteform.ad_end_time = time[1]
            }else{
                this.adverteform.ad_start_time = ''
                this.adverteform.ad_end_time = ''
            }
            advertlist(this.adverteform).then((res)=>{
                this.adverteTable = res.data.data.data
            })
        },
        //查询
        onSubmit(){
            this.adverteform.page = 1
            this.getList()
        },
        //编辑
        editList(id){
            editadvert({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$router.push({path:'/floatwinone',query:{id:id}})
                }else{
                    this.$message.error(res.data.msg);
                }
            })
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