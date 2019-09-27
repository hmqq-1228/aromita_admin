<template>
    <div class="addspu">
        <div class="heade">
            <h3 v-if="type == 0">SPU新建</h3>
            <h3 v-if="type == 1">SPU编辑</h3>
        </div>
        <div class="addspuCenter">
            <el-form ref="form" :rules="rules" :model="addspuform" label-width="120px">
                <el-form-item label="请输入SKU：" prop="name">
                    <el-input type="textarea" :rows="10" v-model="addspuform.sku_nos" placeholder="SKU以回车键隔开"></el-input>
                </el-form-item>
                <el-form-item label="SPU描述：">
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
                        <quill-editor v-model="addspuform.product_detail"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="handleEditorBlur($event)"
                            @focus="handleEditorFocus($event)">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addspuSub()" v-if="type == 0">新建</el-button>
                    <el-button type="primary" @click="addspuSub()" v-if="type == 1">修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {addSpuList,uploadUrl} from '@/http/commodity.js'
import toolbarOptions from '../toolbarOptions'
export default {
    data(){
        return{
            editor:null,
            editSpuId:'',//spuid
            type:0,
            addspuform:{
                sku_nos:'',
                product_detail:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入SKU编码', trigger: 'blur,change' }
                ]
            },
            //上传图片
            uploadUrl:uploadUrl,
            mainType:{
                type:'detail'
            },
            imageUrl:'',
            docContent:null,
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
        }
    },
    mounted() {

    },
    created(){
        this.editSpuId = this.$route.query.id
        if(this.editSpuId){
            this.getSpuDetail()
            this.type = 1
        }
    },
    methods:{
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
        handleEditorBlur () {},
        handleEditorFocus () {},
        //回车符替换
        foo(str){
            var temp = str.split(/[\n,]/g).join(',');
            return temp
        },
        //获取spu详情
        getSpuDetail(){
            this.$axios.get(`/backend/product/edit/${this.editSpuId}`,{}).then((res)=>{
                if(res.data.code === 200){
                    this.addspuform.product_detail = res.data.data.detail.product_detail
                    var skuArr = res.data.data.edit_sku
                    var arr = []
                    for(var i=0;i<skuArr.length;i++){
                        let skunos = skuArr[i].sku_no
                        arr.push(skunos)
                    }
                    this.addspuform.sku_nos = arr.join(',')
                }
            })
        },
        //新建spu
        addspuSub(){
            var nos = this.foo(this.addspuform.sku_nos)
            let pre={
                sku_nos:nos,
                product_detail:this.addspuform.product_detail
            }
            addSpuList(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '新建SPU成功',
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
        }
    }
}
</script>
<style scoped>
.addspuCenter .el-textarea{
    width:400px!important;
}
.editBox{
    width: 1200px;
    height: 500px;
}
.addspuCenter .quill-editor{
    width: 1200px!important;
    height: 400px!important;
}
.addspu .el-input{
    width: 300px!important;
}
</style>
