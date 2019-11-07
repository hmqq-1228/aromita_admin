<template>
    <div class="linkword">
        <div class="heade">
            <h3>新建链接词</h3>
        </div>
        <el-form :inline="true">
            <el-form-item label="活动名称：">
                <el-input v-model="name" clearable placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item label="请选择时间：">
                <el-date-picker
                    v-model="time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="linkList"
            style="width: 100%"
            max-height="730px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="活动ID"></el-table-column>
            <el-table-column prop="name" label="活动名称"></el-table-column>
            <el-table-column prop="start_time" label="开始时间"></el-table-column>
            <el-table-column prop="end_time" label="结束时间"></el-table-column>
        </el-table>
        <div class="savebtn">
            <el-button type="primary" @click="saveLink()">确定</el-button>
            <router-link to="/linkword"><el-button type="info">取消</el-button></router-link>
        </div>
    </div>
</template>
<script>
import {activityindex,createdLink,deleteLinkword,downLinkword} from '@/http/word.js'
export default {
    data(){
        return{
            name:'',
            time:[],
            linkList:[],//列表
            multipleSelection: []
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取活动列表
        getList(){
            var start_time = ''
            var end_time = ''
            if(this.time && this.time.length!=0){
                start_time = this.time[0]
                end_time = this.time[1]
            }
            activityindex({name:this.name,start_time:start_time,end_time:end_time}).then((res)=>{
                this.linkList = res.data
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        searchList(){
            this.getList()
        },
        //保存链接词
        saveLink(){
            if(this.multipleSelection.length == 0){
                this.$message({
                    message: '请勾选活动',
                    type: 'warning'
                });
                return false
            }else{
                var arr =[]
                for(var i=0;i<this.multipleSelection.length;i++){
                    var obj = {
                            "acitivity_id":this.multipleSelection[i].id,
                            "link_word_name":this.multipleSelection[i].name,
                            "status":0,
                            "acitivity_start_time":this.multipleSelection[i].start_time,
                            "acitivity_end_time":this.multipleSelection[i].end_time,
                            "url":this.multipleSelection[i].url,
                        }
                    arr.push(obj)
                }
                createdLink(arr).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '新建成功',
                            type: 'success'
                        });
                        this.$router.push({path:'/linkword'})
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }
        },
    }
}
</script>
<style scoped>
.savebtn{
    margin-top: 20px;
}
</style>