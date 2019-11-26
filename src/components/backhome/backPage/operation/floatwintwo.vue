<template>
    <div class="floatwinone">
        <div class="header">
            <span>广告管理-订阅浮窗广告</span>
            <router-link to="/floatwinone">
                <el-button type="primary">顶部浮窗广告</el-button>
            </router-link>
            <router-link to="/floatwintwo">
                <el-button type="primary">订阅浮窗广告</el-button>
            </router-link>
        </div>
        <div class="orderCenter">
            <el-form :model="adverteform" class="demo-form-inline">
                <el-form-item label="状态："></el-form-item>
                <el-form-item label="广告时段：">
                    <el-date-picker
                        v-model="adverteform.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input clearable placeholder="请输入广告名称/广告标题"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            adverteform:{

            }
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
</style>