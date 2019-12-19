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
                    <el-radio-group v-model="attrform.search_show" @change="changeAttrShow()">
                        <el-radio :label="1" disabled>是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="在前台显示顺序：" :required="required">
                    <el-input v-model="attrform.sort_order" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" @blur="attrIstrue(attrform.sort_order)"></el-input>                   
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
                        <el-input v-model="item.sort_order" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" @blur="istrue(item.sort_order,item.search_show,index)"></el-input>
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
        //改变属性名显示状态
        changeAttrShow(){
            if(this.attrform.search_show == 1){
                this.required = true
            }else{
                this.required = false
            }
        },
        //校验属性名排序值
        attrIstrue(num){
            if(this.attrform.search_show == 1 && !num){
                this.attrform.sort_order = 1
            }else if(this.attrform.search_show !=1 && !num){
                this.attrform.sort_order = ''
            }
        },
        //校验属性值排序
        istrue(num,show,index){ 
            if(this.attrform.search_show == 1 && show == 1 && !num){
                this.$message({
                    message:'在前台显示顺序必填',
                    type: 'warning'
                });
            }else if(this.attrform.search_show == 1 && show == 0 && !num){
                this.attrValueList[index].sort_order = ''

            }else if(this.attrform.search_show == 0 && !num){
                this.attrValueList[index].sort_order = ''
            }
        },
        //验证属性值等
        // validationRule(obj,str,dex){
        //     if(this.attrform.search_show == 1 && !this.attrform.sort_order){
        //         this.$message({
        //             message:'在前台显示顺序必填',
        //             type: 'warning'
        //         });
        //         this.attrform.sort_order = 1
        //         return false
        //     }else{
        //         let pre={
        //             attr_id:'',
        //             attr_search_show:'',
        //             attr_sort_order:'',
        //             id:'',
        //             val_search_show:'',
        //             val_sort_order:''
        //         }
        //         if(str == 'attr'){
        //             pre.attr_id = obj.id
        //             pre.attr_search_show = obj.search_show
        //             pre.attr_sort_order = obj.sort_order
        //         }else if(str == 'attrvalue'){
        //             pre.attr_id = this.attrform.id
        //             pre.attr_search_show = this.attrform.search_show
        //             pre.attr_sort_order = this.attrform.sort_order
        //             pre.id = obj.id
        //             pre.val_search_show = obj.search_show,
        //             pre.val_sort_order = obj.sort_order
        //         }
        //         attrSet(pre).then((res)=>{
        //             if(res.data.code != 200){
        //                 this.$message({
        //                     message:res.data.msg,
        //                     type: 'error'
        //                 });
        //             }
        //         })
        //     }
        // },
        //保存
        saveAttr(){
            var idAttr = []
            var search_show = []
            var sort_order = []
            for(var i=0;i<this.attrValueList.length;i++){
                idAttr.push(this.attrValueList[i].id)
                search_show.push(this.attrValueList[i].search_show)
                sort_order.push(this.attrValueList[i].sort_order)
            }
            if(this.attrform.search_show == 1 && !this.attrform.sort_order){
                this.$message({
                    message:'属性名在前台显示顺序必填',
                    type: 'warning'
                });
                return false
            }else{
                let pre={
                    attr_id:this.attrform.id,
                    attr_search_show:this.attrform.search_show,
                    attr_sort_order:this.attrform.sort_order,
                    id:idAttr.join(','),
                    val_search_show:search_show.join(','),
                    val_sort_order:sort_order.join(',')
                }
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
            }
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