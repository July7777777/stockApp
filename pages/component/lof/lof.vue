<template>
  <view>
    <simplex-table
      :data="tableData"
      :columns="columns"
      :height="400"
      border
    />
  </view>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [
          { id: 1, name: '张三', age: 25, department: '技术部' },
          { id: 2, name: '李四', age: 30, department: '产品部' },
          { id: 3, name: '王五', age: 28, department: '设计部' }
        ],
        columns: [
          { title: '姓名', key: 'name', width: 150 },
          { title: '年龄', key: 'age', width: 150 },
          { title: '部门', key: 'department', width: 150 }
        ]
      }
    }
  }
</script>