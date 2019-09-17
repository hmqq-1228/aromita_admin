<template>
    <div class="skuDetail">
        <div class="heade">
            <h3>SKU详情</h3>
        </div>
        <div class="sku_detail" v-if="detail">
            <p>商品编号：{{detail.sku_no}}</p>
            <p>商品名称：{{detail.sku_name}}</p>
            <!-- <p>商品主图：{{detail.sku_image}}</p> -->
            <p>商品主图：
                <img :src="detail.sku_image" alt="">
            </p>
            <p>商品副图：
                <img v-for="(item,index) in detail.thumbnail_images" :src="item" alt="" :key="index">
            </p>
            <p>优先级：{{detail.sort}}</p>
            <p>类别名称：{{detail.second_category.cate_name}}</p>
            <p>推荐售价：{{detail.recommend_price}}</p>
            <p>最终售价：{{detail.sku_price}}</p>
            <p>库存：{{detail.inventory}}</p>
            <p>上货后销售状态：{{detail.sku_status_cn}}</p>
            <div>商品属性和属性值：
                <p v-for="(item,index) in attr" :key="index">
                    <span>{{item.attr_name}}</span>：{{item.value.attr_value}}
                </p>
            </div>
            <p>商品卖点：{{detail.main_feature}}</p>
        </div>
    </div>
</template>
<script>
import {} from '@/http/'
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
    }
</style>