<template>
    <div class="floatwinone">
        <div class="header">
            <span>广告管理-顶部浮窗广告</span>
            <router-link to="/floatwinone">
                <el-button type="primary">顶部浮窗广告</el-button>
            </router-link>
            <router-link to="/floatwintwo">
                <el-button type="primary">订阅浮窗广告</el-button>
            </router-link>
        </div>
        <div class="orderCenter">
            <el-form :model="adverteform" class="demo-form-inline" label-width="160px">
                <el-form-item label="广告名称（后台）：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="广告时段：">
                    <el-date-picker
                        v-model="adverteform.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="广告标题（前台）：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="标题链接：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="广告背景：">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :data="mainType"
                        name="image"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="adverteform.backimg" :src="adverteform.backimg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否开启倒计时：">
                    <el-radio-group v-model="adverteform.time">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告位置：">
                    <el-radio-group v-model="adverteform.position">
                        <el-radio :label="1">左对齐</el-radio>
                        <el-radio :label="2">居中</el-radio>
                        <el-radio :label="3">右对齐</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告详情：">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :data="mainType"
                        name="image"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="adverteform.detailimg" :src="adverteform.detailimg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告链接：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="是否默认广告：">
                    <el-radio-group v-model="adverteform.default">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告状态：">
                    <el-switch
                        v-model="adverteform.switch">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">保存</el-button>
                    <el-button type="danger" @click="cancel()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {uploadUrl} from '@/http/commodity.js'
export default {
    data(){
        return{
            //上传商品背景图
            uploadUrl:uploadUrl,
            mainType:{
                type:'main'
            },
            adverteform:{
                backimg:'',
                detailimg:'',
                position:1,
                time:1,
                default:0,
                switch:''
            },
        }
    },
    created(){

    },
    methods:{
        beforeAvatarUpload(){

        },
        handleAvatarSuccess(){

        },
        //取消广告设置
        cancel(){
            this.$confirm('广告设置还没有保存，确定取消吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({path:'/advertising'})
            }).catch(() => {
                          
            });
        }
    }
}
</script>
<style scoped>
.floatwinone .header{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.floatwinone .header span{
    margin-right: 20px;
    font-size: 16px;
    font-weight: bolder;
}
.floatwinone .header a{
    margin-right: 20px;
}
.floatwinone .demo-form-inline .el-input{
    width: 400px!important;
}
</style>