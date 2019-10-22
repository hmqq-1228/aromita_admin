<template>
    <div class="authority">
        <div class="heade">
            <h3>权限配置</h3>
        </div>
        <el-tree
            :props="props"
            :data="rolelist"
            show-checkbox
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
                children: 'children'
            },
            rolelist:[]
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
                for(var i=0;i<rolelist.length;i++){
                    for(var j=0;j<rolelist.length;j++){
                        if(rolelist[i].parent_id == rolelist[j].id){
                            rolelist[j]["children"] = []
                            rolelist[j]["children"].push(rolelist[i])
                        }
                    }  
                }
                this.rolelist = rolelist
            })
        },
        handleCheckChange(){
            
        }
    }
}
</script>