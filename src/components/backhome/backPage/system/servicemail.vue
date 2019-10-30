<template>
    <div class="servicemail">
        <div class="heade">
            <h3>服务邮件管理</h3>
        </div>
        <el-form :inline="true">
            <el-form-item label="邮件状态">
                <el-select placeholder="请选择">
                    <el-option label="开启" value="1"></el-option>
                    <el-option label="关闭" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入邮件中文名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入邮件英文名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入发件邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table>
            <el-table-column prop="product_no" label="中文名称"></el-table-column>
            <el-table-column prop="product_no" label="英文名称"></el-table-column>
            <el-table-column prop="product_no" label="发件邮箱"></el-table-column>
            <el-table-column prop="product_no" label="发件频率"></el-table-column>
            <el-table-column prop="product_no" label="邮件状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            emailFrom:{
                status:'',

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

</style>