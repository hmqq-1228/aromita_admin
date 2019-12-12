<template>
    <div class="addActive">
        <div class="heade">
            <h3>新增活动</h3>
        </div>
        <div class="addActiveCenter">
            <el-form label-width="100px" :model="activeform" :rules="rules" ref="activeform">
                <el-form-item label="活动类型：">
                    <el-select v-model="activeform.activity_type">
                        <el-option label="一口价活动" value="1"></el-option>
                        <el-option label="百分比活动" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称：" prop="name">
                    <el-input v-model="activeform.name"></el-input>
                </el-form-item>
                <el-form-item label="优惠力度：" prop="activity_intensity">
                    <el-input v-model="activeform.activity_intensity"></el-input>
                </el-form-item>
                <el-form-item label="活动时间：" prop="active_time">
                    <el-date-picker
                        v-model="activeform.active_time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:00"
                        format="yyyy-MM-dd HH">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动规则：" prop="activity_rule">
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入活动规则"
                        v-model="activeform.activity_rule">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveActive('activeform')">保存</el-button>
                    <el-button type="danger" @click="cancelActive()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {newActive,activedetail} from '@/http/active.js'
export default {
    data(){
        var activename = (rule,value,callback)=>{
            var patt1=new RegExp("^[ a-zA-Z]+$");
            if(value != '' && !patt1.test(value)){
                callback(new Error('请输入英文'));
            }else{
                callback();
            }
        }
        return{
            activeId:'',//活动id
            activeform:{
                active_time:[],
                name:'',
                activity_type:'2',
                activity_intensity:'',
                activity_start_time:'',
                activity_end_time:'',
                activity_rule:''
            },
            rules:{
                name:[
                    { validator:activename, trigger: 'blur' },
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min:1, max:20, message: '活动名称不能超过20个字符', trigger: 'blur' }
                ],
                activity_intensity:[
                    { required: true, message: '请输入优惠力度', trigger: 'blur' },
                ],
                active_time:[
                    { required: true, message: '请选择活动时间', trigger: 'blur' },
                ],
                activity_rule:[
                    { validator:activename, trigger: 'blur' },
                    {min:1, max:30, message: '活动名称不能超过30个字符', trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.activeId = this.$route.query.id
        if(this.activeId){
            this.getdetail()
        }
    },
    methods:{
        //编辑活动，获取详情
        getdetail(){
            activedetail({id:this.activeId}).then((res)=>{

            })
        },
        //新增活动
        saveActive(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.activeform.activity_start_time = this.activeform.active_time[0]
                    this.activeform.activity_end_time = this.activeform.active_time[1]
                    newActive(this.activeform).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.$router.push({path:'/activeList'})
                        }else{
                            this.$message({
                                message:res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //新建取消
        cancelActive(){
            this.$router.push({path:'/activeList'})
        }
    }
}
</script>
<style scoped>
.addActiveCenter{
    width: 500px;
}
</style>