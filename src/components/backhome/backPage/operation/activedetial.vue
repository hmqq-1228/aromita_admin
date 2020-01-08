<template>
    <div class="activedetial">
        <div class="heade">
            <h3>活动详情</h3>
        </div>
        <div class="detail" v-if="detail!=null">
            <p><span>活动类型：</span>{{activity_type_list[detail.activity_type]}}</p>
            <p><span>活动名称：</span>{{detail.name}}</p>
            <p>
                <span>优惠力度：</span>{{detail.activity_intensity}} 
                <span v-if="detail.activity_type == 2">（% OFF）</span> 
                <span v-if="detail.activity_type == 1">（$）</span> 
            </p>
            <p><span>活动时间：</span>{{detail.activity_start_time}} -- {{detail.activity_end_time}}</p>
            <p><span>活动规则：</span><span v-if="detail.activity_rule != null">{{detail.activity_rule}}</span><span v-else>暂 无</span></p>
        </div>
    </div>
</template>
<script>
import {activelistdetail} from '@/http/active.js'
export default {
    data(){
        return{
            activeid:'',
            detail:null,
            activity_type_list:{
                1:"一口价活动",
                2:"百分比活动"
            }
        }
    },
    created(){
        this.activeid = this.$route.query.id
        if(this.activeid){
            this.getdetail()
        }
    },
    methods:{
        getdetail(){
            activelistdetail({id:this.activeid}).then((res)=>{
                this.detail = res.data.data
            })
        }
    }
}
</script>
<style scoped>
.detail p{
    height:50px;
    line-height: 50px;
}
</style>