<template>
  <div>
      <div class="saveBtn">
        <el-button type="primary" @click="saveStyle" v-if="activestr == '未开始'">应用活动广场样式</el-button>
        <p class="activeTip" v-else>进行中和已结束活动编辑无效。</p>
      </div>
      <div class="renovation">
          <div class="renovation_left">
              <draggable
                  class="dragArea list-group"
                  :list="list1"
                  :group="{ name: 'comp', pull: 'clone', put: false }"
                  @change="log">
                  <div class="list_group_item" v-for="(item,index) in list1" :key="item.type">
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
                        <p class="bannerTxt"><i class="el-icon-picture-outline"></i> 请上传轮播图</p>
                      </div>
                      <!-- 倒计时 -->
                      <div v-if="item.type ==2" class="activeTime" :style="{'background':item.timeobj.background,'text-align':positionstyle[item.timeobj.style.position]}" @click="setbox(2,index,item)">
                        <div class="timecenter" :style="{'color':item.timeobj.style.color}">
                          <span v-if="item.timeobj.time_info_list.length!=0">{{item.timeobj.time_info_list[0].timetxt}}：</span>
                          <i>01</i> D <i>05</i>: h <i>24</i>: m <i>28</i>: s
                        </div>
                      </div>
                      <!-- 商品列表 -->
                      <div v-if="item.type ==3" class="commoditycenter" :style="{'background-image':`url(${item.background_image})`,'background-color':item.background_color}" @click="setbox(3,index,item)">
                        <div class="list_box">
                          <div class="list" v-for="(item1,index1) in 8" :key="index1">
                            <img src="@/assets/images/list1.png" alt="">
                          </div>
                        </div>
                      </div>
                  </div>
              </draggable>
          </div>
          <div class="renovation_right" v-if="elementList == true">
            <div v-if="setType == 1">
              <h3>banner图设置（最多只能设置3张图）</h3>
              <el-form class="setcommodity_back">
                  <el-button type="success" @click="addBanner" :disabled="this.bannerList.length >= 3 ? true:false">添加</el-button>
                  <el-form-item v-for="(item,index) in bannerList" :key="index">
                      <div>
                        <h4>上传图片</h4>
                        <div class="imagesBox">
                           <div @click="getImageTypeIndex(index)" class="uploadBox">
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
                          </div>
                          <el-button type="danger" class="delbtn" @click="delbanner(index)" v-if="index!=0">删除</el-button>
                        </div>
                        <p class="uploadTip">建议尺寸：宽度1440px,高度500px </p>
                        <h4>图片链接</h4>
                        <el-input v-model="item.imgLink"></el-input>
                      </div>
                  </el-form-item>
                  <el-form-item>
                    <div class="bannerBtn">
                        <el-button type="primary" @click="savebannerlist">保存</el-button>
                        <el-button type="danger" @click="dellist">删除</el-button>
                    </div>
                  </el-form-item>
                </el-form>
            </div>
            <div v-if="setType == 2">
              <h3>倒计时设置</h3>
              <el-form v-model="timeform">
                <el-form-item label="倒计时显示：">
                  <br>
                  <el-checkbox-group v-model="time_info_type" @change="changetimetype">
                      <div v-for="(item,index) in time_info" :key="index" class="shipsort">
                          <el-checkbox :label="item.type">{{item.typetxt}}</el-checkbox>
                          <el-input v-if="time_info_type.find(n =>n == item.type)" v-model="item.timetxt" placeholder="倒计时描述"></el-input>
                          <el-input v-else placeholder="倒计时描述"></el-input>
                      </div>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="倒计时字体颜色：">
                  <el-color-picker v-model="timeform.style.color"></el-color-picker>
                </el-form-item>
                <el-form-item label="倒计时区域背景色：">
                  <el-color-picker v-model="timeform.background"></el-color-picker>
                </el-form-item>
                <el-form-item label="倒计时位置：">
                  <el-radio :label="1" v-model="timeform.style.position">居左</el-radio>
                  <el-radio :label="2" v-model="timeform.style.position">居中</el-radio>
                  <el-radio :label="3" v-model="timeform.style.position">居右</el-radio>
                </el-form-item>
                <el-form-item>
                    <div class="bannerBtn">
                      <el-button type="primary" @click="savetimeset">保存</el-button>
                      <el-button type="danger" @click="dellist">删除</el-button>
                    </div>
                </el-form-item>
              </el-form>
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
          <div class="renovation_right" v-else>
            <h3>请选择要设置的组件</h3> 
          </div>
      </div>
  </div>  
</template>
<script>
import draggable from "vuedraggable";
import {uploadUrl} from '@/http/commodity.js'
import {saveActiveStyle,detailStyle} from '@/http/active.js'
export default {
  components: {
    draggable
  },
  data() {
    return {
      activestr:'未开始',
      active_id:'',
      //上传商品背景图
      uploadUrl:uploadUrl,
      detailType:{
          type:'banner'
      },
      iconList:[
          "../../../../static/images/banner.png","../../../../static/images/time.png"
      ],
      list1: [
        { 
          name: "banner图", 
          type:1, 
          imgList:[
            {imgurl:'',imgLink:''}
          ]
        },
        { 
          name: "倒计时", 
          type: 2, 
          timeobj:{
            time_info_list:[
              {
                type:1,
                typetxt:"距离活动开始倒计时：",
                timetxt:'Upcoming Sales',
              },
            ],
            background:'#C51015',
            style:{
              color:'#ffffff',
              position:1
            }
          }
        }
      ],
      list2: [
          { 
            id:0,
            name: "我是商品列表", 
            type: 3,
            // commodity_background
            background_image:'',
            background_color:'#FF9F26',
          },
      ],
      setType:3,
      dex:0,
      positionstyle:{
        1:'left',
        2:'center',
        3:'right'
      },
      //商品设置
      commodity_background:1,
      commodity_imgurl:'',
      commodity_back_color:'#C51015',
      //banner设置
      bannerList:[{imgurl:'',imgLink:''}],
      bannerdex:0,
      //倒计时设置
      time_info_type:[],//勾选的倒计时类型
      time_info:[//倒计时显示类型
          {
            type:1,
            typetxt:"距离活动开始倒计时：",
            timetxt:'',
          },
          {
            type:2,
            typetxt:"距离活动结束倒计时：",
            timetxt:'',
          }
      ],
      time_info_list:[],//勾选后倒计时类型和文案
      timeform:{
        time_info_list:[],
        background:'#C51015',
        style:{
          color:'#ffffff',
          position:1
        }
      },
      detaildata:{},
      count: 0,
      elementList:false,
    };
  },
  created(){
    this.active_id = this.$route.query.id
    this.activestr = this.$route.query.str
    detailStyle({id:this.active_id}).then((res)=>{
      var style = res.data.data.activity_style
      if(style !=''){
        this.list2 = JSON.parse(res.data.data.activity_style)
      }else{
        this.setbox(3,0,this.list2[0])
      }
    })
  },
  methods: {
    //改变倒计时显示type
    changetimetype(){
      console.log(this.time_info_type)
      if(this.time_info_type.length == 0){
        this.list2.splice(this.dex, 1);
        this.elementList = false
      }else{
        for(var i=0;i<this.time_info.length;i++){
          // for(var j=0;j<this.time_info_type.length;j++){
          //   if(this.time_info[i].type != this.time_info_type[j]){
          //     this.time_info[i].timetxt = ''
          //   }
          // }
        }
      }
    },
    //设置方法
    setbox(type,dex,data){
      this.setType = type
      this.dex = dex
      this.detaildata = data
      this.elementList = true
      if(this.setType == 1){
        this.bannerList = data.imgList
      }else if(this.setType == 2){
        this.time_info_type = []
        this.timeform = JSON.parse(JSON.stringify(data.timeobj))
        //勾选倒计时类型数据回显
        var list = this.timeform.time_info_list
        var arr = []
        for(var i=0;i<list.length;i++){
          var type = list[i].type
          arr.push(type)
        }
        this.time_info_type = arr

        for(var i=0;i<this.time_info.length;i++){
          list.filter(n=>n.type == this.time_info[i].type ?this.time_info[i].timetxt = n.timetxt:'')
        }
      }else if(this.setType == 3){
        this.commodity_imgurl = data.background_image
        this.commodity_back_color = data.background_color
      }
    },
    //设置商品列表背景图
    handleAvatarSuccess(res,file){
      this.detaildata.background_color = ''
      var img = res.data
      this.commodity_imgurl = img
      this.detaildata.background_image = img
      this.list2[this.dex] = this.detaildata
    },
    beforeAvatarUpload(file){
      // const isLt2M = file.size / 1024 < 500 ;
      // if (!isLt2M) {
      //   // this.$message.error('商品图片大小不能超过500kb!');
      //   // $('.tip').addClass('error')
      // } else {
      //   // $('.tip').removeClass('error')
      // }
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
        // $('.tip').removeClass('error')
        return file;
      }, () => {
        // $('.tip').addClass('error')
        this.$message.error('商品图片宽高必须是1440*500!');
        return false
      });
      return isSize;
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
    //获取轮播图上传组件index
    getImageTypeIndex(dex){
      this.bannerdex = dex
    },
    //轮播图上传图片
    bannerSuccess(res,file){
      if(res.code == 200){
        this.bannerList[this.bannerdex].imgurl = res.data
      }
    },
    //banner设置保存
    savebannerlist(){
      if(this.bannerList.find((n)=>n.imgurl == '')){
        this.$message.error("请上传轮播图")
      }else{
        this.list2[this.dex].imgList = JSON.parse(JSON.stringify(this.bannerList))
      }
    },
    //倒计时设置保存 [\u4e00-\u9fa5]
    savetimeset(){
      var arr = []
      for(var i=0;i<this.time_info.length;i++){
        for(var j=0;j<this.time_info_type.length;j++){
          if(this.time_info[i].type == this.time_info_type[j]){
            var obj = this.time_info[i]
            arr.push(obj)
          }
        }
      }

      for(var m =0;m<arr.length;m++){
        var patt = new RegExp("^[a-zA-Z _%&',;=?$]{0,50}$");
        if(arr[m].timetxt == ''){
          this.$message.error("请输入倒计时描述")
          return false
        }else if(arr[m].timetxt != '' && !patt.test(arr[m].timetxt)){
          this.$message.error("倒计时描述只能是英文，且字符长度不能超过50个字符")
          return false
        }else{
          this.timeform.time_info_list = arr
          this.list2[this.dex].timeobj = JSON.parse(JSON.stringify(this.timeform))
        }
      }
      
      
    },
    //应用活动广场样式
    saveStyle(){
      console.log(this.list2)
      var imgarr = this.list2.filter(n=>n.type == 1)
      for(var i=0;i<imgarr.length;i++){
        if(imgarr[i].imgList.find(n => n.imgurl == '')){
          this.$message.error("请上传轮播图")
          return false
        }else{
          let pre={
            id:this.active_id,
            activity_style:JSON.stringify(this.list2),
          }
          saveActiveStyle(pre).then((res)=>{
            if(res.data.code == 200){
                this.$message.success('保存成功');
            }else{
                this.$message.error(res.data.msg);
            }
          })
        }
      }
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
    //删除组件
    dellist() {
      this.list2.splice(this.dex, 1);
      this.elementList = false
    },
    //轮播图单个删除
    delbanner(dex){
      this.bannerList.splice(dex,1)
    }
  }
};
</script>
<style>
@import url("../../../../assets/renovation.css");
</style>