<template>
    <div class="aftersale">
        <div class="heade">
            <h3>退款理由</h3>
        </div>
        <div class="btn">
            <el-button type="primary" @click="addAfterSale()">新建</el-button>
            <el-button type="danger" @click="bothDeleteAttr()">批量删除</el-button>
        </div>
        <el-table :data="saleList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="return_reason" label="退货原因"></el-table-column>
            <el-table-column prop="sort_order" label="优先级"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否上传凭证">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_upload == 1">是</span>
                    <span v-if="scope.row.is_upload == 0">否</span>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="添加时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editAttr(scope.row.id,2)">编辑</el-button>
                    <el-button type="danger" @click="deleteAttr(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增售后 -->
        <el-dialog
            title="添加退货原因"
            :visible.sync="afterVisible"
            width="400px">
            <el-form v-model="addform" label-width="100px">
                <el-form-item label="退货原因：">
                    <el-input v-model="addform.return_reason" @change="nameisTrue"></el-input>
                </el-form-item>
                <el-form-item label="优先级：">
                    <el-input v-model="addform.sort_order"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-switch 
                        v-model="addform.status"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="上传凭证：">
                    <el-radio-group v-model="addform.is_upload">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="afterVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSub()" :disabled="flag">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {afterList,createdSale,deleteSale,batchdeleteSale,saledetail,saledetailSub} from '@/http/system.js'
export default {
    data(){
        return{
            page:1,
            pageSize:10,
            total:0,
            saleList:[],
            //退货原因弹框
            afterVisible:false,
            addform:{
                return_reason:'',
                sort_order:100,
                is_upload:1,
                status:1
            },
            flag:true,
            selectId: [],//选中的列表id
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //批量选择
        handleSelectionChange(val){
            this.selectId = val
        },
        //获取列表
        getList(){
            afterList().then((res)=>{
                if(res.data.code == 200){
                    this.saleList = res.data.data
                }
            })
        },
        //单个删除售后列表
        deleteAttr(id){
            deleteSale({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'已删除',
                        type: 'success'
                    });
                    this.getList()
                }
            })
        },
        //批量删除
        bothDeleteAttr(){
            if(this.selectId.length == 0){
                this.$message({
                    message:'请先勾选要删除的售后原因',
                    type: 'warning'
                });
            }else{
                var idattr = []
                for(var i=0;i<this.selectId.length;i++){
                    var id = this.selectId[i].id
                    idattr.push(id)
                }
                console.log(idattr)
                this.$confirm('确定要删除以下售后列表?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchdeleteSale({id:idattr.join(',')}).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        //编辑售后
        editAttr(id,type){
            saledetail({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.addform = res.data.data
                    this.type = type
                    this.afterVisible = true
                }
            })
        },
        //新增弹框
        addAfterSale(){
            this.afterVisible = true
        },
        //验证售后原因
        nameisTrue(){
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(!patt1.test(this.addform.return_reason)){
                this.$message({
                    message:'售后原因只能是英文',
                    type: 'error'
                });
                this.addform.return_reason = ''
                return false
            }else{
                this.flag = false
            }
        },
        //新建售后原因
        addSub(){
            if(this.type == 1){
                createdSale(this.addform).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message:'新建成功',
                            type: 'success'
                        });
                        this.afterVisible = false
                        this.getList()
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                }) 
            }else if(this.type == 2){
                saledetailSub(this.addform).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message:'修改成功',
                            type: 'success'
                        });
                        this.afterVisible = false
                        this.getList()
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                }) 
            }
            
        }
    }
}
</script>
<style scoped>
    .btn{
        margin-bottom:10px;
    }
</style>