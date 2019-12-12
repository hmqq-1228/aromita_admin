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
                    <el-input v-model="activeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="活动状态">
                    <el-select v-model="activeForm.region">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动类型">
                    <el-select v-model="activeForm.type">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="list">
                <el-table-column label="活动名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.res.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.res.activity_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.res.activity_start_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.res.activity_end_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动规则">
                    <template slot-scope="scope">
                        <span>{{scope.row.res.activity_rule}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动状态" width="80px">
                    <template slot-scope="scope">
                        <span>{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动链接">
                    <template slot-scope="scope">
                        <p>{{scope.row.res.url}}</p>
                        <el-button type="warning" size="mini" v-if="scope.row.status != '已结束'">复制链接</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                       <el-button type="primary" size="mini" v-if="scope.row.status != '已结束'">添加商品</el-button>
                       <el-button type="primary" size="mini" v-if="scope.row.status == '未开始'" @click="editList(scope.row.res.id)">编辑</el-button>
                       <el-button type="danger" size="mini" v-if="scope.row.status != '已结束'" @click="stopList(scope.row.res.id)">终止</el-button>
                       <el-button type="success" size="mini" v-if="scope.row.status == '未开始'" @click="setStyle()">活动广场</el-button>
                       <el-button type="info" disabled v-if="scope.row.status == '已结束'">禁止操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {activeList,activestop} from '@/http/active.js'
export default {
    data(){
        return{
            list:[],
            activeForm:{
                page:1,
                name:'',
                type:'',
                status:''
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取活动列表
        getList(){
            activeList(this.activeForm).then((res)=>{
                this.list = res.data.data
            })
        },
        //活动终止
        stopList(id){
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
        },
        //活动广场设置
        setStyle(){
            this.$router.push({path:'/renovation'})
        },
        //编辑活动
        editList(id){
            this.$router.push({path:'/addActive',query:{id:id}})
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
</style>