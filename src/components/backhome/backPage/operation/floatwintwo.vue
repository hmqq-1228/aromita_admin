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
            <el-form :model="adverteform" class="demo-form-inline" label-width="160px">
                <el-form-item label="广告名称（后台）：" required>
                    <el-input clearable placeholder="请输入广告名称/广告标题"></el-input>
                </el-form-item>
                <el-form-item label="订阅福利：" required>
                    <el-radio-group v-model="adverteform.radio">
                        <div class="radioBox">
                            <el-radio :label="1">送优惠券</el-radio>
                            <el-select placeholder="请选择优惠券类型" v-model="adverteform.radiovalue">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                            </el-select>
                        </div>
                        <div class="radioBox">
                            <el-radio :label="2">送积分</el-radio>
                            <el-input placeholder="请输入积分点数"></el-input>
                        </div>
                        <div class="radioBox">
                            <el-radio :label="3">无福利</el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态：" required>
                    <el-switch
                        v-model="adverteform.switch">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">保存</el-button>
                    <el-button type="danger" @click="cancel()">取消</el-button>
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
                radio:1,
                radiovalue:'',
                switch:''
            },
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: ''
        }
    },
    created(){

    },
    methods:{
        //取消广告设置
        cancel(){
            this.$confirm('广告设置还没有保存，确定取消吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({path:'/advertising'})
            }).catch(() => {
                          
            });
        }
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
.floatwinone .demo-form-inline .el-input{
    width: 400px!important;
}
.floatwinone .radioBox{
    height: 50px;
    display: flex;
    align-items:center;
}
</style>