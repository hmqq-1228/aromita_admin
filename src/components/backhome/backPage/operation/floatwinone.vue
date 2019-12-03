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
            <el-form :model="adverteform" class="demo-form-inline" label-width="160px" ref="adverteform" :rules="rules">
                <el-form-item label="广告名称（后台）：" prop="top_ad_name"> 
                    <el-input v-model="adverteform.top_ad_name" placeholder="请输入广告名称，不超过20个字符"></el-input>
                </el-form-item>
                <el-form-item label="广告时段：" required>
                    <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change ="changetime()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="广告标题（前台）：" prop="top_ad_title">
                    <el-input v-model="adverteform.top_ad_title" placeholder="请输入广告标题，不超过50个字符且为英文"></el-input>
                </el-form-item>
                <el-form-item label="标题链接：">
                    <el-input v-model="adverteform.top_ad_title_url"></el-input>
                </el-form-item>
                <el-form-item label="是否开启倒计时：">
                    <el-radio-group v-model="adverteform.countdown_status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告位置：">
                    <el-radio-group v-model="adverteform.top_ad_location">
                        <el-radio :label="2">左对齐</el-radio>
                        <el-radio :label="1">居中</el-radio>
                        <el-radio :label="0">右对齐</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告背景色：">
                    <el-color-picker v-model="adverteform.top_ad_bgcolor"></el-color-picker>
                </el-form-item>
                <el-form-item label="字体颜色：">
                    <el-color-picker v-model="adverteform.top_ad_fontcolor"></el-color-picker>
                </el-form-item>
                <el-form-item label="广告详情：">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :data="detailType"
                        name="image"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="adverteform.top_ad_detail_image" :src="adverteform.top_ad_detail_image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告链接：">
                    <el-input v-model="adverteform.top_ad_detail_url"></el-input>
                </el-form-item>
                <el-form-item label="是否默认广告：">
                    <el-radio-group v-model="adverteform.is_default">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告状态：">
                    <el-switch
                        v-model="adverteform.status"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveAdverte('adverteform')" v-if="!adverid">保存</el-button>
                    <el-button type="primary" @click="editAdverte('adverteform')" v-if="adverid">修改</el-button>
                    <el-button type="danger" @click="cancel()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {uploadUrl} from '@/http/commodity.js'
import {addAdvert,editadvert,updatEdit} from '@/http/advert.js'
export default {
    data(){
        var adTitle = (rule, value, callback) => {
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(value === ''){
                callback(new Error('请输入广告标题'));
            }else if(value!='' && value.length > 50){
                console.log(value.length)
                callback(new Error('广告标题不能超过50个字符'));
            } else if(!patt1.test(value)){
                callback(new Error('广告标题只能为英文'));
            } else {
                callback()
            }
        };
        return{
            adverid:'',//广告id
            //上传商品背景图
            uploadUrl:uploadUrl,
            detailType:{
                type:'topaddetail'
            },
            time:[],//广告时间
            adverteform:{
                top_ad_name:'',
                top_ad_title:'',
                top_ad_fontcolor:'#fff',
                top_ad_bgcolor:'#fff',
                top_ad_title_url:'',
                countdown_status:1,
                top_ad_location:2,
                top_ad_detail_image:'',
                top_ad_detail_url:'',
                is_default:0,
                status:1,
                ad_start_time:'',
                ad_end_time:''
            },
            oldform:{},
            timetype:false,
            //表单规则
            rules:{
                top_ad_name:[
                    { required: true, message: '请输入广告名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '不能超过20个字符', trigger: 'blur' }
                ],
                top_ad_title:[
                    { validator: adTitle, trigger: 'blur' },
                    { required: true, message: '请输入广告标题', trigger: 'blur' },
                    // { min: 1, max: 50, message: '不能超过50个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.adverid = this.$route.query.id
        if(this.adverid){
            this.getdetail()
        }
    },
    methods:{
        //改变广告时间
        changetime(){
            console.log(this.time)
            this.timetype = true
        },
        //编辑广告获取详情
        getdetail(){
            editadvert({id:this.adverid}).then((res)=>{
                if(res.data.code == 200){
                    this.oldform = res.data.data
                    this.adverteform = JSON.parse(JSON.stringify(res.data.data)) 
                    this.time.push(new Date(this.adverteform.ad_start_time))
                    this.time.push(new Date(this.adverteform.ad_end_time))
                    console.log(this.time)
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        //商品图片上传之前限制
        beforeAvatarUpload(file) {
            var _this = this;
            const isSize = new Promise(function(resolve, reject) {
                let width = 1440;
                let height = 500;
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
                _this.$message.error('广告详情图片宽高必须是1440*500!');
                return false
            });
            return isSize
        },
        handleAvatarSuccess(res, file) {
            if(res.code == 200){
                this.adverteform.top_ad_detail_image = res.data
            }else{
                return false
            }
        },
        //新建广告
        saveAdverte(form){
            if(this.time && this.time.length!=0){
                this.adverteform.ad_start_time = this.time[0]
                this.adverteform.ad_end_time = this.time[1]
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        addAdvert(this.adverteform).then((res)=>{
                            if(res.data.code == 200){
                                this.$message.success('创建成功');
                                this.$router.push({path:'/advertising'})
                            }else{
                                this.$message.error(res.data.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }else{
                this.$message.warning('广告时间必填');
                this.adverteform.ad_start_time = ''
                this.adverteform.ad_end_time = ''
            }
        },
        //修改广告
        editAdverte(form){
            if(this.time && this.time.length!=0 && this.timetype == true){
                this.adverteform.ad_start_time = this.time[0]
                this.adverteform.ad_end_time = this.time[1]
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        updatEdit(this.adverteform).then((res)=>{
                            if(res.data.code == 200){
                                this.$message.success('修改成功');
                                this.$router.push({path:'/advertising'})
                            }else{
                                this.$message.error(res.data.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }else if(this.time && this.time.length!=0 && this.timetype == false){
                this.adverteform.ad_start_time = this.oldform.ad_start_time
                this.adverteform.ad_end_time = this.oldform.ad_end_time
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        updatEdit(this.adverteform).then((res)=>{
                            if(res.data.code == 200){
                                this.$message.success('修改成功');
                                this.$router.push({path:'/advertising'})
                            }else{
                                this.$message.error(res.data.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                });
                
            }else{
                this.$message.warning('广告时间必填');
                this.adverteform.ad_start_time = ''
                this.adverteform.ad_end_time = ''
            }
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