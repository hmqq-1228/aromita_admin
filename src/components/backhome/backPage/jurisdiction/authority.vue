<template>
    <div class="authority">
        <div class="heade">
            <h3>权限配置</h3>
        </div>
        <div class="btn">
            <el-button @click="setRole" type="primary">保存设置</el-button>
            <el-button @click="cancelRole" type="info">取消设置</el-button>
        </div>
        <div class="tree">
            <el-tree
                :props="props"
                :data="rolelist"
                node-key="id"
                show-checkbox
                :default-checked-keys="this.role_permission"
                :default-expand-all="true"
                :check-on-click-node="true"
                ref="tree"
                @check-change="handleCheckChange">
            </el-tree>
        </div>
    </div>
</template>
<script>
import {fqRole,dofqRole} from '@/http/jurisdiction.js'
export default {
    data(){
        return{
            roleid:'',
            props: {
                label: 'name',
                children: 'children'
            },
            rolelist:[],//权限列表
            role_permission:[],//已配置的权限
            permission_id:''
        }
    },
    created(){
        this.roleid = this.$route.query.id
        if(this.roleid !=''){
            this.getData()
        }
    },
    methods:{
        getData(){
            fqRole({id:this.roleid}).then((res)=>{
                //默认绑定id数据处理
                var role_permission = res.data.data.role_permission
                var permissionId = []
                for(var i=0;i<role_permission.length;i++){
                    permissionId.push(role_permission[i].permission_id)
                }
                this.role_permission = permissionId
                this.permission_id = this.role_permission.join(',')

                //全部菜单数据处理
                var rolelist = res.data.data.all_permission
                var fristAttr = []
                var childList = []
                for(var i=0;i<rolelist.length;i++){
                    var obj = rolelist[i]
                    if(obj.parent_id == 0){
                        fristAttr.push(obj)
                    }else{
                        childList.push(obj)
                    }
                }

                for(var i=0;i<fristAttr.length;i++){
                    var obj = childList.filter(n=>n.parent_id == fristAttr[i].id)
                    fristAttr[i]["children"] = obj
                }

                this.rolelist = fristAttr
            })
        },
        handleCheckChange(data) {
            let res = this.$refs.tree.getCheckedNodes()
            let arr = []
            res.forEach((item) => {
                arr.push(item.id)
                arr.push(item.parent_id)
            })
            var arr1 = Array.from(new Set(arr))
            var str = arr1.join(',')
            this.permission_id = str
        },
        //设置权限
        setRole(){
            let pre={
                id:this.roleid,
                permission_id:this.permission_id
            }
            dofqRole(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.$router.push({path:'/role'})
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        cancelRole(){
            this.$router.push({path:'/role'})
        }
    }
}
</script>
<style>
.authority .el-checkbox__inner{
    margin:0 6px 0 2px!important;
}
.btn{
    padding:0 0 20px 0;
}
.tree{
    max-height: 760px;
    overflow-y: scroll
}
</style>