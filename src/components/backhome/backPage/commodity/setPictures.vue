<template>
    <div class="setpictures">
        <div class="heade">
            <h3>颜色图片设置管理</h3>
        </div>
        <div class="setpicCenter">
            <p class="tip">颜色图片上传尺寸说明：图片大小不超过500KB，宽高必须是80*80</p>
            <el-form :inline="true">
                <el-form-item v-for="(item,key,index) in color" :label="`${item}：`" :key="index">
                    <div @click="getAttrId(key)">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :data="mainType"
                            name="image"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="images[key]" :src="images[key]" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="setImagesSub()">设置图片</el-button>
        </div>
    </div>
</template>
<script>
import {uploadUrl,settingSave} from '@/http/commodity.js'
export default {
    data(){
        return{
            pic_id:'',
            color:{},
            images:{},
            attrid:'',//当前设置图片的id
            //上传图片
            uploadUrl:uploadUrl,
            mainType:{
                type:'spu_attr'
            },
        }
    },
    created(){
        this.pic_id = this.$route.query.id
        if(this.pic_id){
           this.getpicAttr() 
        }
    },
    methods:{
        //获取属性
        getpicAttr(){
            this.$axios.get(`/backend/product/sku/commonAttribute/${this.pic_id}`,{}).then((res)=>{
                if(res.data.data){
                    this.color = res.data.data.attrs.Color
                    this.images = res.data.data.color_img
                    for(var item in this.color){
                        if(this.images[item] == undefined){
                            this.$set(this.images,item,'')
                        }
                    }
                    console.log(this.images)
                }
            })
        },
        //获取当前属性id
        getAttrId(id){
            this.attrid = id
        },
        //确认设置图片
        setImagesSub(){
            let pre={
                images:this.images,
                product_id:this.pic_id
            }
            settingSave(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.$router.go(-1)
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //图片上传成功回调
        handleAvatarSuccess(res, file) {
            if(res.code == 200){
                this.images[this.attrid] = res.data
            }else{
                return false
            }
            
        },
        //图片上传之前回调
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 < 500 ;
            if (!isLt2M) {
                this.$message.error('颜色图片大小不能超过500kb!');
            }
            var _this = this;
            const isSize = new Promise(function(resolve, reject) {
                let width = 80;
                let height = 80;
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
                _this.$message.error('颜色图片宽高必须是80*80!');
                return false
            });

            return isSize && isLt2M;
        }
    }
}
</script>
<style scoped>
.setpicCenter p{
    font-size: 12px;
    font-weight: bolder;
    color: red;
    height: 50px;
    line-height: 50px;
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
    font-size: 20px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border:1px solid #e5e5e5;
}
.avatar {
    width: 120px;
    height: 120px;
    display: block;
    border:1px solid #e5e5e5;
}
</style>