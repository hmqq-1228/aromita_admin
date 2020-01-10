<template>
  <div class="banner">
    <div class="header">
      <div>Best Seller(最多添加4个)</div>
      <el-button type="primary" icon="el-icon-plus" v-if="bannerList.length<4" @click="addNew()">新增</el-button>
    </div>
    <el-table
      :data="bannerList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="200">
      </el-table-column>
      <el-table-column
        prop="sku_id"
        label="商品ID"
        width="200">
      </el-table-column>
      <el-table-column
        prop="sku_no"
        label="商品编号"
        width="500">
      </el-table-column>
      <el-table-column
        prop="products_name"
        label="商品名称">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="toBannerDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="primary" @click="bannerEdit(scope.row.id)">编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="delItem(scope.row.id)">删除</el-button>-->
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
          <el-form-item label="商品编号" prop="proCode">
            <el-input placeholder="请输入商品编号" v-model="ruleForm.proCode">
              <template slot="prepend"><i class="el-icon-s-check"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input placeholder="请输入商品名称" v-model="ruleForm.name">
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
            <div class="tip"><i class="el-icon-warning-outline"></i> 请上传不超过500KB的336*336尺寸的PNG、JPG、JPEG格式图片!</div>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button type="primary" @click="submitForm('ruleForm')">{{bntStr}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-drawer
      title="Best Seller详情"
      size="575px"
      :visible.sync="drawerDetail"
      direction="rtl"
      :before-close="handleClose2">
      <div class="draCont">
        <el-form label-width="100px">
          <el-form-item label="ID">
            <el-input readonly v-model="DetailId"></el-input>
          </el-form-item>
          <el-form-item label="商品ID">
            <el-input readonly v-model="DetailProId"></el-input>
          </el-form-item>
          <el-form-item label="商品编号">
            <el-input readonly v-model="DetailProNum"></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input readonly v-model="DetailName"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="imageUrl">
            <div class="imgBox" @click="prevPicture(DetailUrl)"><img :src="DetailUrl" alt=""></div>
          </el-form-item>
          <el-form-item label="商品位置" prop="PicUrl">
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
  import {getProductsList,addNewProduct} from '@/http/home.js'
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
          type:'bestseller'
        },
        imageUrl: '',
        bntStr: '',
        DetailId: '3',
        DetailUrl: '',
        DetailProId: '',
        DetailProNum: '',
        DetailName: '这是测试数据',
        DetailEdit: '2019-08-08',
        DetailPosion: 'Banner',
        DetailCreate: '2019-10-10',
        bannerTitle: '',
        url: "https://arapi.panduo.com.cn/uploads/",
        ruleForm:{
          ID: '',
          name:'',
          proCode: '',
          imageUrl: ''
        },
        rules:{
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 5, max: 30, message: '名称长度在 5 到 30 个字符', trigger: 'blur' }
          ],
          imageUrl:[
            { required: true, message: '请上传商品图片', trigger: 'change' }
          ],
          proCode: [
            { required: true, message: '请输入商品编号', trigger: 'blur' },
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
        getProductsList ({position:10}).then((res)=>{
          if (res.data.code === 200) {
            this.bannerList = res.data.data.data
          }
        })
      },
      addNew () {
        this.drawer = true
        this.isEdit = false
        this.bntStr = '立即创建'
        this.bannerTitle = '新建Best Seller'
      },
      addNewBanner () {
        var obj = {
          position: 10,
          sku_no: this.ruleForm.proCode,
          products_src: this.ruleForm.imageUrl,
          products_name: this.ruleForm.name
        }
        addNewProduct(obj).then((res)=>{
          if (res.data.code === 200) {
            this.drawer = false
            this.$message.success('新建成功！')
            this.getBannerListFuc()
            this.$refs['ruleForm'].resetFields();
            // this.drawer = false
          }else {
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
        that.bannerTitle = '修改Best Seller'
        that.$axios.get(`backend/home/products/edit/${id}`,{}).then((res)=>{
          console.log('eeeeee', res)
          if (res.data.code === 200) {
            that.ruleForm.ID = res.data.data.id
            that.ruleForm.name = res.data.data.products_name
            that.ruleForm.imageUrl = res.data.data.products_src
            that.ruleForm.proCode = res.data.data.sku_no
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
          let width = 336;
          let height = 336;
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
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
        this.$axios.delete(`backend/home/products/${id}`,{}).then((res)=>{
          if (res.data.code === 200) {
            this.getBannerListFuc()
            this.$message.success('删除成功！')
          }
        })
      },
      // 详情
      toBannerDetail (id) {
        this.drawerDetail = true
        this.$axios.get(`backend/home/products/${id}`,{}).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            this.DetailId = res.data.data.id
            this.DetailProId = res.data.data.sku_id
            this.DetailProNum = res.data.data.sku_no
            this.DetailName = res.data.data.products_name
            this.DetailUrl = res.data.data.products_src
            // this.DetailPicUrl = res.data.data.picture_href
            if (res.data.data.position === 10) {
              this.DetailPosion = 'Best Seller '
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
              that.addNewBanner()
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
          position: 10,
          products_name: that.ruleForm.name,
          products_src: that.ruleForm.imageUrl,
          sku_no: that.ruleForm.proCode
        }
        // console.log('iiiiii', that.ruleForm.imageUrl.split(that.url)[1])
        this.$axios.put("backend/home/products/" + that.currentId,obj).then((res)=>{
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
    width: 300px;
    /*height: 178px;*/
    display: block;
  }
  .imgBox{
    width: 300px;
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
