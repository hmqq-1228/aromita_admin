<template>
    <div class="categoryList">
        <div class="heade">
            <h3>类别管理</h3>
        </div>
        <div>
            <!-- <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => append(data)">
                        Append
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)">
                        Delete
                    </el-button>
                    </span>
                </span>
            </el-tree> -->
        </div>
    </div>
</template>
<script>
import {categoryList} from "@/http/category.js"
export default {
    data(){
        return{

        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            categoryList().then((res)=>{

            })
        }
        // append(data) {
        //     const newChild = { id: id++, label: 'testtest', children: [] };
        //     if (!data.children) {
        //     this.$set(data, 'children', []);
        //     }
        //     data.children.push(newChild);
        // },
        // remove(node, data) {
        //     const parent = node.parent;
        //     const children = parent.data.children || parent.data;
        //     const index = children.findIndex(d => d.id === data.id);
        //     children.splice(index, 1);
        // },
    }
}
</script>