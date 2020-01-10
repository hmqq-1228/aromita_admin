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
                <el-form-item label="场景标签：">
                    <el-tree
                        :data="taglist"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        :default-checked-keys="this.tagId"
                        ref="tree"
                        @check-change="handleCheckChange">
                    </el-tree>
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
import {addSpuList,uploadUrl,aditSpuList,spuTagList} from '@/http/commodity.js'
import toolbarOptions from '../toolbarOptions'
import qs from 'qs'
export default {
    data(){
        return{
            editor:null,
            editSpuId:'',//spuid
            type:0,//判断是新建spu ,编辑spu
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
            //标签
            taglist:[],
            tagId:[],//已选择的标签
            defaultProps:{
                children: 'second',
                label: 'tag_name'
            },
            checkTag:[],//选中的标签
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
        this.gettaglist()
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
        //获取标签
        gettaglist(){
            spuTagList().then((res)=>{
                if(res.data.code== 200){
                    this.taglist = res.data.data.data
                }
            })
        },
        //勾选标签
        handleCheckChange(data) {
            let res = this.$refs.tree.getCheckedNodes()
            this.checkTag = res
        },
        //获取spu详情
        getSpuDetail(){
            this.$axios.get(`/backend/product/edit/${this.editSpuId}`,{}).then((res)=>{
                if(res.data.code === 200){
                    if(res.data.data.detail!=null){
                        this.addspuform.product_detail = res.data.data.detail.product_detail
                    }
                    var skuArr = res.data.data.edit_sku
                    var arr = []
                    for(var i=0;i<skuArr.length;i++){
                        let skunos = skuArr[i].sku_no
                        arr.push(skunos)
                    }
                    this.addspuform.sku_nos = arr.join(',')
                    this.tagId = res.data.data.tag_ids.split(',')
                }
            })
        },
        //新建spu
        addspuSub(){
            var tagarr = []
            var tagnamearr = []
            for(var i=0;i<this.checkTag.length;i++){
                var tagid = ''
                var tagname = ''
                if(this.checkTag[i].parent_id != 0){
                    tagid = this.checkTag[i].id
                    tagname = this.checkTag[i].tag_name
                    tagarr.push(tagid)
                    tagnamearr.push(tagname)
                } 
            }
            var nos = this.foo(this.addspuform.sku_nos)
            let pre={
                sku_nos:nos,
                product_detail:this.addspuform.product_detail,
                tag_ids:tagarr.join(','),
                tag_names:tagnamearr.join(',')
            }
            
            if(this.type == 0){
                addSpuList(pre).then((res)=>{
                    if(res.data.code == 200 && res.data.msg == ''){
                        this.$message({
                            message: '新建SPU成功',
                            type: 'success'
                        });
                        this.$router.go(-1)
                    }else if(res.data.code == 200 && res.data.msg != ''){
                        this.$confirm(`${res.data.msg}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$router.go(-1)
                        }).catch(() => {
                                     
                        });
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }else{
                this.$axios.put(`/backend/product/${this.editSpuId}`,qs.stringify(pre)).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: '编辑SPU成功',
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
