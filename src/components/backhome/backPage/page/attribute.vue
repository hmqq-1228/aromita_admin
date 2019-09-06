<template>
<div class="attribute">
  <el-table
    :cell-class-name="cellStyle"
    :data="attrList"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="attr_name"
      label="属性名"
      width="280">
    </el-table-column>
    <el-table-column
      prop="statusStr"
      label="属性状态"
      width="180">
    </el-table-column>
    <el-table-column
      prop="created_at"
      label="创建时间"
      width="280">
    </el-table-column>
    <el-table-column>
    </el-table-column>
    <el-table-column label="操作" width="280">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="closeAttr(scope.row.id)">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="attrDetail(scope.row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: "attribute",
  data() {
    return {
      attrList: [],
      state: true,
    }
  },
  created(){
    this.getProjectList()
  },
  methods: {
    cellStyle: function ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 2 && row.attr_status === 1) {
        return 'stateStyle'
      } else if (columnIndex === 2 && row.attr_status === 0) {
        return 'stateStyle1'
      }
    },
    getProjectList: function () {
      var that = this
      var obj = {
        per_page: 15,
      }
      this.$ajax.get('api/backend/product/attr', {}).then(res => {
        if (res.data.code === 200) {
          that.attrList = res.data.data.data
          for (var i=0;i<that.attrList.length;i++){
            this.$set(this.attrList[i],'statusStr','')
            if (that.attrList[i].attr_status === 1) {
              that.attrList[i].statusStr = '开启'
            }
          }
          console.log('lllll', that.attrList)
        }
      })
    },
    closeAttr: function (v) {
      console.log('vvvv', v)
    },
    attrDetail: function (v) {
      console.log('vvvv', v)
    }
  }
}
</script>

<style scoped>

</style>
