<template>
    <div class="renovation">
        <div class="renovation_left">
            <draggable
                class="dragArea list-group"
                :list="list1"
                :group="{ name: 'comp', pull: 'clone', put: false }"
                @change="log">
                <div class="list-group-item" v-for="element in list1" :key="element.id">{{ element.name }}</div>
            </draggable>
        </div>
        <div class="renovation_center">
            <draggable
                tag="el-collapse"
                class="dragArea list-group"
                :list="list2"
                group="comp"
                @change="log">
                <div v-for="(item,index) in list2" :key="index">
                    <el-carousel height="350px" v-if="item.type == 1">
                        <el-carousel-item v-for="item1 in 4" :key="item1">
                            <img src="@/assets/images/yue.jpg" alt="" style="width:100%;height:550px">
                        </el-carousel-item>
                    </el-carousel>
                    <div v-if="item.type ==2" style="background:red;height:60px;line-height:60px;color:#fff">我是倒计时</div>
                    <div v-if="item.type ==3" style="background:blue;height:400px;line-height:400px;color:#fff;text-align:center">我是商品列表</div>
                </div>
            </draggable>
        </div>
        <div class="renovation_right"></div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  data() {
    return {
      list1: [
        { name: "banner图", type:1, content: "内容内容内容。。。。" },
        { name: "倒计时", type: 2, content: "内容内容内容。。。。" },
      ],
      list2: [
          { name: "我是商品列表", type: 3, content: "内容内容内容。。。。" },
      ],
      activeNames: [],
      count: 0
    };
  },

  methods: {
    log: function(evt) {
      if (evt.added) {
        this.count += 1;
        const item = evt.added.element;
        const idx = this.list2.findIndex(e => e.id === item.id);
        let temp = JSON.parse(JSON.stringify(this.list2));
        temp[idx].id = this.count;
        this.list2 = temp;
      }
    },
    handleChange: function() {},
    deleteItem: function(index) {
      this.list2.splice(index, 1);
    }
  }
};
</script>
<style>
.renovation{
  display: flex;
  width: 100%;
}
.renovation_left{
    flex:1
}
.renovation_center{
    flex:3;
    margin:0 10px;
    border:1px solid #e5e5e5;
    max-height: 800px;
    overflow-y: scroll
}
.renovation_right{
    flex:2
}
.list-group {
    min-height: 800px;
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    border: 0;
}

.list-group-item:first-child {
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-sizing: border-box;
}

.el-collapse-item__header {
  border: 0;
  height: 40px;
  line-height: 40px;
}

.el-collapse-item__wrap {
  border-bottom: 0;
}

.list-group-item {
  cursor: move;
}

h3 {
  font-size: 28px;
  margin-bottom: 20px;
}

.el-icon-circle-close {
  color: #c9a2a2;
  font-size: 20px;
  position: absolute;
  right: 50px;
}

.el-icon-circle-close:hover {
  color: #f40;
}
</style>