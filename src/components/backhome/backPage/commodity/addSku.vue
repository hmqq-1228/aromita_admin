<template>
    <div class="addsku">
        <div class="heade">
            <h3>新建SKU</h3>
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
                            :on-success="thumbnailSuccess"
                            :on-error="thumbnailError">
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
                        <el-select v-model="skuform.second_cate_id" filterable placeholder="请输入二级类目" @change="changeClassII(skuform.second_cate_id)">
                            <el-option v-for="(item,index) in secondList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上货价：">
                        <span>{{skuform.goods_price}}</span>
                    </el-form-item>
                    <el-form-item label="推荐售价：">
                        <span>{{skuform.recommend_price}}</span>
                    </el-form-item>
                    <el-form-item label="最终售价：">
                        <el-input v-model="skuform.sku_price"></el-input>
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
                        <el-checkbox-group v-model="checkList">
                            <div v-for="(item,index) in attrEditionList" :key="index">
                                <div><el-checkbox :label="item.id">{{item.attr_name}}</el-checkbox></div>
                                <div class="radioGroup" v-if="checkList.find(n =>n == Number(item.id))">
                                    <el-radio-group v-model="item.radioId">
                                        <el-radio v-for="(item1,index1) in item.values" :key="index1" :label="item1.id">{{item1.attr_value}}</el-radio>
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
                            v-model="skuform.main_feature">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addSkuSub()" v-if="!this.editSkuId">新 建</el-button>
                        <el-button type="primary" @click="addSkuSub()" v-if="this.editSkuId">修 改</el-button>
                        <!-- <el-button type="info">取 消</el-button> -->
                    </el-form-item>
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
            editSkuId:'',//编辑用skuID
            //sku远程搜索
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
            //fileList:[],
            thumbType:{
                type:'thumbnail'
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    created(){
        this.editSkuId = this.$route.query.id
        if(this.editSkuId){
            this.skuDetail()
        }
        this.getAttrEdition()
        this.getFirstList()
    },
    methods:{
        //编辑用sku详情
        skuDetail(){
            this.$axios.get(`backend/product/sku/${this.editSkuId}`,{}).then((res)=>{
                if(res.data.code === 200){
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
                    var attr = JSON.parse(res.data.data.sku_attrs)
                    //复选框绑定默认值
                    var attrDefaultCheack = []
                    for(var i=0;i<attr.length;i++){
                        var num = Number(attr[i].id)
                        attrDefaultCheack.push(num)
                    }
                    this.checkList = attrDefaultCheack
                    //单选框绑定默认值
                    for(var i=0;i<this.attrEditionList.length;i++){
                        for(var j=0;j<attr.length;j++){
                            if(this.attrEditionList[i].values.find(n=>n.id == attr[j].value.id)){
                                this.attrEditionList[i].radioId = attr[j].value.id
                            }
                        }
                    }
                }
            })
        },
        //sku远程搜索
        querySearchAsync(queryString, cb) {
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
        },
        //选择远程搜索值
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
            skuerp({sku_no:this.sku_no}).then((res)=>{
                if(res.data.code == 200){
                    this.skuform = res.data.data
                    var thumbnail_images = res.data.data.thumbnail_images
                    var urlList = []
                    for(var i=0;i<thumbnail_images.length;i++){
                        var urlStr ={"url":thumbnail_images[i]}
                        urlList.push(urlStr)
                    }
                    this.skuform.thumbnail_images = urlList
                    if(res.data.data.first_cate_id == 0){
                        this.skuform.first_cate_id = ''
                    }
                    if(res.data.data.second_cate_id == 0){
                        this.skuform.second_cate_id = ''
                    }
                    this.defaultClassII(this.skuform.first_cate_id)
                }else{
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
                this.secondList = res.data.data
                if(this.skuform.second_cate_id!=0){
                    this.changeClassII(this.skuform.second_cate_id)
                }
            })
        },
        //改变一级类目,更新二级类目
        changeClassI(par_id){
            Classlinkage({parent_id:par_id}).then((res)=>{
                this.skuform.second_cate_id = ''
                this.secondList = res.data.data
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
        //新建sku提交
        addSkuSub(){
            var attrs = []
            var attrs1 = []
            //获取选中的属性和属性值
            for(var i=0;i<this.attrEditionList.length;i++){
                if(this.attrEditionList[i].radioId != ""){
                    var obj = this.attrEditionList[i]
                    attrs.push(obj)
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
                console.log(imgStr)
                imgattr.push(imgStr)
            }
            myForm.thumbnail_images = imgattr
            //添加属性数据
            this.$set(myForm,'attrs',attrs1)
            this.$set(myForm,'sku_no',this.sku_no)
            console.log(myForm)
            //请求接口
            if(!this.editSkuId){
                //请求新增接口
                addNewSku(myForm).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }else{
                for(var key in myForm){
                    delete myForm['sku_attrs'];
                }
                //请求修改接口
                this.$axios.put(`backend/product/sku/${this.editSkuId}`,qs.stringify(myForm)).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
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
            this.skuform.sku_image = res.data
        },
        //商品图片上传之前限制
        beforeAvatarUpload(file) {
            console.log(file)
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
                return Promise.reject();
            });

            return isSize && isLt2M;
        },
        //商品副图移除
        handleRemove(file, fileList) {
            console.log(fileList);
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
            }
        },
        thumbnailError(file, fileList){
            console.log(file)
            console.log(fileList)
        }
    }
}
</script>
<style>
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
