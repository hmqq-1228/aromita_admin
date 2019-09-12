<template>
    <div class="categoryList">
        <div class="heade">
            <h3>类别管理</h3>
            <el-button
                type="primary"
                size="mini"
                @click="() => append()">
                新增分类
            </el-button>
        </div>
        <div>
            <el-tree
                :data="list"
                show-checkbox
                node-key="id"
                accordion
                :default-expand-all="false"
                :props="defaultProps"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="node_name">{{node.label}}</span>
                    <span class="node_edit">
                        <el-button
                            type="info"
                            size="mini"
                            @click="() => view(data.id)">
                            查看/编辑
                        </el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            @click="() => remove(data.id)">
                            删除
                        </el-button>
                    </span>
                </span>
            </el-tree>
            <!-- 分类详情/编辑弹框 -->
            <el-dialog
                title="分类详情"
                :visible.sync="categoryVisible"
                width="600px">
                <div class="categoryBox">
                    <el-form ref="form" :model="form" label-width="140px" >
                        <el-form-item label="父级类别：" v-if="form.parent_id!=0">
                            <el-select v-model="form.parent_id" placeholder="请选择父级">
                                <el-option v-for="item in firstList" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类名称：">
                            <el-input v-model="form.cate_name"></el-input>
                        </el-form-item>
                        <el-form-item label="是否展示：">
                            <el-switch 
                                v-model="form.cate_status"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="是否启用：">
                            <el-switch 
                                v-model="form.is_show"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="分类属性：" v-if="form.parent_id!=0">
                            <el-checkbox-group 
                                v-model="form.cate_attrs"
                                :min="1">
                                <el-checkbox v-for="(item,index) in cate_attrsList" :label="item" :key="index">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="categoryVisible = false">取 消</el-button>
                    <el-button type="primary" @click="categoryVisible = false">修 改</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {categoryList} from "@/http/category.js"
import qs from 'qs'
export default {
    data(){
        return{
            list:[],//分类列表
            defaultProps: {
                children: 'sub',
                label: 'cate_name'
            },
            categoryVisible:false,//分类详情弹框
            firstList:[],//一级类目列表
            form:{
                parent_id:0,
                cate_name: '',
                cate_status:0,
                is_show:0,
                sort:0,
                cate_attrs: [],
            },
            cate_attrsList:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            categoryList().then((res)=>{
                this.list = JSON.parse(JSON.stringify(res.data.data.data))
            })
        },
        view(id){
            this.$axios.get(`backend/product/category/${id}`,{}).then((res)=>{
                if(res.data.code == 200){
                    categoryList({first:1}).then((res)=>{
                        this.firstList = res.data.data
                    })
                    this.categoryVisible = true
                    this.form = res.data.data
                    this.cate_attrsList = res.data.data.cate_attrs
                }
            })
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },
        remove(id) {
            this.$axios.delete(`backend/product/category/${id}`,{}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        },
    }
}
</script>
<style scope>
    .el-tree-node__content{
        height: 40px;
    }
    .custom-tree-node{
        min-width: 400px;
    }
    .node_name{
        display: inline-block;
        min-width: 300px;
    }
    .categoryBox .el-input{
        width: 200px;
    }
</style>