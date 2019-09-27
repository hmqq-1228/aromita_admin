<template>
    <div class="addcoupon">
        <div class="heade">
            <h3>新建优惠券</h3>
        </div>
        <div class="addcouponCenter">
            <el-form label-width="140px">
                <el-form-item label="优惠券名称：">
                    <el-input v-model="coupon_name" placeholder="请输入优惠券名称" @change="nameisTrue()"></el-input>
                </el-form-item>
                <el-form-item label="发放总量（张）：">
                    <el-input v-model="coupon_number" @blur="isTrue()"></el-input> <b v-if="coupon_type=='N'">*所输入的数量必须为3的倍数</b>
                </el-form-item>
                <el-form-item label="创建类型：">
                    <el-select v-model="coupon_type" placeholder="创建类型" @change="changecouponType()">
                        <el-option label="节日券" value="F"></el-option>
                        <!-- <el-option label="周年庆" value="B"></el-option> -->
                        <el-option label="注册券" value="N"></el-option>
                    </el-select>
                    <span v-if="coupon_type=='N'">注：3 张</span>
                </el-form-item>
                <el-form-item label="使用门槛：">
                    <div>
                        <span> 订单满 </span>
                        <el-input v-model="coupon_minimum_order" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                        <span> 美元 ，</span>
                        <span> 减 </span>
                        <el-input v-model="coupon_amount" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                        <span> 美元 </span>
                    </div>
                </el-form-item>
                <el-form-item label="优惠券有效时间：">
                    <div v-if="coupon_type=='N'">
                        <span>  领券当日起  </span><el-input v-model="coupon_expire_date" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>  天
                    </div>
                    <div v-else>
                        <el-date-picker
                            v-model="coupon_time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="生效日期"
                            end-placeholder="失效日期"
                            :picker-options="pickerOptionsToday"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="优惠券发放时间：">
                    <div v-if="coupon_type=='N'">
                        <span>截止领取日期</span>
                        <el-date-picker
                            v-model="coupon_receive_end_time"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptionsToday"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                    <div v-else>
                        <span>发放日期</span>
                        <el-date-picker
                            v-model="coupon_receive"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始发放日期"
                            end-placeholder="结束发放日期"
                            :picker-options="pickerOptionsToday"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="使用说明：">
                    <el-input type="textarea" :rows="6" v-model="coupon_description" placeholder="请输入使用说明"></el-input>
                    <div>
                        优惠券使用说明示例规范如下：
                        <p>庆国庆优惠券</p>
                        <p>使用时间：2017-10-27   12：00：00-2017-10-29  14：49：06</p>
                        <p>优惠内容：部分商品，满88美元8.8折优惠券</p>
                        <p>其他限制：仅原价购买商品时可用券</p>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createCoupon()">创 建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {addCoupon} from '@/http/coupon.js'
export default {
    data(){
        return{
            coupon_name:'',//优惠券名称
            coupon_type:'N',//创建类型
            coupon_number:3,//优惠券发放总量
            coupon_minimum_order:'',//满足最小金额
            coupon_amount:'',//优惠券金额
            coupon_expire_date:'',//优惠券有效时长
            coupon_receive_end_time:'',//截止领取日期
            coupon_description:'',//优惠券使用说明
            //截止领取日期限制（不能选择今天以前的日期）
            pickerOptionsToday: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            coupon_time:[],//优惠券有效时间
            coupon_start_time:'',//优惠券生效时间
            coupon_end_time:'',//优惠券失效时间
            coupon_receive:[],//优惠券发放时间
            coupon_receive_start_time:'',//优惠券开始领取时间
            coupon_receive_end_time:'',//优惠券截止领取时间
            checkMsg:{
                coupon_name:'优惠券名称',//优惠券名称
                coupon_minimum_order:'满足最小金额',//满足最小金额
                coupon_amount:'优惠券金额',//优惠券金额
                coupon_expire_date:'优惠券有效时长',//优惠券有效时长
                coupon_receive_end_time:'截止领取日期',//截止领取日期
                coupon_description:'优惠券使用说明',//优惠券使用说明
                coupon_start_time:'优惠券生效时间',//优惠券生效时间
                coupon_end_time:'优惠券失效时间',//优惠券失效时间
                coupon_receive_start_time:'优惠券开始领取时间',//优惠券开始领取时间
                coupon_receive_end_time:'优惠券截止领取时间',//优惠券截止领取时间
            }
        }
    },
    created(){

    },
    methods:{
        //判断是否是3的倍数 注册券要求3的倍数，其他券不做要求
        isTrue(){
            if(this.coupon_number<1){
                this.$message({
                    message:'发放总数最少一张',
                    type: 'error'
                });
                this.coupon_number = 1
            }else{
                if(this.coupon_type=='N' && this.coupon_number % 3 != 0){
                    this.$message({
                        message:'注册券要求发放优惠券总数为3的倍数',
                        type: 'error'
                    });
                    this.coupon_number = 3
                }
            }
        },
        //验证优惠券要求
        nameisTrue(){
            var patt1=new RegExp("^[a-zA-Z]+$");
            if(!patt1.test(this.coupon_name)){
                this.$message({
                    message:'注册券名称只能是字母',
                    type: 'error'
                });
                this.coupon_name = ''
                return false
            }else if(this.coupon_name.length>100){
                this.$message({
                    message:'注册券名称长度不能超过100',
                    type: 'error'
                });
                this.coupon_name = ''
            }
        },
        //选择优惠券类型
        changecouponType(){
            console.log(this.coupon_type)
            if(this.coupon_type!='N'){
                this.coupon_number = 1
            }
        },
        //创建优惠券
        createCoupon(){
            let pre = {}
            //注册券
            if(this.coupon_type == 'N'){
                pre.coupon_name = this.coupon_name
                pre.coupon_type = this.coupon_type
                pre.coupon_amount = this.coupon_amount
                pre.coupon_minimum_order = this.coupon_minimum_order
                pre.coupon_expire_date = this.coupon_expire_date
                pre.coupon_number = this.coupon_number
                pre.coupon_receive_end_time = this.coupon_receive_end_time
                pre.coupon_description = this.coupon_description
            }else if(this.coupon_type != 'N'){//非注册券
                pre.coupon_name = this.coupon_name
                pre.coupon_type = this.coupon_type
                pre.coupon_amount = this.coupon_amount
                pre.coupon_minimum_order = this.coupon_minimum_order
                pre.coupon_number = this.coupon_number
                pre.coupon_start_time = this.coupon_time[0]
                pre.coupon_end_time = this.coupon_time[1]
                pre.coupon_receive_start_time = this.coupon_receive[0]
                pre.coupon_receive_end_time = this.coupon_receive[1]
                pre.coupon_description = this.coupon_description
            }
            for(let key in pre){
                if(!pre[key]){
                    this.$message({
                        message:`${this.checkMsg[key]}必填`,
                        type: 'error'
                    });
                    return false
                }
            }
            addCoupon(pre).then((res)=>{
                if(res.data.code == 200){
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.$router.push({path:'/coupon'})
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>
<style scope>
.addcouponCenter .el-input{
    width:240px!important;
}
.addcouponCenter .el-textarea__inner{
    width:500px!important;
}
</style>