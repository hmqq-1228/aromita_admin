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
                <el-select>
                    <el-option></el-option>
                </el-select>
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
            <el-table-column prop="link_word_name" label="活动ID"></el-table-column>
            <el-table-column prop="created_at" label="活动名称"></el-table-column>
            <el-table-column label="开始时间"></el-table-column>
            <el-table-column label="结束时间"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import {activityindex,createdLink,deleteLinkword,downLinkword} from '@/http/word.js'
export default {
    data(){
        return{
            name:'',
            start_time:'',
            linkList:[],//列表
            multipleSelection: []
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            activityindex({name:this.name,start_time:this.start_time}).then((res)=>{
                if(res.data.code == 200){
                    this.linkList = res.data.data
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        searchList(){
            this.getList()
        },
        addLinkWord(){
            this.$router.push({path:'/newlink'})
        },
        //下架链接词
        downLink(id){
            downLinkword({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'已下架',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        },
        //删除链接词
        deleteLink(id){
            deleteLinkword({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'已删除',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        }
    }
}
</script>
<style scoped>

</style>