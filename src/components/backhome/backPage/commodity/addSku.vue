<template>
    <div class="addsku">
        <div class="heade">
            <h3>新建SKU</h3>
        </div>
        <div class="addSkuDetail">
            <el-form :model="skuform" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="商品编号：" prop="name">
                    <el-autocomplete
                        v-model="sku_no"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入SKU编码"
                        @select="handleSelect"
                        @blur="handleChange">
                    </el-autocomplete>
                </el-form-item>
                <div v-if="this.skuform!=null">
                    <el-form-item label="商品名称：" prop="name">
                        <el-input v-model="skuform.sku_name" width="200px"></el-input>
                    </el-form-item>
                    <el-form-item label="商品主图：" prop="name">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :data="mainType"
                            name="image"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="skuform.sku_image" :src="skuform.sku_image" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品副图：" prop="name">
                        <el-upload
                            :action="uploadUrl"
                            :file-list="skuform.thumbnail_images"
                            list-type="picture-card"
                            :data="thumbType"
                            name="image[]"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="SKU单位：" prop="name">
                        <span>{{skuform.sku_unit}}</span>
                    </el-form-item>
                    <el-form-item label="净重：" prop="name">
                        <span>{{skuform.net_weight}}</span>
                    </el-form-item>
                    <el-form-item label="体积重：" prop="name">
                        <span>{{skuform.heavy_volume}}</span>
                    </el-form-item>
                    <el-form-item label="优先级：" prop="name">
                        <el-input v-model="skuform.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="一级类别名称：" prop="name">
                        <el-select v-model="skuform.first_cate_id" filterable placeholder="请输入一级类目" @change="changeClassI(skuform.first_cate_id)">
                            <el-option v-for="(item,index) in firstList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级类别名称：" prop="name">
                        <el-select v-model="skuform.second_cate_id" filterable placeholder="请输入二级类目" @change="changeClassII(skuform.second_cate_id)">
                            <el-option v-for="(item,index) in secondList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上货价：" prop="name">
                        <span>{{skuform.goods_price}}</span>
                    </el-form-item>
                    <el-form-item label="推荐售价：" prop="name">
                        <span>{{skuform.recommend_price}}</span>
                    </el-form-item>
                    <el-form-item label="最终售价：" prop="name">
                        <el-input v-model="skuform.sku_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态：" prop="name">
                        <el-select v-model="skuform.sku_status" filterable placeholder="请选择商品状态">
                            <el-option label="下架" :value='0'></el-option>
                            <el-option label="正常销售" :value='1'></el-option>
                            <el-option label="补货中" :value='2'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="库存：" prop="name">
                        <span>{{skuform.inventory}}</span>
                    </el-form-item>
                    <el-form-item label="是否允许刷新库存：" prop="name">
                        <el-radio v-model="skuform.inventory_allow_update" :label='1'>是</el-radio>
                        <el-radio v-model="skuform.inventory_allow_update" :label='0'>否</el-radio>
                    </el-form-item>
                    <el-form-item label="属性和属性值：" prop="name">
                        <el-checkbox-group v-model="checkList">
                            <div v-for="(item,index) in attrEditionList" :key="index">
                                <div><el-checkbox :label="item.id">{{item.attr_name}}</el-checkbox></div>
                                <div class="radioGroup" v-if="checkList.find(n =>n == Number(item.id))">
                                    <el-radio-group>
                                        <el-radio v-for="(item1,index1) in item.values" :key="index1" :label="item1.attr_value"></el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="商品卖点：" prop="name">
                        <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="skuform.main_feature">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="name">
                        <el-button type="primary">提 交</el-button>
                        <el-button type="info">取 消</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import {uploadUrl,skunoList,skuerp,attrEdition} from '@/http/commodity.js'
import {categoryList,Classlinkage} from "@/http/category.js"
export default {
    data(){
        return{
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
        this.getAttrEdition()
    },
    methods:{
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
                if(res.data.code ==200){
                    this.skuform = res.data.data
                    var thumbnail_images = res.data.data.thumbnail_images
                    var urlList = []
                    for(var i=0;i<thumbnail_images.length;i++){
                        var urlStr ={"url":thumbnail_images[i]}
                        urlList.push(urlStr)
                    }
                    this.skuform.thumbnail_images = urlList
                    this.getFirstList()
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
                this.changeClassII(this.skuform.second_cate_id)
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
            var secondAttrList = this.secondList.find(n=>n.id == secondId).cate_attrs
            var attrDefaultCheack = []
            for(var i=0;i<secondAttrList.length;i++){
                var num = Number(secondAttrList[i].attr_id)
                attrDefaultCheack.push(num)
            }
            //复选框绑定默认值
            this.checkList = attrDefaultCheack
            console.log(this.checkList)
        },
        //获取属性和属性值
        getAttrEdition(){
            attrEdition().then((res)=>{
                this.attrEditionList = res.data.data
            })
        },
        //商品主图
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //商品副图
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
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
</style>
