<template>
    <div class="linkword">
        <div class="heade">
            <h3>链接词</h3>
        </div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="word_name" clearable placeholder="输入热搜词名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchLink">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addLinkWord">新建链接词</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="linkList"
            style="width: 100%"
            max-height="730px">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="link_word_name" label="热词名称"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="success">已推送</el-tag>
                    <el-tag v-if="scope.row.status == 0" type="danger">未推送</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="活动时间">
                <template slot-scope="scope">
                    <span>{{scope.row.acitivity_start_time}}</span>至
                    <span>{{scope.row.acitivity_end_time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" @click="downLink(scope.row.id)">下架</el-button>
                    <el-button type="danger" @click="deleteLink(scope.row.id)">删除</el-button>
                    <el-button type="primary" @click="pushLink(scope.row.id)">推送</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {linkwordList,createdLink,deleteLinkword,downLinkword,pushlinkword} from '@/http/word.js'
export default {
    data(){
        return{
            word_name:'',
            linkList:[],//列表
            multipleSelection: []
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取列表
        getList(){
            linkwordList({link_word_name:this.word_name}).then((res)=>{
                if(res.data.code == 200){
                    this.linkList = res.data.data
                }
            })
        },
        //推送链接词
        pushLink(id){
            pushlinkword({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'已推送',
                        type: 'success'
                    });
                    this.getList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //搜索
        searchLink(){
            this.getList()
        },
        //新建链接词
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
            this.$confirm('确定要删除这条链接词吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteLinkword({id:id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message:'已删除',
                            type: 'success'
                        });
                        this.getList()
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>
<style scoped>

</style>