<template>
    <div class="commodity">
        <div class="heade">
            <h3>待上货商品管理</h3>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="SKU管理" name="first">
                <div class="skuCenter">
                    <el-form :inline="true" :model="skusearchForm">
                        <el-form-item label="是否分配SPU：">
                            <el-select v-model="skusearchForm.has_spu" clearable>
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品状态：">
                            <el-select v-model="skusearchForm.sku_status" clearable>
                                <el-option label="正常销售" :value='1'></el-option>
                                <el-option label="下架" :value='0'></el-option>
                                <el-option label="补货中" :value='2'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="skusearchForm.product_no" clearable placeholder="请输入SPU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="skusearchForm.sku_name" clearable placeholder="请输入SKU名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="skusearchForm.sku_no" clearable placeholder="请输入SKU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSkuList()">查 询</el-button>
                        </el-form-item>
                        <!-- <el-form-item>
                            <el-button type="primary">批量新建</el-button>
                        </el-form-item> -->
                        <el-form-item>
                            <router-link to="/addSku">
                                <el-button type="primary">新 建</el-button>
                            </router-link>
                        </el-form-item>
                        <el-form-item>
                            <router-link to="/batchNew">
                                <el-button type="primary">批量新建SKU</el-button>
                            </router-link>
                        </el-form-item>
                        <!-- <el-form-item>
                            <el-button type="danger" @click="batchdelete()">批量删除</el-button>
                        </el-form-item> -->
                        <el-form-item v-if="this.skuStatus == 0">
                            <el-button type="warning" @click="batchUpperOrLower(1)">批量上架</el-button>
                        </el-form-item>
                        <el-form-item v-if="this.skuStatus === 1">
                            <el-button type="danger" @click="batchUpperOrLower(0)">批量下架</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="skuTable"
                        style="width: 100%"
                        max-height="680px"
                        v-loading="skuLoading">
                        <!-- <el-table-column type="selection" width="45"></el-table-column> -->
                        <el-table-column prop="date" label="商品" width="280px">
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
                        <el-table-column label="操作" width="310px">
                            <template slot-scope="scope">
                                <el-button type="warning" v-if="scope.row.sku_status == 0" @click="UpperOrLower(scope.row.id,1)">上架</el-button>
                                <el-button type="danger" v-if="scope.row.sku_status == 1" @click="UpperOrLower(scope.row.id,0)">下架</el-button>
                                <el-button type="primary" @click="skuDetail(scope.row.id)">详情</el-button>
                                <el-button type="primary" @click="editorAddSku(scope.row.id)">编辑</el-button>
                                <!-- <el-button type="danger" @click="deleteSku(scope.row.id)">删除</el-button> -->
                                <el-button type="danger" v-if="scope.row.is_delete == 0" @click="disableSku(scope.row.id)">禁用</el-button>
                                <el-button type="success" v-if="scope.row.is_delete == 1" @click="enableSku(scope.row.id)">启用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="skutotal"
                        @current-change="changeSkuPage">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="待上货SPU管理" name="second">
                <div class="skuCenter">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input v-model="spu_no" clearable placeholder="请输入SPU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSpuList()">查 询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <router-link to="/addSpu">
                                <el-button type="primary">新 建</el-button>
                            </router-link>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="batchgoodsSpu()">批量上货</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="batchspudelete()">批量删除</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="spuTable"
                        style="width: 100%"
                        max-height="680px"
                        @selection-change="handleSelectionChangespu">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column prop="product_no" label="SPU编号"></el-table-column>
                        <el-table-column label="SPU属性">
                            <template slot-scope="scope">
                                <span style="margin:0 10px" v-for="(item,key) in scope.row.attrs" :key="key">{{key}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="操作">
                            <template slot-scope="scope">
                                <el-button type="warning" v-if="scope.row.hasAttr == 'HAS_COLOR'" @click="setImages(scope.row.id)">设置图片</el-button>
                                <el-button type="primary" @click="editSpuList(scope.row.id)">编辑</el-button>
                                <el-button type="success" v-if="scope.row.imageIsSet == false" disabled="disabled">上货</el-button>
                                <el-button type="success" v-if="scope.row.imageIsSet == true" @click="goodsSpu(scope.row.id)">上货</el-button>
                                <el-button type="primary" @click="viewSkuList(scope.row.id)">详情</el-button>
                                <el-button type="success" v-if="scope.row.attrs.length!=0" @click="viewSort(scope.row.id)">属性排序</el-button>
                                <el-button type="danger" @click="deleteSpu(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="sputotal"
                        @current-change="changeSpuPage()">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {skuList,spuList,deleteSkuBatch,deleteSpuBatch,spuGoods,skuGoods,skuSetEnable,skuSetDisable} from '@/http/commodity.js'
import {categoryList,ClassII} from '@/http/category.js'
export default {
    data(){
        return{
            skuLoading:false,
            pageSize:50,
            skutotal:0,//总量
            spupage:1,
            sputotal:0,//总量
            activeName:'',
            skuTable:[],//sku列表
            skusearchForm:{//sku列表查询条件
                page:1,
                has_spu:'',
                product_no:'',
                sku_name:'',
                sku_no:'',
                sku_status:''
            },
            skuStatus:-1,//sku商品状态
            firstList:[],//一级类目
            ClassIIList:[],//二级类目
            spuTable:[],//spu列表
            spu_no:'',//spu查询条件
            skuSelection:'',//已选择skuid
            spuSelection:'',//已选择spuid
        }
    },
    created(){       
        this.getFirstList()
        this.getClassII()      
    },
    methods:{
        //配置属性顺序
        viewSort(id){
            this.$router.push({path:'/attributeOrder',query:{id:id}})
        },
        //sku启用
        enableSku(id){
            skuSetEnable({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getskuList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //sku禁用
        disableSku(id){
            skuSetDisable({id:id}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getskuList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //sku列表分页器
        changeSkuPage(val){
            this.skusearchForm.page = val
            this.getskuList()
        },
        //spu列表分页器
        changeSpuPage(val){
            this.spupage = val
            this.getspuList()
        },
        //tab切换
        handleClick(tab, event){
            localStorage.setItem('commodityName', tab.name)
            if(tab.index == 1){
                this.getspuList()
            }else{
                this.getskuList()
            }
        },
        //获取一级分类列表
        getFirstList(){
            categoryList({first:1}).then((res)=>{
                if(res.data.code == 200){
                    this.firstList = res.data.data
                    //tab切换显示页面优化
                    var active_name = localStorage.getItem('commodityName')
                    if(active_name){
                        this.activeName = active_name
                    }else{
                        this.activeName = 'first'
                        this.getskuList()
                    }
                    if(this.activeName == "second"){
                        this.getspuList()
                    }else{
                        this.getskuList()
                    }
                }
            })
        },
        //获取二级类目
        getClassII(){
            ClassII().then((res)=>{
                this.ClassIIList = res.data.data
            })
        },
        //查询sku列表
        searchSkuList(){
            this.skusearchForm.page = 1
            this.skuStatus = Number(this.skusearchForm.sku_status)
            this.getskuList()
        },
        //sku列表
        getskuList(){
            this.skuLoading = true
            skuList(this.skusearchForm).then((res)=>{
                if(res.data.data){
                    this.skuLoading = false
                    this.skutotal = res.data.data.total
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
                        if(str2){
                            name2= str2.cate_name
                        }
                        this.$set(list[i],'secondName',name2)
                    }
                    this.skuTable = list
                }
            })
        },
        //查询spu列表
        searchSpuList(){
            this.spupage = 1
            this.getspuList()
        },
        //spu列表
        getspuList(){
            spuList({page:this.spupage,product_no:this.spu_no,product_status:0}).then((res)=>{
                this.spuTable = res.data.data.data
                this.sputotal = res.data.data.total
            })
        },
        //sku单个上下架
        UpperOrLower(id,status){
            skuGoods({ids:id,status:status}).then((res)=>{
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.getskuList()
            })
        },
        //sku批量上下架
        batchUpperOrLower(status){
            if(!this.skuSelection){
                this.$message({
                    message: '请选择要操作的SKU',
                    type: 'warning'
                });
            }else{
                this.UpperOrLower(this.skuSelection,status)
            }
        },
        //查看sku详情
        skuDetail(skuid){
            this.$router.push({ path: 'skuDetail', query: { id: skuid }})
        },
        //单个删除sku
        deleteSku(skuid){
            this.$confirm('此操作将永久删除该sku, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`backend/product/sku/${skuid}`,{}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '删除成功',
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
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });   
        },
        //批量勾选sku
        // handleSelectionChange(val) {
        //     var arr = []
        //     for(var i=0;i<val.length;i++){
        //         var skuid = val[i].id
        //         arr.push(skuid)
        //     }
        //     this.skuSelection = arr.join(',')
        //     console.log(this.skuSelection)
        // },
        //批量勾选spu
        handleSelectionChangespu(val) {
            var arr = []
            for(var i=0;i<val.length;i++){
                var spuid = val[i].id
                arr.push(spuid)
            }
            this.spuSelection = arr.join(',')
        },
        //批量删除sku
        batchdelete(){
            if(!this.skuSelection){
                this.$message({
                    message: '请选择要删除的SKU',
                    type: 'warning'
                });
            }else{
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSkuBatch({ids:this.skuSelection}).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '删除成功',
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        //单个删除spu
        deleteSpu(spuid){
            this.$confirm('删除SPU后，该SPU下的SKU会被禁用，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/backend/product/${spuid}`,{}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getspuList()
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //spu上货
        _spuGoods(id){
            spuGoods({ids:id,status:1}).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '上货成功',
                        type: 'success'
                    });
                    this.getspuList()
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //spu单个上货
        goodsSpu(spuid){
            this._spuGoods(spuid)
        },
        //spu批量上货
        batchgoodsSpu(){
            if(!this.spuSelection){
                this.$message({
                    message: '请选择要上货的SPU',
                    type: 'warning'
                });
            }else{
                this._spuGoods(this.spuSelection)
            }
        },
        //批量删除spu
        batchspudelete(){
            if(!this.spuSelection){
                this.$message({
                    message: '请选择要删除的SPU',
                    type: 'warning'
                });
            }else{
                this.$confirm('删除SPU后，该SPU下的SKU会被同步删除，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSpuBatch({ids:this.spuSelection}).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getspuList()
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        //编辑spu
        editSpuList(id){
            this.$router.push({ path:'/addSpu', query: { id: id }}) 
        },
        //查看spu下的sku列表
        viewSkuList(id){
            this.$router.push({ path:'/spuskulist', query: { id: id }}) 
        },
        //设置图片
        setImages(id){
            this.$router.push({ path:'/setpictures', query: { id: id }}) 
        },
        //编辑sku
        editorAddSku(id){
            this.$router.push({ path:'/addSku', query: { id: id }}) 
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
