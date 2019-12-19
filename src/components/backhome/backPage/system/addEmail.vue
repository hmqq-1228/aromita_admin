<template>
    <div class="addEmail">
        <div class="heade">
            <h3 v-if="!emailId">新建服务邮件</h3>
            <h3 v-if="emailId">编辑服务邮件</h3>
        </div>
        <el-form ref="emailForm" :rules="rules" :model="emailForm" label-width="140px">
            <el-form-item label="邮箱中文名称：" prop="cn_name">
                <el-input v-model="emailForm.cn_name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱英文名称：" prop="en_name">
                <el-input v-model="emailForm.en_name"></el-input>
            </el-form-item>
            <el-form-item label="邮件内容：" prop="content">
                <div class="editBox">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :data="mainType"
                        name="image"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                        :show-file-list="false"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :before-upload="beforeUpload">
                    </el-upload>
                    <quill-editor v-model="emailForm.content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="handleEditorBlur($event)"
                        @focus="handleEditorFocus($event)">
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item label="发件邮箱：" prop="send_email">
                <el-input v-model="emailForm.send_email"></el-input>
            </el-form-item>
            <el-form-item label="发件频率：">
                <el-input v-model="emailForm.send_rate" style="width:120px"></el-input> 秒
            </el-form-item>
            <el-form-item label="状态：">
                <el-radio-group v-model="emailForm.status">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveEmail('emailForm')">保存</el-button>
                <el-button type="info" @click="cancelEmail">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {uploadUrl} from '@/http/commodity.js'
import {createEmail,editEmailDetail,editEmail} from '@/http/system.js'
import toolbarOptions from '../toolbarOptions'
import qs from 'qs'
export default {
    data(){
        var cn_name = (rule, value, callback) => {
            var patt1=/[\u4e00-\u9fa5]+$/
            if(value != '' && !patt1.test(value)){
                callback(new Error('邮箱中文名只能是中文'));
            }else if(value != '' && value.length >50){
                callback(new Error('长度不能超过50个字符'));
            }else {
                callback();
            }
        };
        var en_name = (rule, value, callback) => {
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(value != '' && !patt1.test(value)){
                callback(new Error('邮箱英文名只能是英文'));
            }else {
                callback();
            }
        };
        return{
            emailId:'',//编辑邮箱id
            emailForm:{
                status:1,
                cn_name:'',
                en_name:'',
                send_email:'',
                content:'',
                send_rate:''
            },
            //编辑器
            editorOption: {
                placeholder: '',
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: toolbarOptions,  // 工具栏
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    document.querySelector('.avatar-uploader input').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            uploadUrl:uploadUrl,
            mainType:{
                type:'detail'
            },
            //校验规则
            rules:{
                cn_name:[
                    { validator: cn_name, trigger: 'blur' },
                    { required: true, message: '邮箱中文名必填', trigger: 'blur' },
                ],
                en_name:[
                    { validator: en_name, trigger: 'blur' },
                    { required: true, message: '邮箱英文名必填', trigger: 'blur' },
                ],
                content:[
                    { required: true, message: '邮箱内容必填', trigger: 'blur' }
                ],
                send_email:[
                    { required: true, message: '发件邮箱必填', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.emailId = this.$route.query.id
        if(this.emailId){
            this.getEmailDetail()
        }
    },
    methods:{
        //获取邮箱内容
        getEmailDetail(){
            editEmailDetail({id:this.emailId}).then((res)=>{
                if(res.data.code == 200){
                    this.emailForm = res.data.data
                }
            })
        },
        //检验邮箱中文名
        isTrue(){
            var patt1=/[\u4e00-\u9fa5]+$/
            if(!patt1.test(this.emailForm.cn_name)){
                this.$message({
                    message:'邮箱中文名只能是中文',
                    type: 'error'
                });
                this.emailForm.cn_name = ''
                return false
            }
        },
        //保存邮箱
        saveEmail(form){
            this.$refs[form].validate((valid) => {
                if(valid){
                    if(this.emailId){
                        editEmail(this.emailForm).then((res)=>{
                            if(res.data.code == 200){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$router.push({path:"/servicemail"})
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    }else{
                        createEmail(this.emailForm).then((res)=>{
                            if(res.data.code == 200){
                                this.$message({
                                    message: '新建成功',
                                    type: 'success'
                                });
                                this.$router.push({path:"/servicemail"})
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                }else{
                    this.$message.warning('输入有误')
                }
            })
        },
        //取消保存邮箱
        cancelEmail(){
            this.$router.push({path:"/servicemail"})
        },
        uploadError() {
            this.$message.error('图片插入失败')
        },
        uploadSuccess(res, file){
            // 首先获取富文本编辑器的实例
            let quill = this.$refs.myQuillEditor.quill
            // 上传成功所执行
            if (res.code == 200 && res.data !== null) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片res为服务器返回的数据
                quill.insertEmbed(length, 'image', res.data)
                // 光标移动至文本末端
                quill.setSelection(length + 1)
            } else {
                this.$message.error('图片插入失败')
            }
        },
        beforeUpload(file) {
            //this.fileUpload.file=file;
            // 显示loading动画
            //this.quillUpdateImg = true
        },
        handleEditorBlur () {
            if(!this.emailForm.content){
                this.$message({
                    message: '邮件内容不能为空',
                    type: 'error'
                });
            }
        },
        handleEditorFocus () {}
    }
}
</script>
<style scoped>
.editBox{
    width: 1200px;
    height: 500px;
}
.editBox .quill-editor{
    width: 1200px!important;
    height: 400px!important;
}
.addEmail .el-input{
    width: 240px!important;
}
</style>