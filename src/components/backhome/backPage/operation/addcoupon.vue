<template>
    <div class="addcoupon">
        <div class="heade">
            <h3>新建优惠券</h3>
        </div>
        <div class="addcouponCenter">
            <el-form label-width="140px">
                <el-form-item label="优惠券名称：">
                    <el-input placeholder="请输入优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="发放总量：">
                    <el-input></el-input>  张
                </el-form-item>
                <el-form-item label="创建类型：">
                    <el-select>
                        <el-option></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用门槛：">
                    <div>
                        <span> 订单满 </span>
                        <el-input></el-input>
                        <span> 美元 </span>
                        <span> 减 </span>
                        <el-input></el-input>
                        <span> 美元 </span>
                    </div>
                </el-form-item>
                <el-form-item label="用券时间：">
                    <div>
                        <el-radio v-model="radio" label="1">
                            <span>  领券当日起  </span><el-input></el-input>  天
                        </el-radio>
                    </div>
                    <br>
                    <div>
                        <el-radio v-model="radio" label="2">
                            <span>固定时段</span>
                            <el-date-picker
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <span>有用</span>
                        </el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="发放时间：">
                    <div>
                        <el-radio v-model="radio1" label="1">
                            <span>截止领取日期</span>
                            <el-date-picker
                                v-model="value2"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-radio>
                    </div>
                    <br>
                    <div>
                        <el-radio v-model="radio1" label="2">
                            <span>发放日期</span>
                            <el-date-picker
                                v-model="value3"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="使用说明：">
                    <el-input type="textarea" :rows="6" placeholder="请输入使用说明"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            radio:'',
            radio1:'',
            value1:'',
            value2:'',
            value3:''
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