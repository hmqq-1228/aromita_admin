<template>
    <div class="skuDetail">
        <div class="heade">
            <h3>SKU详情</h3>
        </div>
        <div class="sku_detail" v-if="detail">
            <p><b>商品编号：</b>{{detail.sku_no}}</p>
            <p><b>商品名称：</b><span class="name">{{detail.sku_name}}</span></p>
            <p><b>商品主图：</b> 
                <img :src="detail.sku_image" alt="">
            </p>
            <p><b>商品副图：</b> 
                <img v-for="(item,index) in detail.thumbnail_images" :src="item" alt="" :key="index">
            </p>
            <p><b>优先级：</b>{{detail.sort}}</p>
            <p><b>类别名称：</b>{{detail.second_category.cate_name}}</p>
            <p><b>推荐售价：</b>{{detail.recommend_price}}</p>
            <p><b>最终售价：</b>{{detail.sku_price}}</p>
            <p><b>库存：</b>{{detail.inventory}}</p>
            <p><b>上货后销售状态：</b>{{detail.sku_status_cn}}</p>
            <div class="attrList">
                <b>商品属性和属性值：</b>
                <div class="list">
                    <div v-for="(item,index) in attr" :key="index">
                        <span>{{item.attr_name}}</span>：{{item.value.attr_value}}
                    </div>
                </div>
            </div>
            <p><b>商品卖点：</b>{{detail.main_feature}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            skuid:'',//skuid
            detail:null,//sku详情
            attr:[],//商品属性列表
        }
    },
    created(){
        this.skuid = this.$route.query.id
        if(this.skuid){
            this.getDetail()
        }
    },
    methods:{
        //获取sku详情
        getDetail(){
            this.$axios.get(`backend/product/sku/${this.skuid}`,{}).then((res)=>{
                if(res.data.code === 200){
                    this.detail = res.data.data
                    this.attr = JSON.parse(this.detail.sku_attrs)
                }
            })
        }
    }
}
</script>
<style>
    .sku_detail img{
        width: 100px;
        height: 100px;
        border:1px solid #e5e5e5;
        margin:5px;
    }
    .sku_detail p{
        display: flex;
        line-height:40px;
        font-size: 16px;
    }
    .sku_detail p b{
        display: inline-block;
        min-width: 130px;
        text-align: right;
        margin-right: 10px;
    }
    .sku_detail p span{
        width: 800px;
        display: inline-block;
        overflow: hidden;
    }
    .attrList{
        overflow: hidden;
    }
    .attrList b{
        float: left;
    }
    .attrList .list{
        float: left;
    }
</style>