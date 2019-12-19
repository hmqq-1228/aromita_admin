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
                            :inactive-value="0"
                            @change="changeTagStatus(data.id,data.tag_status)"></el-switch>
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
            v-if="tagsVisible"
            :title="box_title"
            :visible.sync="tagsVisible"
            width="600px"
            @close="resetData">
            <el-form :model="tagsform" label-width="120px" :rules="rules" ref="tagsform">
                <el-form-item label="标签名称：" prop="tag_name">
                    <el-input v-model="tagsform.tag_name" placeholder="请输入英文名称" :disabled="this.type == 1?false:true"></el-input>
                </el-form-item>
                <el-form-item label="父级标签：">
                    <el-select v-model="tagsform.parent_id" placeholder="None">
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
                <el-form-item label="展示顺序：" prop="sort">
                    <el-input v-model="tagsform.sort"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveTags('tagsform')" v-if="type == 1">保存</el-button>
                    <el-button type="primary" @click="updataTags('tagsform')" v-if="type == 2">修改</el-button>
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
        var tag_name = (rule, value, callback) => {
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(value != '' && !patt1.test(value)){
                callback(new Error('标签名称只能是英文'));
            }else{
                callback();
            }
        };
        var sort = (rule, value, callback) =>{
            if(isNaN(Number(value))){
                callback(new Error('排序值必须为数字'))
            }else if(value < 1){
                callback(new Error('排序值最小值为1'))
            }else{
                callback();
            }
        }
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
            rules:{
                tag_name:[
                    { required: true, message: '请输入标签名称', trigger: 'blur' },
                    { min: 1, max:15, message: '标签不能超过15个字符', trigger: 'blur' },
                    { validator: tag_name, trigger: 'blur' }
                ],
                sort:[
                    { validator: sort, trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getList()
    },  
    methods:{
        //改变标签显示状态
        changeTagStatus(id,status){
            this.$axios.put(`backend/product/sceneTag/ajaxUpdateStatus/${id}`,qs.stringify({status:status})).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '状态已修改',
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
        //恢复表单默认数据
        resetData(){
            this.tagsform.tag_name = ''
            this.tagsform.parent_id = '',
            this.tagsform.tag_status = 1,
            this.tagsform.is_show = 1,
            this.tagsform.sort = '1'
        },
        //分类列表
        getList(){
            sceneTag().then((res)=>{
                this.list = JSON.parse(JSON.stringify(res.data.data.data))
            })
        },
        //新增标签
        append(type){
            this.resetData()
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
        saveTags(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let tagsform1 = JSON.parse(JSON.stringify(this.tagsform))
                    if(tagsform1.parent_id == ''){
                        tagsform1.parent_id = 0
                    }
                    newSceneTag(tagsform1).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.tagsVisible = false
                            this.getList()
                        }else{
                            this.$message({
                                message:res.data.msg,
                                type: 'error'
                            });
                            this.resetData()
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        view(type,id){
            this.resetData()
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
        updataTags(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let tagsform1 = JSON.parse(JSON.stringify(this.tagsform))
                    if(tagsform1.parent_id == ''){
                        tagsform1.parent_id = 0
                    }
                    this.$axios.put(`/backend/product/sceneTag/${this.tag_id}`,qs.stringify(tagsform1)).then((res)=>{
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
                } else {
                    return false;
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
.scenetags .treeboxtitle{
    width:100%;
    display: flex;
    height: 40px;
    line-height: 40px;
}
.scenetags .treeboxtitle span{
    flex:1;
    font-size: 14px;
    font-weight: bolder;
    color: #666;
    text-align: center;
}
.scenetags .custom-tree-node{
    width: 100%;
    display: flex;
}
.scenetags .custom-tree-node .node_name{
    width: 400px;
}
.scenetags .custom-tree-node .node{
    flex:1;
    text-align: center;
}
</style>