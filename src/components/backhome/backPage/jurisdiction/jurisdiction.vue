<template>
    <div class="jurisdiction">
        <div class="heade">
            <h3>权限管理</h3>
        </div>
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="角色：">
                <el-select v-model="searchForm.role" clearable>
                    <el-option v-for="(item,index) in roleList" :label="item.role_name" :value="item.role_name" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="searchForm.status" clearable>
                    <el-option label="开启" value="1"></el-option>
                    <el-option label="关闭" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList()">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addRole()">新 建</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="success">开启</el-tag>
                    <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
                    <el-button type="warning" size="small" @click="resetPass(scope.row.id)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑权限弹框 -->
        <el-dialog
            title="编辑"
            :visible.sync="editDialog"
            width="460px">
            <el-form :model="editForm" label-width="120px">
                <el-form-item label="用户名：">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select v-model="editForm.role">
                        <el-option v-for="(item,index) in roleList" :label="item.role_name" :value="item.role_name" :key="index"></el-option>
                    </el-select>
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
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="edituserSub()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新建权限弹框 -->
        <el-dialog
            title="新建"
            :visible.sync="newDialog"
            width="460px">
            <el-form :model="addFrom" label-width="120px">
                <el-form-item label="用户名：">
                    <el-input v-model="addFrom.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="addFrom.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select v-model="addFrom.role">
                        <el-option v-for="(item,index) in roleList" :label="item.role_name" :value="item.role_name" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-switch
                        v-model="addFrom.status"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newDialog = false">取 消</el-button>
                <el-button type="primary" @click="adduserSub()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {userIndex,updateUser,resetUserPass,createUser} from "@/http/jurisdiction.js"
export default {
    data(){
        return{
            searchForm:{
                role:'',
                status:'',
                username:''
            },
            roleList:[],//角色列表
            list:[],
            editDialog:false,//编辑权限弹框
            editForm:{
                role:'',
                status:'',
                id:'',
                username:''
            },
            //新建
            newDialog:false,
            addFrom:{
                username:'',
                password:'',
                role:'',
                status:'',
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            userIndex(this.searchForm).then((res)=>{
                this.list = res.data.data.user
                this.roleList = res.data.data.role
            })
        },
        //查询
        searchList(){
            this.getList()
        },
        //编辑权限
        editUser(obj){
            this.editDialog = true
            this.editForm.role = obj.role_name
            this.editForm.status = obj.status
            this.editForm.username = obj.username
            this.editForm.id = obj.id
        },
        //编辑权限提交
        edituserSub(){
            updateUser(this.editForm).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.editDialog = false
                    this.getList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //重置密码
        resetPass(id){
            this.$confirm('确定要重置密码吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                resetUserPass({id:id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '已重置',
                            type: 'success'
                        });
                        this.getList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        //新建权限
        addRole(){
            this.newDialog = true
        },
        adduserSub(){
            console.log(this.addFrom)
            createUser(this.addFrom).then((res)=>{

            })
        }
    }
}
</script>
<style scoped>

</style>
