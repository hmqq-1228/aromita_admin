<template>
    <div class="setCommodity">
        <div class="btn" v-if="activetype != 3">
            <el-button type="primary" v-if="activeStr == '未开始'" @click="addCommodity">添加商品</el-button>
            <el-button type="danger" v-if="activeStr == '未开始'" @click="bothdel">批量删除商品</el-button>
            <el-button type="danger" v-if="activeStr == '进行中'" @click="bothstop">批量终止商品</el-button>
        </div>
        <h3 v-if="activetype == 3 && activeStr != '未开始'">赠品</h3>
        <el-form :inline="true" v-if="activetype == 3 && activeStr == '未开始'">
            <el-form-item>
                <el-input v-model="sku_no" placeholder="请输入赠品编号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAvailableSkuByNo">确定</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" v-if="activetype != 3">
            <el-form-item>
                <el-input v-model="sku_no" placeholder="SKU编号" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="sku_name" placeholder="商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="活动价格区间">
                <el-input v-model="start_price" clearable style="width:100px"></el-input>
            </el-form-item>
            <el-form-item>
                至
            </el-form-item>
            <el-form-item>
                <el-input v-model="end_price" clearable style="width:100px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchCommodotyList()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="listData"
            style="width: 100%"
            max-height="700px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45" :selectable="selectInit" v-if="activeStr != '已结束' && activetype !=3"></el-table-column>
            <el-table-column prop="sku_no" label="SKU编号"></el-table-column>
            <el-table-column prop="sku_name" label="商品名称"></el-table-column>
            <el-table-column label="商品图片">
                <template slot-scope="scope">
                    <img :src="scope.row.sku_image" alt="" class="skuimg">
                </template>
            </el-table-column>
            <el-table-column prop="sku_price" label="商品原价">
                <template slot-scope="scope">
                    <span>$ {{scope.row.sku_price}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="activetype == 4?'加购价（$）':'活动价'" width="120px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.activity_price" v-if="activetype == 4 && activeStr == '未开始'" @blur="changePrice(scope.row.id,scope.row.activity_price,scope.row.sku_price)"></el-input>
                    <span v-else>$ {{scope.row.activity_price}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品活动状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.sku_status == 1 && activeStr == '未开始'">未开始</span>
                    <span v-else-if="scope.row.sku_status == 1 && activeStr == '进行中'">进行中</span>
                    <span v-else>已结束</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="结束时间">
                <template slot-scope="scope">
                    <span v-if="activeStr == '已结束'">
                        <span v-if="scope.row.stop_time!=null">{{scope.row.stop_time}}</span>
                        <span v-else-if="scope.row.stop_time == null && active_end_time && !active_stop_time">{{active_end_time}}</span>
                        <span v-else-if="scope.row.stop_time == null && active_stop_time">{{active_stop_time}}</span>
                    </span>
                    <span v-else>
                        <span v-if="scope.row.stop_time!=null">{{scope.row.stop_time}}</span>
                        <span v-else> / </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="activeStr != '已结束'">
                <template slot-scope="scope">
                    <el-button type="danger" v-if="activeStr == '未开始'" @click="deleteList(scope.row.activity_id,scope.row.sku_id)">删除</el-button>
                    <el-button type="danger" v-if="activeStr == '进行中'" @click="termination(scope.row.activity_id,scope.row.sku_id)" :disabled="scope.row.sku_status == 2?true:false">终止</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="15"
                @current-change="changeListPage">
            </el-pagination>
        </div>
        <!-- 添加商品弹框 -->
        <el-dialog
            title="添加商品"
            :visible.sync="commodityVisible"
            width="900px"
            @closed	="closevisible">
            <el-form :inline="true" :model="addform">
                <el-form-item label="商品二级类别">
                    <el-select v-model="addform.second_cate_id" clearable>
                        <el-option v-for="item in secondCategory" :key="item.id" :value="item.id" :label="item.cate_name">{{item.cate_name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="addform.sku_no" placeholder="请输入商品编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="addListdata" max-height="550px">
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <span v-if="scope.row.isAdd == true">已添加</span> -->
                        <el-button type="primary" @click="add(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="sku_no" label="SKU"></el-table-column>
                <el-table-column prop="sku_name" label="商品名称">
                    <template slot-scope="scope">
                        <p class="sku_name">{{scope.row.sku_name}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.sku_image" alt="" width="80px" height="80px">
                    </template>
                </el-table-column>
                <el-table-column prop="sku_price" label="商品售价"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="listTotal"
                    :page-size="15"
                    @current-change="changepage">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {activitySku,activitySkuindex,addactiveSku,delactiveSku,batchdelactiveSku,stopactiveSku,batchstopactiveSku,AvailableSkuByNo} from '@/http/active.js'
import qs from 'qs'
export default {
    data(){
        return{
            activetype:1,//活动类型
            active_stop_time:'',
            active_end_time:'',
            activeStr:'',
            page:1,
            total:0,
            activity_id:'',
            listData:[],
            commodityVisible:false,
            //弹框数据form
            secondCategory:[],//二级类目
            addListdata:[],
            listTotal:0,
            addform:{
                page:1,
                activity_id:'',
                activity_start_time:'',
                activity_end_time:'',
                second_cate_id:'',
                sku_no:''
            },
            sku_no:'',//商品编号
            sku_name:'',//商品名称
            start_price:'',//价格区间
            end_price:'',//
            skuid:[],
        }
    },
    created(){
        this.active_stop_time = this.$route.query.time3
        this.active_end_time = this.$route.query.time2
        this.activity_id = this.$route.query.id
        this.addform.activity_id = this.$route.query.id
        this.addform.activity_start_time = this.$route.query.time1
        this.addform.activity_end_time = this.$route.query.time2
        this.activeStr = this.$route.query.str
        this.activetype = this.$route.query.type
        if(this.activity_id){
            this.getskulist()
        }
    },
    methods:{
        //赠品活动
        getAvailableSkuByNo(){
            let pre={
                sku_no:this.sku_no,
                activity_start_time:this.$route.query.time1,
                activity_end_time:this.$route.query.time2
            }
            var form
            AvailableSkuByNo(pre).then((res)=>{
                if(res.data.code == 200){
                    form = res.data.data
                    let pre={
                        activity_id:this.activity_id,
                        sku_no:form.sku_no,
                        sku_name:form.sku_name,
                        sku_price:form.sku_price,
                        sku_image:form.sku_image,
                        sku_id:form.id,
                        activity_start_time:this.$route.query.time1,
                        activity_end_time:this.$route.query.time2
                    }
                    addactiveSku(pre).then((res)=>{
                        if(res.data.code ==200){
                            this.$message({
                                message: '商品已添加',
                                type: 'success'
                            });
                            this.sku_no = ''
                            this.getskulist()
                        }else{
                            this.$message({
                                message:res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        selectInit(row,index){
            if(row.sku_status==2){
                return false  //不可勾选
            }else{    
                return true  //可勾选
            }
        },
        //列表多选
        handleSelectionChange(val){
            var skuidarr = []
            for(var i=0;i<val.length;i++){
                var skuid = val[i].sku_id
                skuidarr.push(skuid)
            }
            this.skuid = skuidarr
        },
        searchCommodotyList(){
            this.page = 1
            this.getskulist()
        },
        //获取商品列表
        getskulist(){
            let pre={
                activity_id:this.activity_id,
                page:this.page,
                sku_no:this.sku_no,//商品编号
                sku_name:this.sku_name,//商品名称
                start_price:this.start_price,//价格区间
                end_price:this.end_price,//
            }
            activitySku(pre).then((res)=>{
                this.listData = res.data.data.data
                this.total = res.data.data.total
            })
        },
        changeListPage(val){
            this.page = val
            this.getskulist()
        },
        //修改加购价
        changePrice(id,price,oldprice){
            var reg1 = new RegExp('^(([0-9]+|0)\.([0-9]{1,2})$)|^[0-9][0-9]*$')//匹配最多保留两位小数
            if(reg1.test(Number(price)) && Number(price) < Number(oldprice)){
                this.$axios.put(`/backend/activitySku/${id}`,qs.stringify({activity_price:price})).then((res)=>{
                    if(res.data.code == 200 && res.data.data == 1){
                        this.$message.success('加购价修改成功')
                        this.getskulist()
                    }
                })
            }else{
                this.$message.error('加购价最多保留两位小数，且不能大于商品原价')
                this.getskulist()
            }
        },
        //添加商品弹框
        addCommodity(){
            this.addform.second_cate_id = ''
            this.addform.sku_no = ''
            this.commodityVisible = true
            this.addid = []
            this.getcommodityList()
        },
        //商品列表
        getcommodityList(){
            activitySkuindex(this.addform).then((res)=>{
                this.secondCategory = res.data.data.secondCategory
                this.addListdata = res.data.data.products.data
                this.listTotal = res.data.data.products.total
            })
        },
        changepage(val){
            this.addform.page = val
            this.getcommodityList()
        },
        //搜索
        searchList(){
            this.addform.page = 1
            this.getcommodityList()
        },
        //添加商品
        add(obj){
            let pre={
                activity_id:this.activity_id,
                sku_no:obj.sku_no,
                sku_name:obj.sku_name,
                sku_price:obj.sku_price,
                sku_image:obj.sku_image,
                sku_id:obj.id,
                activity_start_time:this.$route.query.time1,
                activity_end_time:this.$route.query.time2
            }
            addactiveSku(pre).then((res)=>{
                if(res.data.code ==200){
                    this.$message({
                        message: '商品已添加',
                        type: 'success'
                    });
                    this.getcommodityList()
                }else{
                    this.$message({
                        message:res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        //关闭添加商品弹框
        closevisible(){
            this.getskulist()
        },
        //删除商品
        deleteList(active_id,sku_id){
            this.$confirm('确定要删除这个商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delactiveSku({activity_id:active_id,sku_id:sku_id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getskulist()
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.data.msg
                        });
                    }
                }) 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //批量删除
        bothdel(){
            if(this.skuid.length == 0){
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的商品'
                });
            }else{
                var sku_id = this.skuid.join(',')
                this.$confirm('确定要删除这些商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchdelactiveSku({activity_id:this.activity_id,sku_id:sku_id}).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                type: 'success',
                                message: '活动商品已删除!'
                            });
                            this.getskulist()
                        }else{
                            this.$message({
                                type: 'error',
                                message:res.data.msg
                            });
                        }
                    }) 
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }
        },
        //终止商品
        termination(active_id,sku_id){
            this.$confirm('确定要终止这个商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stopactiveSku({activity_id:active_id,sku_id:sku_id}).then((res)=>{
                    if(res.data.code == 200){
                        this.$message({
                            type: 'success',
                            message: '活动商品已终止!'
                        });
                        this.getskulist()
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.data.msg
                        });
                    }
                }) 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        //批量终止商品
        bothstop(){
            if(this.skuid.length == 0){
                this.$message({
                    type: 'warning',
                    message: '请选择要终止的商品'
                });
            }else{
                var sku_id = this.skuid.join(',')
                this.$confirm('确定要终止这些商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchstopactiveSku({activity_id:this.activity_id,sku_id:sku_id}).then((res)=>{
                        if(res.data.code == 200){
                            this.$message({
                                type: 'success',
                                message: '活动商品已终止!'
                            });
                            this.getskulist()
                        }else{
                            this.$message({
                                type: 'error',
                                message:res.data.msg
                            });
                        }
                    }) 
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }
        }
    }
}
</script>
<style scoped>
.setCommodity .btn{
    margin-bottom: 20px;
}
.skuimg{
    width: 80px;
    height: 80px;
}
.pagination{
    margin-top: 10px;
    text-align: right;
}
.sku_name{
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>