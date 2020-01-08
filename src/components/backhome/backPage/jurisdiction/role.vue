<template>
    <div class="roleList">
        <div class="heade">
            <h3>角色管理</h3>
            <el-button type="primary" @click="addRole(1)">新建角色</el-button>
        </div>
        <el-table :data="list">
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="success">开启</el-tag>
                    <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editRoleList(scope.row,2)">编辑</el-button>
                    <el-button type="success" @click="authority(scope.row.id)">配置权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="total"
                @current-change="changePage">
            </el-pagination>
        </div>
        <!-- 编辑/新建角色 -->
        <el-dialog title="角色管理" v-if="editVisible" :visible.sync="editVisible" :show-close="false" width="500px">
            <el-form :model="editForm" label-width="180px" :rules="rules" ref="addFrom">
                <el-form-item label="角色名（要求中文）：" prop="role_name">
                    <el-input v-model="editForm.role_name"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-switch
                        v-model="editForm.status"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel('addFrom')">取 消</el-button>
                <el-button type="primary" @click="editSub('addFrom')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {roleIndex,updateRole,createRole} from '@/http/jurisdiction.js'
export default {
    data(){
        var roleName = (rule, value, callback) => {
            var patt1=new RegExp("^[\u4E00-\u9FA5]+$");
            if(value !== '' && !patt1.test(value)){
                callback(new Error('角色名只能是中文'));
            }else {
                callback();
            }
        };
        return{
            page:1,
            pageSize:15,
            total:0,
            list:[],
            //编辑角色
            editVisible:false,
            editForm:{
                id:'',
                role_name:'',
                status:1
            },
            type:1,
            rules:{
                role_name:[
                    { validator: roleName, trigger: 'blur' },
                    { required: true, message: '角色名必填', trigger: 'blur' },
                    { min:1, max:15, message: '长度不能超过15个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //分页
        changePage(val){
            this.page = val
            this.getList()
        },
        //获取角色列表
        getList(){
            roleIndex({page:this.page}).then((res)=>{
                if(res.data.code == 200){
                    this.list = res.data.data.data
                    this.total = res.data.data.total
                }
            })
        },
        //编辑角色
        editRoleList(obj,type){
            this.editForm.id = obj.id
            this.editForm.role_name = obj.role_name
            this.editForm.status = obj.status
            this.editVisible = true
            this.type = type
        },
        //取消按钮
        cancel(formName){
            this.$refs[formName].resetFields();
            this.editVisible = false
        },
        //编辑角色提交
        editSub(addFrom){
            this.$refs[addFrom].validate((valid) => {
                if (valid) {
                    if(this.type == 1){
                        let pre={
                            role_name:this.editForm.role_name,
                            status:this.editForm.status
                        }
                        createRole(pre).then((res)=>{
                            if(res.data.code == 200){
                                this.$message({
                                    message: '新建成功',
                                    type: 'success'
                                });
                                this.editVisible = false
                                this.getList()
                            }else{
                                var msg = res.data.msg
                                var msgstr = ''
                                for(var i in msg){
                                    msgstr = msg[i][0]
                                }
                                this.$message({
                                    message:msgstr,
                                    type: 'error'
                                });
                            }
                        })
                    }else if(this.type == 2){
                        updateRole(this.editForm).then((res)=>{
                            if(res.data.code == 200){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.editVisible = false
                                this.getList()
                            }else if(res.data.code == 401){
                                this.$message({
                                    message:'更新失败',
                                    type: 'error'
                                });
                                this.editVisible = false
                            }else{
                                this.$message({
                                    message:res.data.msg,
                                    type: 'error'
                                });
                            }
                        })
                    }
                }else{
                    return false
                }
            })
            
        },
        //新建角色
        addRole(type){
            this.type = type
            this.editForm.role_name = ''
            this.editVisible = true
        },
        //配置权限
        authority(id){
            this.$router.push({path:'/authority',query:{id:id}})
        }
    }
}
</script>