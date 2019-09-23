<template>
    <div class="setpictures">
        <div class="heade">
            <h3>颜色属性图片设置管理</h3>
        </div>
        <div class="setpicCenter">
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
            this.images[this.attrid] = res.data
        },
        //图片上传之前回调
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
        }
    }
}
</script>
<style scoped>
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