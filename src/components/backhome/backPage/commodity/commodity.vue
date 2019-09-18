<template>
    <div class="commodity">
        <div class="heade">
            <h3>待上货商品管理</h3>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="SKU管理" name="first">
                <div class="skuCenter">
                    <el-form :inline="true">
                        <el-form-item label="是否分配SPU：">
                            <el-select v-model="form.region">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SPU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SKU名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SKU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">搜 索</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">批量新建</el-button>
                        </el-form-item>
                        <el-form-item>
                            <router-link to="/addSku">
                                <el-button type="primary">新 建</el-button>
                            </router-link>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning">导入商品</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger">批量删除</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="skuTable"
                        style="width: 100%"
                        max-height="700px">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column prop="date" label="商品" width="240px">
                            <template slot-scope="scope">
                                <div class="sku">
                                    <img :src="scope.row.small_sku_img" alt="">
                                    <div>
                                        <p>SKU:{{scope.row.sku_no}}</p>
                                        <P>SPU:暂无</P>
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
                        <el-table-column label="操作" width="220px">
                            <template slot-scope="scope">
                                <el-button type="success" @click="skuDetail(scope.row.id)">详情</el-button>
                                <el-button type="primary" @click="editorAddSku(scope.row.id)">编辑</el-button>
                                <el-button type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="SPU管理" name="second">
                <div class="skuCenter">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input placeholder="请输入SPU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">搜 索</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">新 建</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">批量上货</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger">批量删除</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="spuTable"
                        style="width: 100%"
                        max-height="700px">
                        <el-table-column prop="product_no" label="SPU编号"></el-table-column>
                        <el-table-column label="SPU属性">
                            <template slot-scope="scope">
                                <p v-for="(item,key) in scope.row.attrs" :key="key">{{key}}:{{item}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="操作">
                            <template slot-scope="scope">
                                <el-button type="warning" v-if="scope.row.hasAttr == 'HAS_COLOR'">设置图片</el-button>
                                <el-button type="primary">编辑</el-button>
                                <el-button type="success" v-if="scope.row.imageIsSet == false" disabled="disabled">上货</el-button>
                                <el-button type="success" v-if="scope.row.imageIsSet == true">上货</el-button>
                                <el-button type="primary">SKU详情</el-button>
                                <el-button type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {skuList,spuList} from '@/http/commodity.js'
import {categoryList,ClassII} from '@/http/category.js'
export default {
    data(){
        return{
            activeName:'first',
            skuTable:[],//sku列表
            firstList:[],//一级类目
            ClassIIList:[],//二级类目
            spuTable:[],//spu列表
            form:{
                region:''
            }
        }
    },
    created(){
        this.getFirstList()
        this.getClassII()
        this.getskuList()
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
        //sku列表
        getskuList(){
            skuList().then((res)=>{
                var list = res.data.data.data
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
            })
        },
        //spu列表
        getspuList(){
            spuList().then((res)=>{
                this.spuTable = res.data.data.data
            })
        },
        //tab切换
        handleClick(tab, event){
            if(tab.index == 1){
                this.getspuList()
            }
        },
        //查看sku详情
        skuDetail(skuid){
            this.$router.push({ path: 'skuDetail', query: { id: skuid }})
        },
        //编辑sku
        editorAddSku(){

        }
    }
}
</script>
<style>
    .skuCenter .el-input{width:200px!important}
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
