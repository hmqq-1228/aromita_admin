<template>
    <div class="commodity">
        <div class="heade">
            <h3>待上货商品管理</h3>
        </div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="SKU管理" name="first">
                <div class="skuCenter">
                    <el-form :inline="true">
                        <el-form-item label="是否分配SPU：">
                            <el-select>

                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SPU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SKU名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入SKU编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">搜 索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="skuList"
                        style="width: 100%">
                        <el-table-column prop="date" label="商品"></el-table-column>
                        <el-table-column prop="date" label="优先级"></el-table-column>
                        <el-table-column prop="date" label="一级类别名称"></el-table-column>
                        <el-table-column prop="date" label="二级类别名称"></el-table-column>
                        <el-table-column prop="date" label="推荐售价"></el-table-column>
                        <el-table-column prop="date" label="最终售价"></el-table-column>
                        <el-table-column prop="date" label="商品状态"></el-table-column>
                        <el-table-column prop="date" label="允许更新库存"></el-table-column>
                        <el-table-column prop="date" label="库存"></el-table-column>
                        <el-table-column prop="date" label="操作">
                            <template></template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="SPU管理" name="second">

            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeName:'first',
            skuList:[],
        }
    },
    created(){

    },
    methods:{

    }
}
</script>
<style>
    .skuCenter .el-input{width:200px!important}
</style>
