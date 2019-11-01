<template>
    <div class="hotword">
        <div class="heade">
            <h3>热搜词</h3>
            <el-button type="primary" @click="addWord">新建热搜词</el-button>
        </div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="word" clearable placeholder="请输入热搜词"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="hotList"
            style="width: 100%"
            max-height="730px">
            <el-table-column prop="name" label="热搜词"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteList(scope.row.id)">删除</el-button>
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
        <!-- 新增弹框 -->
        <el-dialog
            title="新增热搜词"
            :visible.sync="wordVisible"
            width="600px">
            <el-input v-model="name" @blur="isTrue" placeholder="每次输入只能输入一个热词，且热词必须为英文"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="wordVisible = false">取 消</el-button>
                <el-button type="primary" @click="addWordSub()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {hotwordList,deleteHotword,createHotword} from '@/http/word.js'
export default {
    data(){
        return{
            page:1,
            pageSize:15,
            total:0,
            hotList:[],
            word:'',
            wordVisible:false,
            name:'',//热搜词
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //验证
        isTrue(){
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(!patt1.test(this.name)){
                this.$message({
                    message:'只能是英文',
                    type: 'error'
                });
                this.name = ''
                return false
            }
        },
        addWordSub(){
            createHotword({name:this.name}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'新建成功',
                        type: 'success'
                    });
                    this.wordVisible = false
                    this.getList()
                }
            })
        },
        //查询列表
        searchList(){
            this.page = 1
            this.getList()
        },
        //获取列表
        getList(){
            hotwordList({page:this.page,name:this.word}).then((res)=>{
                if(res.data.code == 200){
                    this.hotList = res.data.data.data
                    this.total = res.data.data.total
                }
            })
        },
        //分页
        changePage(val){
            console.log(val)
            this.page = val
            this.getList()
        },
        //删除热搜词
        deleteList(id){
            deleteHotword({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        },
        addWord(){
            this.wordVisible = true
        },
        //创建热搜词
        createdWord(){

        }
    }
}
</script>
<style scoped>

</style>