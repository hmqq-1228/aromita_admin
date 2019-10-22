<template>
    <div class="roleList">
        <div class="heade">
            <h3>角色管理</h3>
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
                    <el-button type="primary" @click="editRoleList(scope.row)">编辑</el-button>
                    <el-button type="success" @click="authority(scope.row.id)">配置权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑角色 -->
        <el-dialog title="提示" :visible.sync="editVisible" width="500px">
            <el-form :model="editForm" label-width="120px">
                <el-form-item label="角色名：">
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
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSub()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {roleIndex,updateRole} from '@/http/jurisdiction.js'
export default {
    data(){
        return{
            list:[],
            //编辑角色
            editVisible:false,
            editForm:{
                id:'',
                role_name:'',
                status:1
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取角色列表
        getList(){
            roleIndex().then((res)=>{
                this.list = res.data.data
            })
        },
        //编辑角色
        editRoleList(obj){
            this.editForm.id = obj.id
            this.editForm.role_name = obj.role_name
            this.editForm.status = obj.status
            this.editVisible = true
        },
        //编辑角色提交
        editSub(){
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
        },
        //配置权限
        authority(id){
            this.$router.push({path:'/authority',query:{id:id}})
        }
    }
}
</script>