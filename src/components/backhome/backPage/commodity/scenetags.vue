<template>
    <div class="scenetags">
        <div class="heade">
            <h3>场景标签</h3>
            <el-button type="primary" @click="append(1)"><i class="el-icon-plus"></i> 新增标签 </el-button>
        </div>
        <div class="treebox">
            <div class="treeboxtitle">
                <span>标签名称</span>
                <span>是否展示</span>
                <span>标签状态</span>
                <span>操作</span>
            </div>
            <el-tree
                :data="list"
                node-key="id"
                accordion
                :highlight-current="true"
                :default-expand-all="true"
                :props="defaultProps"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="node_name">{{data.tag_name}}</span>
                    <span class="node">{{data.is_show == 1?'是':'否'}}</span>
                    <span class="node">
                        <el-switch
                            v-model="data.tag_status"
                            :active-value="1"
                            :inactive-value="0"></el-switch>
                    </span>
                    <span class="node_edit node">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="() => view(2,data.id)">
                            编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="() => remove(data.id)">
                            删除
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <!-- 新建标签 -->
        <el-dialog
            :title="box_title"
            :visible.sync="tagsVisible"
            width="600px"
            @close="resetData">
            <el-form :model="tagsform" label-width="120px">
                <el-form-item label="标签名称：">
                    <el-input v-model="tagsform.tag_name" placeholder="请输入英文名称" :disabled="this.type == 1?false:true"></el-input>
                </el-form-item>
                <el-form-item label="父级标签：">
                    <el-select v-model="tagsform.parent_id">
                        <el-option v-for="(item,index) in fristList" :key="index" :label="item.tag_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签状态：">
                    <el-switch 
                        v-model="tagsform.tag_status"
                        :active-value="1"
                        :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="是否展示：">
                    <el-radio-group v-model="tagsform.is_show">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序：">
                    <el-input v-model="tagsform.sort" @blur="sortTest()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveTags" v-if="type == 1">保存</el-button>
                    <el-button type="primary" @click="updataTags" v-if="type == 2">修改</el-button>
                    <el-button type="danger" @click="tagsVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {sceneTag,TagFirstCategory,newSceneTag,updataSceneTag} from "@/http/commodity.js"
import qs from 'qs'
export default {
    data(){
        return{
            list:[],
            defaultProps: {
                children: 'sub',
                label: 'tag_name'
            },
            is_show:{
                '1':"展示",
                '0':"关闭"
            },
            //标签新建或编辑弹框
            type:1,//1:新建 2：修改
            box_title:'新建标签',
            tagsVisible:false,
            fristList:[],//一级标签列表
            tag_id:'',
            tagsform:{
                tag_name:'',
                parent_id:'',
                tag_status:1,
                is_show:1,
                sort:'1'
            },
            switch:1,
        }
    },
    created(){
        this.getList()
    },  
    methods:{
        //排序校验
        sortTest(){
            if(isNaN(Number(this.tagsform.sort))){
                this.$message({
                    message: '排序值必须为数字',
                    type: 'error'
                });
                this.tagsform.sort = 1
            }else if(this.tagsform.sort<1){
                this.$message({
                    message: '排序值最小值为1',
                    type: 'error'
                });
                this.tagsform.sort = 1
            }
        },
        //恢复表单默认数据
        resetData(){
            this.tagsform.tag_name = ''
            this.tagsform.parent_id = '',
            this.tagsform.tag_status = '',
            this.tagsform.is_show = '',
            this.tagsform.sort = ''
        },
        //分类列表
        getList(){
            sceneTag().then((res)=>{
                this.list = JSON.parse(JSON.stringify(res.data.data.data))
                console.log(this.list)
            })
        },
        //新增标签
        append(type){
            this.box_title = '新建标签'
            this.type = type
            this.tagsVisible = true
            this.getFristList()
        },
        //获取一级分类
        getFristList(){
            TagFirstCategory().then((res)=>{
                this.fristList = res.data.data
            })
        },
        //新建标签
        saveTags(){
            if(this.tagsform.parent_id == ''){
                this.tagsform.parent_id = 0
            }
            newSceneTag(this.tagsform).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.tagsVisible = false
                    this.getList()
                }
            })
        },
        view(type,id){
            this.box_title = '编辑标签'
            this.type = type
            this.tag_id = id
            this.$axios.get(`/backend/product/sceneTag/${id}`,{}).then((res)=>{
                if(res.data.code == 200){
                    this.getFristList()
                    this.tagsVisible = true
                    this.tagsform = res.data.data
                    if(res.data.data.parent_id == 0){
                        this.tagsform.parent_id = ''
                    }
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
            
        },
        //编辑标签
        updataTags(){
            this.$axios.put(`/backend/product/sceneTag/${this.tag_id}`,qs.stringify(this.tagsform)).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.tagsVisible = false
                    this.getList()
                }else{
                    var msg = res.data.msg
                    var msgarr = []
                    for(var i in msg){
                        msgarr = msg[i]
                    }
                    this.$message({
                        message:msgarr[0],
                        type: 'error'
                    });
                }
            })
        },
        remove(id){
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/backend/product/sceneTag/${id}`,{}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '删除成功',
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
.treeboxtitle{
    width:100%;
    display: flex;
    height: 40px;
    line-height: 40px;
}
.treeboxtitle span{
    flex:1;
    font-size: 14px;
    font-weight: bolder;
    color: #666;
    text-align: center;
}
.custom-tree-node{
    width: 100%;
    display: flex;
}
.custom-tree-node .node_name{
    width: 400px;
}
.custom-tree-node .node{
    flex:1;
    text-align: center;
}
</style>