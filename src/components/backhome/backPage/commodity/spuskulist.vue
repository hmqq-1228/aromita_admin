<template>
    <div class="spuskulist">
        <div class="heade">
            <h3>SPU详情</h3>
        </div>
        <div class="spudetailCenter" v-if="detail">
            <div class="detailCenter">
               <div class="list"><b>SPU编码：</b>{{detail.product_no}}</div>
               <div class="list">
                   <b>SPU属性与属性值：</b>
                   <br>
                   <p v-for="(item,key,index) in detail.attrs" :key="index">
                       <span>{{key}}:</span>
                       <el-tag v-for="(item1,index1) in item" :key="index1" type="success">{{item1}}</el-tag>
                    </p>
                </div>
            </div>
            <h4>SKU列表</h4>
            <el-table
                :data="skuTable"
                border
                style="width: 100%"
                max-height="700px">
                <el-table-column label="商品" width="300px">
                    <template slot-scope="scope">
                        <div class="sku">
                            <img :src="scope.row.small_sku_img" alt="">
                            <div>
                                <p>SKU:{{scope.row.sku_no}}</p>
                                <P v-if="scope.row.product">SPU:{{scope.row.product.product_no}}</P>
                                <p class="shop_name">商品名称:{{scope.row.sku_name}}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="优先级"></el-table-column>
                <el-table-column prop="fristName" label="一级类别名称"></el-table-column>
                <el-table-column prop="secondName" label="二级类别名称"></el-table-column>
                <el-table-column prop="recommend_price" label="推荐售价"></el-table-column>
                <el-table-column prop="sku_price" label="最终售价"></el-table-column>
                <el-table-column prop="sku_status_cn" label="商品状态"></el-table-column>
                <el-table-column prop="date" label="是否允许更新库存">
                    <template slot-scope="scope">
                        <span>{{scope.row.inventory_allow_update == 0?'不允许':'允许'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="inventory" label="库存"></el-table-column>
            </el-table>

            <h4>SPU描述</h4>
            <div>{{detail.detail.product_detail}}</div>
        </div>
    </div>
</template>
<script>
import {categoryList,ClassII} from '@/http/category.js'
export default {
    data(){
        return{
            SpuId:'',//spuid
            skuTable:[],//sku列表
            detail:null,
            firstList:[],//一级类目
            ClassIIList:[],//二级类目
        }
    },
    created(){
        this.SpuId = this.$route.query.id
        if(this.SpuId){
            this.getFirstList()
            this.getClassII()  
            this.getSpuDetail()
        }
    },
    methods:{
        //获取一级分类列表
        getFirstList(){
            categoryList({first:1}).then((res)=>{
                this.firstList = res.data.data
            })
        },
        //获取二级类目
        getClassII(){
            ClassII().then((res)=>{
                this.ClassIIList = res.data.data
            })
        },
        //获取spu详情
        getSpuDetail(){
            this.$axios.get(`/backend/product/${this.SpuId}`,{}).then((res)=>{
                if(res.data.data){
                    this.detail = res.data.data
                    var list = res.data.data.pskus
                    for(var i=0;i<list.length;i++){
                        //一级类目
                        var str = this.firstList.find(n => n.id == list[i].first_cate_id)
                        var name = ""
                        if(str){
                            name= str.cate_name
                        }
                        this.$set(list[i],'fristName',name)
                        //二级类目
                        var str2 = this.ClassIIList.find(n => n.id == list[i].second_cate_id)
                        var name2 = ""
                        if(str){
                            name2= str.cate_name
                        }
                        this.$set(list[i],'secondName',name2)
                    }
                    this.skuTable = list
                }
            })
        },
    }
}
</script>
<style scope>
h4{
    height: 50px;
    line-height: 50px;
}
.detailCenter .list{
    margin:20px 0;
    overflow: hidden;
}
.detailCenter .list b{
    float: left;
    display:block;
}
.detailCenter .list p{
    margin:10px 10px;
}
.el-tag{
    margin:0 10px!important;
}
.sku{
    display: flex;
    width: 240px;
}
.sku img{
    width:80px;
    height: 80px;
    margin-right: 10px;
}
.sku p{
    text-align: left;
}
.shop_name{
    width: 120px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>