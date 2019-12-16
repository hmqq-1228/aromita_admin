<template>
    <div class="renovation">
        <div class="renovation_left">
            <draggable
                class="dragArea list-group"
                :list="list1"
                :group="{ name: 'comp', pull: 'clone', put: false }"
                @change="log">
                <div class="list_group_item" v-for="(item,index) in list1" :key="item.id">
                  <img :src="iconList[index]" alt="">
                  <p>{{item.name}}</p>
                </div>
            </draggable>
        </div>
        <div class="renovation_center">
            <draggable
                tag="el-collapse"
                class="list-group"
                :list="list2"
                group="comp"
                @change="log">
                <div v-for="(item,index) in list2" :key="index">
                    <!-- 轮播图 -->
                    <div v-if="item.type == 1" class="banner" @click="setbox(1,index,item)">
                      <el-carousel height="360px">
                          <el-carousel-item v-for="(item1,index) in item.imgList" :key="index">
                              <img :src="item1.imgurl" alt="">
                          </el-carousel-item>
                      </el-carousel>
                    </div>
                    <!-- 倒计时 -->
                    <div v-if="item.type ==2" class="activeTime" :style="{'background':item.background}" @click="setbox(2,index,item)">
                      <div class="timecenter" :style="{'float':item.style.position,'color':item.style.color}">
                        <span>{{item.txt}}：</span>
                        <i>01</i>: D <i>05</i>: h <i>24</i>: m <i>28</i>: s
                      </div>
                    </div>
                    <!-- 商品列表 -->
                    <div v-if="item.type ==3" class="commoditycenter" :style="{'background-image':`url(${item.background_image})`,'background-color':item.background_color}" @click="setbox(3,index,item)">
                      <div class="list_box">
                        <div class="list" v-for="(item1,index1) in item.commodityList" :key="index1">
                          商品
                        </div>
                      </div>
                    </div>
                </div>
            </draggable>
        </div>
        <div class="renovation_right">
          <div v-if="setType == 1">
            <h3>banner图设置</h3>
            <el-form class="setcommodity_back">
                <el-button type="success" @click="addBanner">添加</el-button>
                <el-form-item v-for="(item,index) in bannerList" :key="index">
                    <div>
                      <h4>上传图片</h4>
                      <el-upload
                          class="avatar-uploader"
                          :action="uploadUrl"
                          :data="detailType"
                          name="image"
                          accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                          :show-file-list="false"
                          :on-success="bannerSuccess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="item.imgurl" :src="item.imgurl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <h4>图片链接</h4>
                      <el-input v-model="item.imgLink"></el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                  <el-button @click="savebannerlist">保存</el-button>
                </el-form-item>
              </el-form>
          </div>
          <div v-if="setType == 2">
            <h3>倒计时设置</h3>
          </div>
          <div v-if="setType == 3">
            <h3>商品列表设置</h3>
            <div>
              <el-radio-group v-model="commodity_background">
                <el-radio :label="1">设置背景图</el-radio>
                <el-radio :label="2">设置背景色</el-radio>
              </el-radio-group>
              <el-form class="setcommodity_back">
                <el-form-item label="上传背景图：" v-if="commodity_background == 1">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :data="detailType"
                        name="image"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="commodity_imgurl" :src="commodity_imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="选择背景颜色：" v-if="commodity_background == 2">
                    <el-color-picker v-model="commodity_back_color" @change="changecolor"></el-color-picker>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import {uploadUrl} from '@/http/commodity.js'
export default {
  components: {
    draggable
  },
  data() {
    return {
      //上传商品背景图
      uploadUrl:uploadUrl,
      detailType:{
          type:'square'
      },
      iconList:[
          "../../../../static/images/banner.png","../../../../static/images/time.png"
      ],
      list1: [
        { 
          name: "banner图", 
          type:1, 
          imgList:[
            {imgurl:'../../../../static/images/1.png',imgLink:''},
            {imgurl:'../../../../static/images/1.png',imgLink:''},
            {imgurl:'../../../../static/images/1.png',imgLink:''}
          ]
        },
        { 
          name: "倒计时", 
          type: 2, 
          txt:'距离活动结束',
          background:'#C51015',
          style:{
            color:'#fff',
            position:'right'
          }
        }
      ],
      list2: [
          { 
            name: "我是商品列表", 
            type: 3,
            background_image:'',
            background_color:'#FF9F26',
            commodityList:[1,1,1,1,1,1,1,1,1,1] 
          },
      ],
      setType:3,
      dex:0,
      commodity_background:1,
      //商品设置
      commodity_imgurl:'',
      commodity_back_color:'#C51015',
      //banner设置
      bannerList:[{imgurl:'',imgLink:''}],
      bannerdex:0,
      detaildata:{},
      count: 0
    };
  },
  created(){
    this.setbox(3,0,this.list2[0])
  },
  methods: {
    //设置方法
    setbox(type,dex,data){
      this.setType = type
      this.dex = dex
      this.detaildata = data
    },
    //设置商品列表背景图
    handleAvatarSuccess(res,file){
      this.detaildata.background_color = ''
      var img = res.data
      this.commodity_imgurl = img
      this.detaildata.background_image = img
      this.list2[this.dex] = this.detaildata
    },
    beforeAvatarUpload(){
      
    },
    //设置商品列表背景色
    changecolor(){
      this.detaildata.background_image = ''
      this.commodity_imgurl = ''
      this.detaildata.background_color = this.commodity_back_color
      this.list2[this.dex] = this.detaildata
    },
    //添加轮播图（最多三张）
    addBanner(){
      var obj = {imgurl:'',imgLink:''}
      this.bannerList.push(obj)
    },
    uploadBanner(data,dex){
      console.log(this.bannerdex)
      this.bannerdex = dex
    },
    //轮播图上传图片
    bannerSuccess(res,file){
      this.bannerList[this.bannerdex].imgurl = res.data
    },
    //banner设置保存
    savebannerlist(){
      console.log(this.bannerList)
    },
    log: function(evt) {
      if (evt.added) {
        this.count += 1;
        const item = evt.added.element;
        const idx = this.list2.findIndex(e => e.id === item.id);
        let temp = JSON.parse(JSON.stringify(this.list2));
        temp[idx].id = this.count;
        this.list2 = temp;
      }
    },
    handleChange: function() {},
    deleteItem: function(index) {
      this.list2.splice(index, 1);
    }
  }
};
</script>
<style>
@import url("../../../../assets/renovation.css");
</style>