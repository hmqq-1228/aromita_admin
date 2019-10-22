<template>
    <div class="authority">
        <div class="heade">
            <h3>权限配置</h3>
        </div>
        <el-tree
            :props="props"
            :data="rolelist"
            node-key="id"
            show-checkbox
            :default-checked-keys="[2,3]"
            @check-change="handleCheckChange">
        </el-tree>
    </div>
</template>
<script>
import {fqRole} from '@/http/jurisdiction.js'
export default {
    data(){
        return{
            roleid:'',
            props: {
                label: 'name',
                children: 'children',
                id:'id'
            },
            rolelist:[],//权限列表
            role_permission:[],//已配置的权限
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
                var rolelist = res.data.data.all_permission
                this.role_permission = res.data.data.role_permission
                for(var i=0;i<rolelist.length;i++){
                    for(var j=0;j<rolelist.length;j++){
                        if(rolelist[i].parent_id == rolelist[j].id){
                            rolelist[j]["children"] = []
                            rolelist[j]["children"].push(rolelist[i])
                        }
                    }  
                }
                var attr = []
                for(var i=0;i<rolelist.length;i++){
                    if(rolelist[i].parent_id == 0){
                        attr.push(rolelist[i])
                    }
                }
                this.rolelist = attr
                console.log(this.rolelist)
            })
        },
        handleCheckChange(){
            
        }
    }
}
</script>