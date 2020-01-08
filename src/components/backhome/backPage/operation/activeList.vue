<template>
    <div class="activeList">
        <div class="activeHeader">活动类型</div>
        <div class="activeType">
            <div>
                <h3>促销活动</h3>
                <p>限制商品为百分比折扣或一口价出售</p>
                <router-link to="/addActive">
                    <el-button type="primary">立即创建</el-button>
                </router-link>
            </div>
            <div>
                <h3>赠品活动</h3>
                <p>单品赠送或满额赠送</p>
                <el-button type="primary">立即创建</el-button>
            </div>
            <div>
                <h3>换购活动</h3>
                <p>加N元可换购指定的商品</p>
                <el-button type="primary">立即创建</el-button>
            </div>
        </div>
        <div class="activeHeader">活动管理</div>
        <div class="activeTable">
            <el-form :inline="true" :model="activeForm">
                <el-form-item label="活动名称">
                    <el-input v-model="activeForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="活动状态">
                    <el-select v-model="activeForm.status" clearable>
                        <el-option label="未开始" value="未开始"></el-option>
                        <el-option label="进行中" value="进行中"></el-option>
                        <el-option label="已结束" value="已结束"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动类型">
                    <el-select v-model="activeForm.type" clearable>
                        <el-option label="一口价" :value="1"></el-option>
                        <el-option label="百分比" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="list" max-height="540px">
                <el-table-column label="活动名称">
                    <template slot-scope="scope">
                        <span @click="viewdetail(scope.row.id)" class="active_name">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动类型">
                    <template slot-scope="scope">
                        <span>{{activetype[scope.row.activity_type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.activity_start_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.activity_end_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动规则">
                    <template slot-scope="scope">
                        <span>{{scope.row.activity_rule}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动状态" width="80px">
                    <template slot-scope="scope">
                        <span>{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动链接">
                    <template slot-scope="scope">
                        <p class="activelink">{{scope.row.url}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="460px">
                    <template slot-scope="scope">
                       <el-button type="primary" size="mini" @click="addcommodity(scope.row.id,scope.row.activity_start_time,scope.row.activity_end_time,scope.row.activity_stop_time,scope.row.status)">活动商品</el-button>
                       <el-button type="primary" size="mini" v-if="scope.row.status == '未开始'" @click="editList(scope.row.id)">编辑</el-button>
                       <el-button type="danger" size="mini" v-if="scope.row.status != '已结束'" @click="stopList(scope.row.id)">终止</el-button>
                       <el-button type="warning" size="mini" v-if="scope.row.status != '已结束'" @click="handleCopy(scope.row.url,$event)">复制链接</el-button>
                       <el-button type="success" size="mini" @click="setStyle(scope.row.id,scope.row.status)">活动广场</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="listTotal"
                    :page-size="15"
                    @current-change="changepage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import {activeList,activestop} from '@/http/active.js'
import clip from '@/utils/clipboard'
export default {
    data(){
        return{
            listTotal:0,
            list:[],
            activeForm:{
                page:1,
                name:'',
                type:'',
                status:''
            },
            activetype:{
                '1':'一口价',
                '2':'百分比活动'
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //查看活动详情
        viewdetail(id){
            this.$router.push({path:'/activedetial',query:{id:id}})
        },
        //复制功能
        handleCopy(text, event) {
            clip(text, event)
        },
        searchList(){
            this.activeForm.page = 1
            this.getList()
        },
        //列表分页
        changepage(val){
            this.activeForm.page = val
            this.getList()
        },
        //获取活动列表
        getList(){
            activeList(this.activeForm).then((res)=>{
                this.list = res.data.data.data
                this.listTotal = res.data.data.total
            })
        },
        //活动终止
        stopList(id){
            this.$confirm('确定要终止这个活动吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                activestop({id:id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '活动已终止',
                            type: 'success'
                        });
                        this.getList()
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'success'
                        });
                    }
                }) 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        //活动广场设置
        setStyle(id,str){
            this.$router.push({path:'/renovation',query:{id:id,str:str}})
        },
        //编辑活动
        editList(id){
            this.$router.push({path:'/addActive',query:{id:id}})
        },
        //添加商品 
        addcommodity(id,time1,time2,time3,str){
            this.$router.push({path:'/setCommodity',query:{id:id,time1:time1,time2:time2,time3:time3,str:str}})
        }
    }
}
</script>
<style scoped>
.activeHeader{
    height: 40px;
    line-height: 40px;
    background: #e1e1e1;
    color: #333;
    padding-left: 20px;
    box-sizing: border-box;
    font-weight: bolder; 
}
.activeType{
    overflow: hidden;
    margin:10px 0;
}
.activeType div{
    width:300px;
    float: left;
    margin:0 20px 0 0;
    height:130px;
    background: #f7f7f7;
    padding:8px;
    box-sizing: border-box;
    text-align: center;
}
.activeType div h3{
    height: 32px;
    line-height: 32px;
}
.activeType div p{
    height: 40px;
    line-height: 40px;
    font-size: 12px;
}
.activeTable{
    margin-top: 10px;
}
.activelink{
    width: 160px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.active_name{
    cursor: pointer;
}
.active_name:hover{
    color: firebrick;
}
</style>