<template>
    <div class="addActive">
        <div class="heade">
            <h3>新增活动</h3>
        </div>
        <div class="addActiveCenter">
            <el-form label-width="100px" :model="activeform" :rules="rules" ref="activeform">
                <el-form-item label="活动类型：" v-if="activeform.activity_type != 3 && activeform.activity_type != 4">
                    <el-select v-model="activeform.activity_type">
                        <el-option label="一口价活动" :value="1"></el-option>
                        <el-option label="百分比活动" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称：" prop="name">
                    <el-input v-model="activeform.name"></el-input>
                </el-form-item>
                <el-form-item label="优惠力度：" :prop="'activity_intensity'+activeform.activity_type">
                    <span v-if="activeform.activity_type == 3"> 满赠门槛  </span> 
                    <span v-if="activeform.activity_type == 4"> 换购门槛  </span>  
                    <el-input v-model="activeform[`activity_intensity${activeform.activity_type}`]" style="width:80px"></el-input>
                    <span v-if="activeform.activity_type == 2"> % OFF</span>
                    <span v-if="activeform.activity_type != 2"> $ </span>
                </el-form-item>
                <el-form-item label="活动时间：" prop="active_time">
                    <el-date-picker
                        :editable="false"
                        v-model="activeform.active_time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:00"
                        format="yyyy-MM-dd HH:00"
                        :picker-options="pickerOptionsToday"
                        @change ="changetime()">
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
                    <el-button type="primary" @click="saveActive('activeform')" v-if="!this.activeId">保存</el-button>
                    <el-button type="primary" @click="updataActive('activeform')" v-if="this.activeId">修改</el-button>
                    <el-button type="danger" @click="cancelActive()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 错误的sku编码 -->
        <el-dialog
            title="提示"
            :visible.sync="activeskuvisible"
            width="700px">
            <h3 style="color:red;font-size:12px;">以下商品在该活动时间内有参加其他活动，请手动删除后再调整活动时间</h3>
            <div class="sku_box">
                <span v-for="(item,index) in sku_no_list" :key="index">
                    {{item.sku_no}}
                </span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="activeskuvisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {newActive,activedetail,activeUpdate} from '@/http/active.js'
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

        var intensity1 =(rule,value,callback)=>{
            var reg1 = new RegExp('^(([0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$')//匹配最多保留两位小数
            if(!value){
                callback(new Error('请输入优惠力度'))
            }else if(value != '' && !reg1.test(Number(value))){
                callback(new Error('一口价活动，优惠力度只能是数字且最多只能有两位小数'))
            }else if(value <= 0){
                callback(new Error('优惠力度必须大于0'))
            }else{
                callback()
            }
        }

        var intensity2 =(rule,value,callback)=>{
            var reg2 = new RegExp('^[1-9][0-9]*$')//匹配正整数
            if(!value){
                callback(new Error('请输入优惠力度'))
            }else if(value != '' && !reg2.test(Number(value))){
                callback(new Error('百分比活动，优惠力度只能是正整数'))
            }else if(value > 100 || value <= 0){
                callback(new Error('优惠力度必须大于0且小于等于100'))
            }else{
                callback()
            }
        }
        var intensity3 = (rule,value,callback) =>{
            var reg2 = new RegExp('^[1-9][0-9]*$')//匹配正整数
            if(!value){
                callback(new Error('请输入优惠力度'))
            }else if(value != '' && !reg2.test(Number(value))){
                callback(new Error('优惠力度只能是正整数'))
            }else{
                callback()
            }
        }
        return{
            pickerOptionsToday: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            activeId:'',//活动id
            activeform:{
                active_time:[],
                name:'',
                activity_type:2,
                activity_intensity:'',
                activity_intensity1:'',
                activity_intensity2:'',
                activity_intensity3:'',
                activity_intensity4:'',
                activity_start_time:'',
                activity_end_time:'',
                activity_rule:''
            },
            oldform:{},
            rules:{
                name:[
                    { validator:activename, trigger: 'blur' },
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min:1, max:20, message: '活动名称不能超过20个字符', trigger: 'blur' }
                ],
                activity_intensity1:[
                    { validator:intensity1, trigger: 'blur' },
                ],
                activity_intensity2:[
                    { validator:intensity2, trigger: 'blur' },
                ],
                activity_intensity3:[
                    { validator:intensity3, trigger: 'blur' },
                ],
                activity_intensity4:[
                    { validator:intensity3, trigger: 'blur' },
                ],
                active_time:[
                    { required: true, message: '请选择活动时间', trigger: 'blur' },
                ],
                activity_rule:[
                    { validator:activename, trigger: 'blur' },
                    {min:1, max:50, message: '活动规则不能超过50个字符', trigger: 'blur'}
                ]
            },
            timetype:false,
            activeskuvisible:false,//错误的sku编号弹框
            sku_no_list:[]
        }
    },
    created(){
        this.activeId = this.$route.query.id
        this.activeform.activity_type = this.$route.query.type
        if(this.activeId){
            this.getdetail()
        }
    },
    methods:{
        //修改活动时间
        changetime(){
            this.timetype = true
        },
        //编辑活动，获取详情
        getdetail(){
            activedetail({id:this.activeId}).then((res)=>{
                this.activeform = res.data.data
                this.oldform = res.data.data
                this.$set(this.activeform,'activity_intensity1','')
                this.$set(this.activeform,'activity_intensity2','')
                this.$set(this.activeform,'activity_intensity3','')
                this.$set(this.activeform,'activity_intensity4','')
                this.activeform[`activity_intensity${this.activeform.activity_type}`] = this.activeform.activity_intensity
                var activetime = []
                activetime.push(new Date(this.activeform.activity_start_time))
                activetime.push(new Date(this.activeform.activity_end_time))
                this.$set(this.activeform,'active_time',activetime)
            })
        },
        //编辑活动详情
        updataActive(form){
            if(this.activeform.active_time && this.activeform.active_time.length!=0 && this.timetype == true){
                this.activeform.activity_start_time = this.activeform.active_time[0]
                this.activeform.activity_end_time = this.activeform.active_time[1]
                this.editActive(form)
            }else if(this.activeform.active_time && this.activeform.active_time.length!=0 && this.timetype == false){
                this.activeform.activity_start_time = this.oldform.activity_start_time
                this.activeform.activity_end_time = this.oldform.activity_end_time
                this.editActive(form)
            }else{
                this.$message.warning('活动时间必填');
            }
        },
        //编辑活动
        editActive(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.activeform.activity_intensity = this.activeform[`activity_intensity${this.activeform.activity_type}`] 
                    activeUpdate(this.activeform).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$router.push({path:'/activeList'})
                        }else if(res.data.code == 103){
                            this.activeskuvisible = true
                            this.sku_no_list = res.data.data
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
        //新增活动
        saveActive(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.activeform.activity_intensity = this.activeform[`activity_intensity${this.activeform.activity_type}`]
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
.sku_box{
    width: 680px;
    height: 500px;
    overflow-y: scroll;
}
.sku_box span{
    display: inline-block;
    width:145px;
    margin:10px 10px;
}
</style>