<template>
    <div class="classification">
        <div class="heade">
            <h3>分类对应关系列表</h3>
            <el-button type="primary" @click="addcategory()"><i class="el-icon-plus"></i> 新增对应关系 </el-button>
        </div>
        <el-table :data="List" border style="width: 100%" max-height="700">
            <el-table-column prop="erp_cat_id" label="ERP分类ID"></el-table-column>
            <el-table-column prop="erp_cat_name" label="ERP分类名称"></el-table-column>
            <el-table-column prop="web_first_name" label="网站一级分类名称"></el-table-column>
            <el-table-column prop="web_first_id" label="网站一级分类ID"></el-table-column>
            <el-table-column prop="web_sec_name" label="网站二级分类名称"></el-table-column>
            <el-table-column prop="web_sec_id" label="网站二级分类ID"></el-table-column>
            <el-table-column prop="operator" label="操作者"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column prop="updated_at" label="操作时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editList(scope.row.id,scope.row.erp_cat_id,scope.row.erp_cat_name,scope.row.web_sec_id)">编 辑</el-button>
                    <el-button @click="delList(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="foot">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!-- 对应关系弹框 -->
        <el-dialog
            title="对应关系"
            :visible.sync="categoryVisible"
            width="600px">
            <div class="categoryBox">
                <el-form label-width="160px" :model="form" :rules="rules" ref="form">
                    <el-form-item label="ERP分类ID:" prop="erp_cat_id">
                        <el-input v-model="form.erp_cat_id"></el-input>
                    </el-form-item>
                    <el-form-item label="ERP分类名称:" prop="erp_cat_name">
                        <el-input v-model="form.erp_cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="网站二级分类名称:" prop="web_sec_id">
                        <el-select v-model="form.web_sec_id" placeholder="请选择">
                            <el-option
                                v-for="item in ClassIIList"
                                :key="item.id"
                                :label="item.cate_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="editcategory()" class="editBtn" v-if="btnShow == true">修 改</el-button>
                <el-button type="primary" @click="addcategorySub('form')" class="editBtn" v-if="btnShow == false">创 建</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {classlist,ClassII,addCategorylist} from '@/http/category.js'
import qs from 'qs'
export default {
    data(){
        return{
            total:0,
            List:[],
            categoryVisible:false,
            form:{
                erp_cat_id:'',
                erp_cat_name:'',
                web_sec_id:'',
            },
            btnShow:true,
            catList:[],
            ClassIIList:[],//二级分类列表
            cateId:'',//二级分类id
            cat_id:'',//编辑对应关系对应id
            rules:{
                erp_cat_id:[
                    { required: true, message: 'ERP分类ID必填', trigger: 'blur' }
                ],
                erp_cat_name:[
                    {required: true, message: 'ERP分类名称必填', trigger: 'blur'}
                ],
                web_sec_id:[
                    {required: true, message: '网站二级分类必选', trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取列表
        getList(){
            classlist().then((res)=>{
                this.List = res.data.data.data
                this.total = res.data.data.total
            })
        },
        //删除列表
        delList(id){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/backend/product/webCategory/${id}`,{}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.getList()
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //获取二级类目
        getClassII(){
            ClassII().then((res)=>{
                this.ClassIIList = res.data.data
            })
        },
        //编辑对应关系
        editList(id,id1,str,id2){
            this.cat_id = id
            this.form.erp_cat_id = id1
            this.form.erp_cat_name = str
            this.form.web_sec_id = id2
            this.categoryVisible = true
            this.btnShow = true
            this.getClassII()
        },
        //编辑对应关系提交
        editcategory(){
            this.$axios.put(`/backend/product/webCategory/${this.cat_id}`,qs.stringify(this.form)).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                }
                this.categoryVisible = false
                this.getList()
            })
        },
        //新增对应关系
        addcategory(){
            this.form.erp_cat_id = ''
            this.form.erp_cat_name = ''
            this.form.web_sec_id = ''
            this.getClassII()
            this.btnShow = false
            this.categoryVisible = true
        },
        addcategorySub(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addCategorylist(this.form).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                type: 'success',
                                message: '创建成功!'
                            });
                            this.categoryVisible = false
                            this.getList()
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            });
                        }
                    })
                }else{
                    return false
                }
            })
                
            
        }
    }
}
</script>
<style>
.heade{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.heade h3{
    margin-right: 20px;
}
.categoryBox{
    min-height: 400px;
    position: relative;
}
.categoryBox .el-input{
    width: 220px;
}
.editBtn{
    position: absolute;
    bottom:20px;
    right:20px;
}
</style>
