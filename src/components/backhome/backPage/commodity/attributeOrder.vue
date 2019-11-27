<template>
    <div class="attributeOrder">
        <div class="heade">
            <h3>属性顺序</h3>
        </div>
        <div>
            <h3>注意事项：</h3>
            <p>1、当公有属性顺序值都一样时，在详情页会随机排序。</p>
            <p>2、数字越大，排序越靠前，数字范围≥1即可。</p>
        </div>
        <br>
        <div>
            <h3>请设置公有属性在详情页展示顺序：</h3>
        </div>
        <br>
        <div class="sortBox">
            <el-form label-width="80px" v-model="attrs">
                <el-form-item v-for="(item,index) in attrs" :key="index" :label="`${item.name}：`">
                    <el-input v-model="item.sort" @blur="sortRule(item,index)"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="saveBtn">
            <el-button type="primary" @click="saveSort">保存</el-button>
            <el-button type="info" @click="saveSort">取消</el-button>
        </div>
    </div>
</template>
<script>
import {saveAttrSort} from '@/http/commodity.js'
export default {
    data(){
        return{
            product_id:'',
            attrs:{}
        }
    },
    created(){
        this.product_id = this.$route.query.id
        if(this.product_id){
            this.getAttrDetail()
        }
    },
    methods:{
        getAttrDetail(){
            this.$axios.get(`/backend/product/sku/commonAttributeSort/${this.product_id}`).then((res)=>{
                if(res.data.code == 200){
                    this.attrs = res.data.data.attrs
                    for(var i in this.attrs){
                        if(this.attrs[i].sort == ''){
                            this.attrs[i].sort = 1
                        }
                    }
                }
            })
        },
        //排序值校验
        sortRule(num,dex){
            if(num.sort == ''){
                num.sort = 1
            }
        },
        //保存排序值
        saveSort(){
            var pre = JSON.parse(JSON.stringify(this.attrs)); 
            for(var i in pre){
                pre[i] = pre[i].sort
            }
            var sortstr = JSON.stringify(pre)
            saveAttrSort({product_id:this.product_id,attr_sort:sortstr}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.go(-1)
                }
            })
        }
    }
}
</script>
<style scoped>
.sortBox .el-input{
    width: 140px!important;
}
.saveBtn{
    padding-left: 30px;
}
</style>