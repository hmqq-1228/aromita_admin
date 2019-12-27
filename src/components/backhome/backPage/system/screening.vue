<template>
    <div class="system">
        <div class="heade">
            <h3>属性值筛选设置</h3>
        </div>
        <div class="systemCenter">
            <el-form :model="attrform" label-width="140px">
                <el-form-item label="属性名称：">
                    <span>{{attrform.attr_name}}</span>
                </el-form-item>
                <el-form-item label="在前台显示：">
                    <el-radio-group v-model="attrform.search_show">
                        <el-radio :label="1" disabled>是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="在前台显示顺序：" :required="attrform.search_show == 1?true:false">
                    <el-input v-model="attrform.sort_order"></el-input>                   
                </el-form-item>
            </el-form>
            <el-form label-width="140px">
                <div v-for="(item,index) in attrValueList" :key="index">
                    <el-form-item label="属性值：">
                        <span>{{item.attr_value}}</span>
                    </el-form-item>
                    <el-form-item label="在前台显示：">
                        <el-radio-group v-model="item.search_show">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="在前台显示顺序：">
                        <el-input v-model="item.sort_order"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div class="btn">
                <el-button type="primary" @click="saveAttr()">保存</el-button>
                <el-button type="info" @click="cancelAttr()">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {atrrEdit,attrSet,attrUpdate} from '@/http/system.js'
export default {
    data(){
        return{
            systemList:[],//属性列表
            attrList:null,
            attrValueList:[],//属性值列表
            attrform:{},
            required:false,
            errorMsg:[],//错误显示数组
        }
    },
    created(){
        this.getDatail()
    },
    methods:{
        //获取列表
        getDatail(){
            atrrEdit({id:this.$route.query.id}).then((res)=>{
                if(res.data.code == 200){
                    this.systemList = res.data.data
                    this.attrform = res.data.data.attr
                    console.log(this.attrform)
                    if(this.attrform.sort_order == null || this.attrform.sort_order == 0){
                        this.attrform.sort_order = ''
                    }
                    this.attrValueList = res.data.data.attr_val
                    var errorList = ['']
                    for(var i=0;i<this.attrValueList.length;i++){
                        errorList.push('')
                    }
                    this.errorMsg = errorList
                    if(this.attrform.search_show == 1){
                        this.required = true
                    }
                }
            })
        },
        //保存
        saveAttr(){
            var reg = new RegExp('^[1-9][0-9]*$')//匹配正整数
            var flag1 = false //属性是否满足
            var flag2 = false //属性值是否满足

            
            //属性值校验
            if(this.attrform.search_show == 1 && this.attrform.sort_order != '' && !reg.test(this.attrform.sort_order)){
                this.$message({
                    message:'属性在前台显示排序值必填，且为正整数1',
                    type: 'warning'
                });
                return false
            }else if(this.attrform.search_show == 1 && this.attrform.sort_order == ''){
                this.attrform.sort_order = 1
                flag1 = true
            }

            console.log(this.attrform.sort_order)
            if(this.attrform.search_show != 1 && this.attrform.sort_order!='' && !reg.test(this.attrform.sort_order)){
                this.$message({
                    message:'属性在前台显示排序值必须是正整数',
                    type: 'warning'
                });
                flag1 = false
            }else if(this.attrform.search_show != 1 && this.attrform.sort_order == ''){
                flag1 = true
            }else{
                flag1 = true
            }

            var idAttr = []//属性值id
            var search_show = []//属性值显示
            var sort_order = []//属性值排序
            console.log(this.attrValueList)
            for(var i=0;i<this.attrValueList.length;i++){
                idAttr.push(this.attrValueList[i].id)
                search_show.push(this.attrValueList[i].search_show)
                if(this.attrValueList[i].sort_order != null){
                    sort_order.push(this.attrValueList[i].sort_order)
                }else{
                    sort_order.push('')
                }
            }

            //属性值校验
            if(this.attrform.search_show == 1){
                for(var i =0;i<search_show.length;i++){
                    if(search_show[i] == 1 && (sort_order[i] == '' || !reg.test(sort_order[i]))){
                        this.$message({
                            message:'属性值在前台显示时，排序值必填，且必须是正整数',
                            type: 'warning'
                        });
                        return false
                    }else if(search_show[i] != 1 && !reg.test(sort_order[i]) && sort_order[i]!=''){
                        this.$message({
                            message:'属性值在前台显示的排序值必须是正整数',
                            type: 'warning'
                        });
                        return false
                    }else{
                        flag2 = true
                    }
                }
            }else if(this.attrform.search_show == 0){
                if(sort_order[0]!=null){
                    for(var j=0;j<sort_order.length;j++){
                        if(sort_order[j]!='' && !reg.test(sort_order[j])){
                            this.$message({
                                message:'排序值必须是正整数',
                                type: 'warning'
                            });
                            return false
                        }else{
                            flag2 = true
                        }
                    }   
                }
                
            }
            
            console.log(flag1,flag2)
            if( flag1 == true && flag2 == true){
                let pre={
                    attr_id:this.attrform.id,
                    attr_search_show:this.attrform.search_show,
                    attr_sort_order:this.attrform.sort_order,
                    id:idAttr.join(','),
                    val_search_show:search_show.join(','),
                    val_sort_order:sort_order.join(',')
                }
                this.setAttr(pre)
            }
        },
        setAttr(pre){
            attrUpdate(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message:'保存成功',
                        type: 'success'
                    });
                    this.$router.push({path:'/system'})
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //取消
        cancelAttr(){
            this.$router.push({path:'/system'})
        }
    }
}
</script>
<style scope>
.system .el-input{
    width: 200px!important;
}
.btn{
    padding-left: 50px;
}
</style>