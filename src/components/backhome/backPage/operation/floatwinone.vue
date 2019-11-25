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
            <el-form :model="adverteform" class="demo-form-inline" label-width="160px">
                <el-form-item label="广告名称（后台）：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="广告时段：">
                    <el-date-picker
                        v-model="adverteform.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="广告标题（前台）：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="标题链接：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="广告背景：">

                </el-form-item>
                <el-form-item label="是否开启倒计时：">
                    
                </el-form-item>
                <el-form-item label="广告位置：">
                    
                </el-form-item>
                <el-form-item label="广告详情：">
                    
                </el-form-item>
                <el-form-item label="广告链接：">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="是否默认广告：">
                    
                </el-form-item>
                <el-form-item label="广告状态：">
                    
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">保存</el-button>
                    <el-button type="danger">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            adverteform:{}
        }
    },
    created(){

    },
    methods:{

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
.demo-form-inline .el-input{
    width: 400px!important;
}
</style>