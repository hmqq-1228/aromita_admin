<template>
    <div class="addspu">
        <div class="heade">
            <h3 v-if="type == 0">SPU新建</h3>
            <h3 v-if="type == 1">SPU编辑</h3>
        </div>
        <div class="addspuCenter">
            <el-form ref="form" :rules="rules" :model="addspuform" label-width="120px">
                <el-form-item label="请输入SKU：" prop="name">
                    <el-input type="textarea" :rows="10" v-model="addspuform.sku_nos" placeholder="SKU以回车键隔开"></el-input>
                </el-form-item>
                <el-form-item label="SPU描述：">
                    <el-input type="textarea" :rows="30" v-model="addspuform.product_detail" placeholder="请输入HTML代码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addspuSub()" v-if="type == 0">新建</el-button>
                    <el-button type="primary" @click="addspuSub()" v-if="type == 1">修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {addSpuList} from '@/http/commodity.js'
export default {
    data(){
        return{
            editSpuId:'',//spuid
            type:0,
            addspuform:{
                sku_nos:'',
                product_detail:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入SKU编码', trigger: 'blur,change' }
                ]
            }
        }
    },
    created(){
        this.editSpuId = this.$route.query.id
        if(this.editSpuId){
            this.getSpuDetail()
            this.type = 1
        }
    },
    methods:{
        //回车符替换
        foo(str){
            var temp = str.split(/[\n,]/g).join(',');
            return temp
        },
        //获取spu详情
        getSpuDetail(){
            this.$axios.get(`/backend/product/edit/${this.editSpuId}`,{}).then((res)=>{
                if(res.data.code === 200){
                    this.addspuform.product_detail = res.data.data.detail.product_detail
                    var skuArr = res.data.data.edit_sku
                    var arr = []
                    for(var i=0;i<skuArr.length;i++){
                        let skunos = skuArr[i].sku_no
                        arr.push(skunos)
                    }
                    this.addspuform.sku_nos = arr.join(',')
                    // this.detail = res.data.data
                    // this.attr = JSON.parse(this.detail.sku_attrs)
                }
            })
        },
        addspuSub(){
            var nos = this.foo(this.addspuform.sku_nos)
            let pre={
                sku_nos:nos,
                product_detail:this.addspuform.product_detail
            }
            addSpuList(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '新建SPU成功',
                        type: 'success'
                    });
                    this.getskuList()
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>
<style>
.addspuCenter{
    width: 600px;
}
.el-input{
    width: 300px!important;
}
</style>
