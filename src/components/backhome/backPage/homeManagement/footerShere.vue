<template>
  <div class="banner">
    <div class="header">
      <div>社交平台(最多添加6个)</div>
      <el-button type="primary" icon="el-icon-plus" v-if="bannerList.length<6" @click="addNew()">新增</el-button>
    </div>
    <el-table
      :data="bannerList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="picture_title"
        label="标题"
        width="240">
      </el-table-column>
      <el-table-column
        prop="picture_src"
        label="图片路径"
        width="650">
      </el-table-column>
      <el-table-column
        prop="picture_href"
        label="图片链接">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="toBannerDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="primary" @click="bannerEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="bannerList.length>2" @click="delItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="bannerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
      <div class="draCont">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="ID" v-if="isEdit">
            <el-input readonly v-model="ruleForm.ID"></el-input>
          </el-form-item>
          <el-form-item label="图片标题" prop="name">
            <el-input placeholder="请输入图片标题" v-model="ruleForm.name">
              <template slot="prepend"><i class="el-icon-edit"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="imageUrl">
            <el-upload
              class="avatar-uploader"
              name="image"
              :action="uploadUrl"
              :data="bannerType"
              accept=".jpg,.png,.JPG,.PNG,.jpeg,.JPEG"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="tip"><i class="el-icon-warning-outline"></i> 请上传不超过500KB的40*40尺寸的PNG、JPG、JPEG格式图片!</div>
          </el-form-item>
          <el-form-item label="图片链接" prop="PicUrl">
            <el-input placeholder="请输入正确的网址" v-model="ruleForm.PicUrl">
              <template slot="prepend"><i class="el-icon-link"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button type="primary" @click="submitForm('ruleForm')">{{bntStr}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-drawer
      title="社交平台详情"
      size="575px"
      :visible.sync="drawerDetail"
      direction="rtl"
      :before-close="handleClose2">
      <div class="draCont">
        <el-form label-width="100px">
          <el-form-item label="ID">
            <el-input readonly v-model="DetailId"></el-input>
          </el-form-item>
          <el-form-item label="图片标题">
            <el-input readonly v-model="DetailName"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="imageUrl">
            <div class="imgBox" @click="prevPicture(DetailUrl)"><img :src="DetailUrl" alt=""></div>
          </el-form-item>
          <el-form-item label="图片链接" prop="PicUrl">
            <el-input readonly v-model="DetailPicUrl"></el-input>
          </el-form-item>
          <el-form-item label="图片位置" prop="PicUrl">
            <el-input readonly v-model="DetailPosion"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="PicUrl">
            <el-input readonly v-model="DetailCreate"></el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="PicUrl">
            <el-input readonly v-model="DetailEdit"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button @click="cancel()">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {uploadUrl} from '@/http/commodity.js'
  import {getBannerList,addNewBanner} from '@/http/home.js'
  export default {
    data(){
      return{
        isEdit: false,
        drawer: false,
        currentId: '',
        drawerDetail: false,
        dialogVisible: false,
        dialogImageUrl: '',
        uploadUrl:uploadUrl,
        bannerType:{
          type:'social'
        },
        imageUrl: '',
        bntStr: '',
        DetailId: '3',
        DetailUrl: '',
        DetailName: '这是测试数据',
        DetailEdit: '2019-08-08',
        DetailPicUrl: 'www.baidu.com',
        DetailPosion: 'Banner',
        DetailCreate: '2019-10-10',
        bannerTitle: '',
        url: "https://arapi.panduo.com.cn/uploads/",
        ruleForm:{
          ID: '',
          name:'',
          imageUrl: '',
          PicUrl: ''
        },
        rules:{
          name: [
            { required: true, message: '请输入图片名称', trigger: 'blur' },
            { min: 1, max: 30, message: '名称长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          imageUrl:[
            { required: true, message: '请上传图片', trigger: 'blur' }
          ],
          PicUrl: [
            { required: true, message: '请输入图片链接', trigger: 'blur' },
            { type: 'url', required: true, message: '请填写正确的网址', trigger: 'blur' }
          ]
        },
        bannerList: []
      }
    },
    created () {
      this.getBannerListFuc()
    },
    methods:{
      // 获取banner列表
      getBannerListFuc () {
        getBannerList ({position:40}).then((res)=>{
          if (res.data.code === 200) {
            this.bannerList = res.data.data.data
          }
        })
      },
      addNew () {
        this.drawer = true
        this.isEdit = false
        this.bntStr = '立即创建'
        this.bannerTitle = '新建社交平台'
      },
      addNewFuc () {
        var obj = {
          position: 40,
          picture_src: this.ruleForm.imageUrl,
          picture_href: this.ruleForm.PicUrl,
          picture_title: this.ruleForm.name
        }
        addNewBanner (obj).then((res)=>{
          if (res.data.code === 200) {
            this.drawer = false
            this.$message.success('新建成功！')
            this.getBannerListFuc()
            this.$refs['ruleForm'].resetFields();
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      bannerEdit (id) {
        var that = this
        this.currentId = id
        that.drawer = true
        that.isEdit = true
        that.bntStr = '确定修改'
        that.bannerTitle = '社交平台修改'
        that.$axios.get(`backend/home/edit/${id}`,{}).then((res)=>{
          console.log('eeeeee', res)
          if (res.data.code === 200) {
            that.ruleForm.ID = res.data.data.id
            that.ruleForm.name = res.data.data.picture_title
            that.ruleForm.imageUrl = res.data.data.picture_src
            that.ruleForm.PicUrl = res.data.data.picture_href
          }
        })
      },
      handleClose(){
        this.drawer = false
        // this.drawerDetail = false
        this.$refs['ruleForm'].resetFields();
      },
      handleClose2(){
        this.drawerDetail = false
      },
      handleAvatarSuccess(res, file) {
        console.log('sssss', res)
        this.ruleForm.imageUrl = res.data;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 < 500 ;
        if (!isLt2M) {
          // this.$message.error('商品图片大小不能超过500kb!');
          $('.tip').addClass('error')
        } else {
          $('.tip').removeClass('error')
        }
        var _this = this;
        const isSize = new Promise(function(resolve, reject) {
          let width = 40;
          let height = 40;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function() {
            let valid = img.width == width && img.height == height;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          $('.tip').removeClass('error')
          return file;
        }, () => {
          $('.tip').addClass('error')
          // _this.$message.error('商品图片宽高必须是1440*500!');
          return false
        });
        return isSize && isLt2M;
      },
      // 删除
      delItem (id) {
        this.$confirm('此操作将永久删除该平台, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFuc(id)
        }).catch(() => {
          return false
        });
      },
      deleteFuc (id) {
        this.$axios.delete(`backend/home/${id}`,{}).then((res)=>{
          if (res.data.code === 200) {
            this.getBannerListFuc()
            this.$message.success('删除成功！')
          }
        })
      },
      // 详情
      toBannerDetail (id) {
        this.drawerDetail = true
        this.$axios.get(`backend/home/${id}`,{}).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            this.DetailId = res.data.data.id
            this.DetailName = res.data.data.picture_title
            this.DetailUrl = res.data.data.picture_src
            this.DetailPicUrl = res.data.data.picture_href
            if (res.data.data.position === 40) {
              this.DetailPosion = '底部社交平台'
            }
            this.DetailCreate = res.data.data.created_at
            this.DetailEdit = res.data.data.updated_at
          }
        })
        // this.$router.push('/bannerDetail')
      },
      cancel () {
        this.drawerDetail = false
      },
      // 预览
      prevPicture (pic) {
        this.dialogVisible = true
        this.dialogImageUrl = pic
      },
      submitForm(formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.bntStr === '确定修改') {
              that.subEditInfo()
            } else if (that.bntStr === '立即创建') {
              that.addNewFuc()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      subEditInfo () {
        var that = this
        var obj = {
          picture_title: that.ruleForm.name,
          picture_src: that.ruleForm.imageUrl,
          picture_href: that.ruleForm.PicUrl
        }
        // console.log('iiiiii', that.ruleForm.imageUrl.split(that.url)[1])
        this.$axios.put("backend/home/" + that.currentId,obj).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            that.drawer = false
            that.getBannerListFuc()
            that.$message.success('修改成功！')
            this.$refs['ruleForm'].resetFields();
          } else {
            that.$message.warning(res.data.msg)
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .tip{
    font-size: 14px;
    color: #666;
  }
  .tip.error{
    color: #C51015;
  }
  .header{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .draCont{
    padding: 0 20px;
  }
  .draCont .el-input{
    width: 300px !important;
  }
  .avatar-uploader .el-upload {
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
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    /*width: 300px;*/
    /*height: 178px;*/
    display: block;
  }
  .imgBox{
    width: 50px;
    display: block;
    border: 1px dashed #d9d9d9;
  }
  .imgBox img{
    width: 100%;
    height: 100%;
  }
  .el-form-item{
    margin-bottom: 24px !important;
  }
</style>
