<template>
    <div class="categoryList">
        <div class="heade">
            <h3>类别管理</h3>
            <el-button type="primary" @click="append(1)"><i class="el-icon-plus"></i> 新增类别 </el-button>
        </div>
        <div class="treebox">
            <el-tree
                :data="list"
                node-key="id"
                accordion
                :highlight-current="true"
                :default-expand-all="true"
                :props="defaultProps"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="node_name">{{node.label}}</span>
                    <span class="node_edit">
                        <el-tag>{{is_show[data.is_show]}}</el-tag>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="() => view(2,data.id)">
                            查看/编辑
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
            <!-- 分类详情/编辑弹框 -->
            <el-dialog
                v-if="categoryVisible"
                :title="box_title"
                :visible.sync="categoryVisible"
                width="600px">
                <div class="categoryBox">
                    <el-form :rules="rules" :model="form" label-width="140px" >
                        <el-form-item label="分类级别：" v-if="type == 1" prop="radio">
                            <el-radio-group v-model="radio" @change="changeType()">
                                <el-radio label="1">一级分类</el-radio>
                                <el-radio label="2">二级分类</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="父级类别：" v-if="form.parent_id!=0 || this.radio ==2" prop="parent_id">
                            <el-select v-model="form.parent_id" placeholder="请选择父级">
                                <el-option v-for="item in firstList" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类名称：" prop="cate_name">
                            <el-input v-model="form.cate_name"></el-input>
                        </el-form-item>
                        <el-form-item label="是否展示：" prop="is_show">
                            <el-switch
                                v-model="form.is_show"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="是否启用：" prop="cate_status">
                            <el-switch
                                v-model="form.cate_status"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="排序：" prop="sort">
                            <el-input v-model="form.sort" @blur="sortTest()"></el-input>
                        </el-form-item>
                        <el-form-item label="分类属性：" v-if="form.parent_id!=0" prop="cate_attrs">
                            <el-checkbox-group
                                v-model="form.cate_attrs">
                                <el-checkbox v-for="item in cate_attrsList" :label="item.attrStr" :key="item.id">{{item.attr_name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="categoryVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subCategory()" v-if="type == 2">确 定</el-button>
                    <el-button type="primary" @click="_addCategory()" v-if="type == 1">创 建</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {categoryList,categoryAttrList,addCategory} from "@/http/category.js"
import qs from 'qs'
export default {
    data(){
        return{
            // expandStatus:false,
            list:[],//分类列表
            radio:'1',//分类级别
            type:'',//1:新增分类，2:编辑查看分类
            defaultProps: {
                children: 'sub',
                label: 'cate_name'
            },
            box_title:'',
            categoryVisible:false,//分类详情弹框
            firstList:[],//一级类目列表
            cat_id:'',//分类id
            form:{
                parent_id:'',
                cate_name: '',
                cate_status:1,
                is_show:0,
                sort:100,
                cate_attrs: [],
            },
            rules: {
                cate_name: [
                    {required: true, message: '类别名称必填', trigger: 'blur'},
                ],
                sort: [
                    {required: true, message: '请输入排序值', trigger: 'blur'}
                ]
            },
            cate_attrsList:[],//分类数组列表
            is_show:{
                '1':"展示",
                '0':"关闭"
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //排序校验
        sortTest(){
            if(isNaN(Number(this.form.sort))){
                this.$message({
                    message: '排序值必须为数字',
                    type: 'error'
                });
                this.form.sort = 100
            }else if(this.form.sort<1){
                this.$message({
                    message: '排序值最小值为1',
                    type: 'error'
                });
                this.form.sort = 100
            }
        },
        //分类列表
        getList(){
            categoryList().then((res)=>{
                this.list = JSON.parse(JSON.stringify(res.data.data.data))
            })
        },
        //获取一级分类列表
        getFirstList(){
            categoryList({first:1}).then((res)=>{
                this.firstList = res.data.data
            })
        },
        //获取全部分类属性
        getAttrList(){
            categoryAttrList().then((res)=>{
                var list = res.data.data
                for(var i=0;i<list.length;i++){
                    this.$set(list[i],'attrStr',`${list[i].id}:${list[i].attr_name}`)
                }
                this.cate_attrsList = list
            })
        },
        //查看，编辑
        view(type,id){
            this.type = type
            this.cat_id = id
            this.box_title = "分类详情/编辑"
            this.$axios.get(`backend/product/category/${id}`,{}).then((res)=>{
                if(res.data.code == 200){
                    this.getFirstList()
                    this.getAttrList()
                    this.categoryVisible = true
                    this.form = res.data.data
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //编辑
        subCategory(){
            this.$axios.put(`backend/product/category/${this.cat_id}`,qs.stringify(this.form)).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.categoryVisible = false
                    this.getList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //新增分类弹框
        append(type) {
            this.type = type
            this.box_title = "新增分类" 
            this.form.parent_id = ''
            this.form.cate_name =  ''
            this.form.cate_status = 1
            this.form.is_show = 0
            this.form.sort = 100
            this.form.cate_attrs = []    
            this.categoryVisible = true
            // this.$refs['formbox'].resetFields();
        },
        //新增分类提交
        _addCategory(){
            if(this.radio == 1){
                this.form.parent_id = 0
            }
            addCategory(this.form).then((res)=>{
                if(res.data.code == 200){
                     this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.categoryVisible = false
                    this.getList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //切换分类级别
        changeType(){
            if(this.radio == 2){
                this.getFirstList()
                this.getAttrList()
            }
        },
        //删除
        remove(id) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`backend/product/category/${id}`,{}).then((res)=>{
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
<style scope>
.categoryList .heade{
    display: flex;
    align-items: center;
}
.categoryList .heade h3{
    margin-right: 20px;
}
.categoryList .treebox{
    max-height: 740px;
    overflow-y: scroll;
    background: #f7f7f7;
}
.categoryList .custom-tree-node{
  width: 1200px!important;
}
.categoryList .node_name{
  display: inline-block;
  min-width: 800px;
}
.categoryList .categoryBox .el-input{
    width: 200px!important;
}
</style>
