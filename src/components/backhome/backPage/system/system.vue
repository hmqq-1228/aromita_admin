<template>
    <div class="system">
        <div class="heade">
            <h3>属性值筛选</h3>
        </div>
        <el-table
            :data="systemList"
            style="width: 100%"
            max-height="780px">
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="screening(scope.row.id)">设置</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {getSystemList} from '@/http/system.js'
export default {
    data(){
        return{
            systemList:[],//属性列表
        }
    },
    created(){
        this.getList()
    },
    methods:{
        //获取列表
        getList(){
            getSystemList().then((res)=>{
                if(res.data.code == 200){
                    this.systemList = res.data.data
                }
            })
        },
        //跳转到设置详情页
        screening(id){
            this.$router.push({path:'/screening',query:{id:id}})
        }
    }
}
</script>
<style scope>

</style>