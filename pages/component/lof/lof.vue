<template>
  <view
    class="page-content"
    style="background:#FFFFFF;"
  >
    <view class="headerInfo">
      <view>数据获取时间：{{ getTime }}</view>
      <view>
        <button
          class="mini-btn"
          type="primary"
          size="mini"
          @click="getData"
        >刷新</button>
      </view>
    </view>
    <view class="bs">
      <simplex-table
        :data="sortedData"
        :columns="columns"
        :height="500"
        @sort-change="handleSortChange"
        border
      />
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        sortedData: [],
        getTime: '暂无数据',
        columns: [
          { title: '姓名', key: 'name', width: 150, fixed: true },
          { title: '年龄', key: 'age', width: 150, sortable: true, },
          { title: '部门', key: 'department', width: 150 }
        ]
      }
    },
    methods: {
      getData () {
        this.originalData = [
          { id: 1, name: '张三', age: 25, department: '技术部' },
          { id: 2, name: '李四', age: 30, department: '产品部' },
          { id: 3, name: '王五', age: 28, department: '设计部' },
          { id: 4, name: '赵六', age: 32, department: '销售部' },
          { id: 5, name: '王二', age: 29, department: '销售部' },
          { id: 6, name: '王三', age: 31, department: '销售部' },
          { id: 7, name: '王四', age: 33, department: '销售部' },
          { id: 8, name: '王五', age: 34, department: '销售部' },
          { id: 9, name: '王六', age: 35, department: '销售部' },
          { id: 10, name: '王二', age: 29, department: '销售部' },
          { id: 11, name: '王三', age: 31, department: '销售部' },
          { id: 12, name: '王四', age: 33, department: '销售部' },
          { id: 13, name: '王五', age: 34, department: '销售部' },
          { id: 14, name: '王六', age: 35, department: '销售部' },
          { id: 15, name: '王七', age: 36, department: '销售部' },
          { id: 16, name: '王八', age: 37, department: '销售部' },
          { id: 17, name: '王九', age: 38, department: '销售部' },
          { id: 18, name: '王十', age: 39, department: '销售部' },
          { id: 19, name: '王十一', age: 40, department: '销售部' },
          { id: 20, name: '王十二', age: 41, department: '销售部' },
        ]
        this.sortedData = this.originalData;
        this.getTime = this.$dayjs().format('YYYY-MM-DD')
      },
      handleSortChange ({ key, order }) {
        this.sortedData = [...this.originalData].sort((a, b) => {
          if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }
  }
</script>
<style>
  .headerInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
  }
</style>
