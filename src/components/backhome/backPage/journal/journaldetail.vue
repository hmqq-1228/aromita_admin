<template>
    <div class="journaldetail">
        <div class="heade">
            <h3>日志详情</h3>
        </div>
        {{detail}}
    </div>
</template>
<script>
export default {
    data(){
        return{
            journal_id:'',
            detail:null
        }
    },
    created(){
        this.journal_id = this.$route.query.id
        this.getDetail()
    },
    methods:{
        getDetail(){
            this.$axios.get(`/backend/log/${this.journal_id}`,{}).then((res)=>{
                if(res.data.code == 200){
                    this.detail = res.data.data
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>