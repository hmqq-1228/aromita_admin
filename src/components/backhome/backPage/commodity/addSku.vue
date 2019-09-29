<template>
    <div
        class="addsku"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
        <div class="heade">
            <h3 v-if="!this.editSkuId">新建SKU</h3>
            <h3 v-if="this.editSkuId">编辑SKU</h3>
        </div>
        <div class="addSkuDetail">
            <el-form :model="skuform" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="商品编号：" v-if="!this.editSkuId">
                    <el-autocomplete
                        v-model="sku_no"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入SKU编码"
                        @select="handleSelect">
                    </el-autocomplete>
                    <el-button @click="handleChange" type="primary">搜 索</el-button>
                </el-form-item>
                <el-form-item label="商品编号：" v-if="this.editSkuId">
                    <span>{{sku_no}}</span>
                </el-form-item>
                <div>
                    <div v-if="this.skuform!=null">
                        <el-form-item label="商品名称：">
                            <el-input v-model="skuform.sku_name" width="400px"></el-input>
                        </el-form-item>
                        <el-form-item label="商品主图：">
                            <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :data="mainType"
                                name="image"
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="skuform.sku_image" :src="skuform.sku_image" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="商品副图：">
                            <el-upload
                                :action="uploadUrl"
                                :file-list="skuform.thumbnail_images"
                                list-type="picture-card"
                                :data="thumbType"
                                name="image[]"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :before-upload="beforeAvatarUpload"
                                :on-success="thumbnailSuccess">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <el-form-item>
                            <b class="imgTips">商品图片大小不能超过500kb，商品图片宽高必须是1024*1024</b>
                        </el-form-item>
                        <el-form-item label="SKU单位：">
                            <span>{{skuform.sku_unit}}</span>
                        </el-form-item>
                        <el-form-item label="净重：">
                            <span>{{skuform.net_weight}}</span>
                        </el-form-item>
                        <el-form-item label="体积重：">
                            <span>{{skuform.heavy_volume}}</span>
                        </el-form-item>
                        <el-form-item label="优先级：">
                            <el-input v-model="skuform.sort"></el-input>
                        </el-form-item>
                        <el-form-item label="一级类别名称：">
                            <el-select v-model="skuform.first_cate_id" filterable placeholder="请输入一级类目" @change="changeClassI(skuform.first_cate_id)">
                                <el-option v-for="(item,index) in firstList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="二级类别名称：">
                            <span v-if="this.secondList.length == 0">该一级类目下无二级类目，请先创建二级类目</span>
                            <el-select v-else v-model="skuform.second_cate_id" filterable placeholder="请输入二级类目" @change="changeClassII(skuform.second_cate_id)">
                                <el-option v-for="(item,index) in secondList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上货价：">
                            <span>$ {{skuform.goods_price}}</span>
                        </el-form-item>
                        <el-form-item label="推荐售价：">
                            <span>$ {{skuform.recommend_price}}</span>
                        </el-form-item>
                        <el-form-item label="最终售价：">
                            <span> $ </span><el-input v-model="skuform.sku_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品状态：">
                            <el-select v-model="skuform.sku_status" filterable placeholder="请选择商品状态">
                                <el-option label="下架" :value='0'></el-option>
                                <el-option label="正常销售" :value='1'></el-option>
                                <el-option label="补货中" :value='2'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库存：">
                            <span>{{skuform.inventory}}</span>
                        </el-form-item>
                        <el-form-item label="是否允许刷新库存：">
                            <el-radio v-model="skuform.inventory_allow_update" :label='1'>是</el-radio>
                            <el-radio v-model="skuform.inventory_allow_update" :label='0'>否</el-radio>
                        </el-form-item>
                        <el-form-item label="属性和属性值：">
                            <el-checkbox-group v-model="checkList" @change="changeCheckList()">
                                <div v-for="(item,index) in attrEditionList" :key="index">
                                    <div><el-checkbox :label="item.id" :disabled="disabled">{{item.attr_name}}</el-checkbox></div>
                                    <div class="radioGroup" v-if="checkList.find(n =>n == Number(item.id))">
                                        <el-radio-group v-model="item.radioId">
                                            <el-radio v-for="(item1,index1) in item.values" :key="index1" :label="item1.id" :disabled="disabled">{{item1.attr_value}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="商品卖点：">
                            <el-input
                                type="textarea"
                                :rows="4"
                                placeholder="请输入内容"
                                maxlength="400"
                                show-word-limit
                                v-model="skuform.main_feature">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addSkuSub()" v-if="!this.editSkuId">新 建</el-button>
                            <el-button type="primary" @click="addSkuSub()" v-if="this.editSkuId">修 改</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import {uploadUrl,skunoList,skuerp,attrEdition,addNewSku} from '@/http/commodity.js'
import {categoryList,Classlinkage} from "@/http/category.js"
import qs from 'qs'
export default {
    data(){
        return{
            loading:false,
            productId:0,//不为0时，属性不可编辑
            disabled:false,//属性是否禁用
            editSkuId:'',//编辑用skuID
            //sku远程查询
            restaurants: [],
            firstList:[],//一级类目
            secondList:[],//二级类目
            //上传图片
            uploadUrl:uploadUrl,
            sku_no:'',//sku编码
            skuform:null,
            rules:{},
            attrEditionList:[],//属性列表
            checkList:[],//绑定的属性列表
            radioList:[],//属性值列表
            Attribute_value:[],//绑定的属性值列表
            imageUrl: '',//商品主图
            mainType:{
                type:'main'
            },
            //商品副图
            thumbType:{
                type:'thumbnail'
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    created(){
        this.getAttrEdition()
        this.getFirstList()
        this.editSkuId = this.$route.query.id
        if(this.editSkuId){
            this.skuDetail()
        }
    },
    methods:{
        //编辑用sku详情
        skuDetail(){
            this.loading = true
            this.$axios.get(`backend/product/sku/${this.editSkuId}`,{}).then((res)=>{
                if(res.data.code === 200){
                    this.productId = res.data.data.product_id
                    if(this.productId !=0){
                        this.disabled = true
                    }
                    this.loading = false
                    this.skuform = res.data.data
                    this.sku_no = res.data.data.sku_no
                    var thumbnail_images = res.data.data.thumbnail_images
                    var urlList = []
                    for(var i=0;i<thumbnail_images.length;i++){
                        var urlStr ={"url":thumbnail_images[i]}
                        urlList.push(urlStr)
                    }
                    this.skuform.thumbnail_images = urlList
                    this.defaultClassII(this.skuform.first_cate_id)
                    var attr = []
                    if(res.data.data.sku_attrs != ''){
                        attr = JSON.parse(res.data.data.sku_attrs)
                        //复选框绑定默认值
                        var attrDefaultCheack = []
                        for(var i=0;i<attr.length;i++){
                            var num = Number(attr[i].id)
                            attrDefaultCheack.push(num)
                        }
                        this.checkList = attrDefaultCheack
                    }
                    //单选框绑定默认值
                    if(this.attrEditionList.length!=0){
                        for(var i=0;i<this.attrEditionList.length;i++){
                            for(var j=0;j<attr.length;j++){
                                if(this.attrEditionList[i].values.find(n=>n.id == attr[j].value.id)){
                                    this.attrEditionList[i].radioId = attr[j].value.id
                                }
                            }
                        }
                    }
                }
            })
        },
        //sku远程查询
        querySearchAsync(queryString, cb) {
            if(!queryString){
                return false
            }else{
                var list = [];
                skunoList({sku_no:queryString}).then((res)=>{
                    var skulist = res.data.data
                    for(var i=0;i<skulist.length;i++){
                        var obj = {"value":skulist[i]}
                        list.push(obj)
                    }
                    cb(list);
                }).catch((error)=>{
                    console.log(error);
                });
            }
        },
        //选择远程查询值
        handleSelect(item) {
            this.sku_no = item.value
            this.getSkuErp()
        },
        //用户输入sku编码
        handleChange(){
            this.skuform = null
            this.getSkuErp()
        },
        //输入skuNum获取erp信息
        getSkuErp(){
            this.loading = true
            skuerp({sku_no:this.sku_no}).then((res)=>{
                if(res.data.code == 200){
                    this.loading = false
                    this.skuform = res.data.data
                    //商品副图数据格式更改
                    var thumbnail_images = res.data.data.thumbnail_images
                    var urlList = []
                    for(var i=0;i<thumbnail_images.length;i++){
                        var urlStr ={"url":thumbnail_images[i]}
                        urlList.push(urlStr)
                    }
                    this.skuform.thumbnail_images = urlList
                    //一级类目
                    if(res.data.data.first_cate_id == 0 && this.firstList){
                        this.skuform.first_cate_id = this.firstList[0].id
                        this.defaultClassII(this.firstList[0].id)
                    }else{
                        this.defaultClassII(this.skuform.first_cate_id)
                    }
                    
                }else{
                    this.loading = false
                    this.$message.error(res.data.msg);
                }
            })
        },
        //获取一级分类列表
        getFirstList(){
            categoryList({first:1}).then((res)=>{
                this.firstList = res.data.data
            })
        },
        //获取默认的二级类目列表
        defaultClassII(par_id){
            Classlinkage({parent_id:par_id}).then((res)=>{
                if(res.data.data){
                    this.secondList = res.data.data
                }
                if(this.secondList.length!=0){
                    if(this.skuform.second_cate_id!=0){
                        this.changeClassII(this.skuform.second_cate_id)
                    }else{
                        this.skuform.second_cate_id = this.secondList[0].id
                    }
                }
            })
        },
        //改变一级类目,更新二级类目
        changeClassI(par_id){
            Classlinkage({parent_id:par_id}).then((res)=>{
                this.secondList = res.data.data
                if(this.secondList.length!=0){
                    this.skuform.second_cate_id = this.secondList[0].id
                }
            })
        },
        //选择二级类目,获取该类目下的属性
        changeClassII(secondId){
            //该二级类目下的属性列表
            if(this.secondList.length!=0){
                var secondAttrList = this.secondList.find(n=>n.id == secondId).cate_attrs
            }
            if(!this.editSkuId){
                var attrDefaultCheack = []
                for(var i=0;i<secondAttrList.length;i++){
                    var num = Number(secondAttrList[i].attr_id)
                    attrDefaultCheack.push(num)
                }
                //复选框绑定默认值
                this.checkList = attrDefaultCheack
            }
        },
        //获取属性和属性值
        getAttrEdition(){
            attrEdition().then((res)=>{
                this.attrEditionList = res.data.data
                for(var i=0;i<this.attrEditionList.length;i++){
                    this.$set(this.attrEditionList[i],'radioId','')
                }
            })
        },
        //改变复选框选中值
        changeCheckList(){
            // console.log(this.checkList,'0000')
            // console.log(this.attrEditionList,'1111')
        },
        //新建sku提交
        addSkuSub(){
            var attrs = []
            var attrs1 = []
            //获取选中的属性和属性值
            if(this.checkList.length!=0){
                for(var i=0;i<this.attrEditionList.length;i++){
                    if(this.checkList.find(n =>n == this.attrEditionList[i].id) && this.attrEditionList[i].radioId != ""){
                        var obj = this.attrEditionList[i]
                        attrs.push(obj)
                    }else if(this.checkList.find(n =>n == this.attrEditionList[i].id) && this.attrEditionList[i].radioId == ""){
                        this.$message({
                            message: '请勾选对应属性值',
                            type: 'warning'
                        });
                        return false
                    }
                }
            }
            //处理属性和属性值数据结构
            for(var m = 0;m<attrs.length;m++){
                var obj1 = attrs[m].values.find(n=>n.id == attrs[m].radioId)
                attrs[m].value = obj1
                var newObj = {"id":attrs[m].id,"attr_name":attrs[m].attr_name,"value":{"id":attrs[m].value.id,"attr_value":attrs[m].value.attr_value}}
                attrs1.push(JSON.stringify(newObj))
            }
            var myForm = JSON.parse(JSON.stringify(this.skuform))
            //处理副图的数据格式
            var thumbnail_images = myForm.thumbnail_images
            var imgattr = []
            for(var i=0;i<thumbnail_images.length;i++){
                var imgStr = thumbnail_images[i].url
                imgattr.push(imgStr)
            }
            myForm.thumbnail_images = imgattr
            //添加属性数据
            if(attrs1.length == 0){
                this.$set(myForm,'attrs','')
            }else{
                this.$set(myForm,'attrs',attrs1)
            }
            this.$set(myForm,'sku_no',this.sku_no)
            //请求接口
            if(!this.editSkuId){
                //请求新增接口
                console.log(myForm)
                console.log(myForm.second_cate_id,'000000')
                if(myForm.second_cate_id == 0){
                    this.$message({
                        message: '二级分类必填',
                        type: 'warning'
                    });
                    return false
                }else{
                    addNewSku(myForm).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.$router.go(-1)
                        }else{
                            this.$message({
                                message:res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            }else{
                for(var key in myForm){
                    delete myForm['sku_attrs'];
                }
                console.log(myForm,'edit')
                //请求修改接口
                this.$axios.put(`backend/product/sku/${this.editSkuId}`,qs.stringify(myForm)).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$router.go(-1)
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }
        },
        //商品主图
        handleAvatarSuccess(res, file) {
            if(res.code == 200){
                this.skuform.sku_image = res.data
            }else{
                return false
            }
        },
        //商品图片上传之前限制
        beforeAvatarUpload(file) {
            //const isJPG = file.type === 'image/png,image/jpg,image/jpeg';
            const isLt2M = file.size / 1024 < 500 ;
            // if (!isJPG) {
            //     this.$message.error('商品图片只能是 JPG 、PNG 格式!');
            // }
            if (!isLt2M) {
                this.$message.error('商品图片大小不能超过500kb!');
            }
            var _this = this;
            const isSize = new Promise(function(resolve, reject) {
                let width = 1024;
                let height = 1024;
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                    let valid = img.width == width && img.height == height;
                    valid ? resolve() : reject();
                }
                img.src = _URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, () => {
                _this.$message.error('商品图片宽高必须是1024*1024!');
                return false
            });

            return isSize && isLt2M;
        },
        //商品副图移除
        handleRemove(file, fileList) {
            var arr = this.skuform.thumbnail_images
            var Brr = []
            arr.forEach((value,index,arr)=>{
                if(value != file){
                    Brr.push(value)
                }  
            })
            this.skuform.thumbnail_images = Brr
        },
        //商品副图查看
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //商品副图上传成功
        thumbnailSuccess(res,file,fileList){
            if(res.code == 200){
                this.skuform.thumbnail_images.push({"url":res.data[0]})
            }else{
                this.skuform.thumbnail_images = JSON.parse(JSON.stringify(this.skuform.thumbnail_images))
                return false
            }
        }
    }
}
</script>
<style>
.addsku{
    min-height:90vh;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.addSkuDetail .el-input{
    width: 340px!important;
}
.addSkuDetail .el-textarea{
    width: 340px!important;
}
.el-textarea__inner{
    width: 340px!important;
}
.radioGroup{
    padding-left:20px;
}
/* 图片上传规格说明 */
.imgTips{
    color:#F56C6C;
    font-size: 12px;
}
</style>
