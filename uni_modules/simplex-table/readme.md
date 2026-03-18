# SimpleX-Table 表格组件

一个功能丰富的 UniApp 表格组件，支持固定列、排序、滚动加载等功能。

## 功能特性

- 支持固定列（sticky columns）
- 支持列排序
- 支持水平和垂直滚动
- 支持自定义列宽
- 支持空数据提示
- 支持滚动加载更多
- 支持边框样式配置
- 支持自定义行唯一标识

## 参数说明

| 参数名 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | Array | `[]` | 表格数据 |
| `columns` | Array | - | 表头配置（必填） |
| `rowKey` | String/Function | `'id'` | 行数据的唯一标识字段 |
| `height` | Number/String | `'auto'` | 表格高度 |
| `emptyText` | String | `'暂无数据'` | 空数据提示文字 |
| `loadingText` | String | `'加载中...'` | 加载中提示文字 |
| `defaultColumnWidth` | Number | `75` | 默认列宽 |
| `border` | Boolean | `false` | 是否需要边框 |
| `defaultSort` | Object | `{key: '', order: ''}` | 默认排序配置 |

### Columns 配置项

每个 `columns` 数组元素支持以下属性：

| 属性名 | 类型 | 默认值 | 说明                              |
|--------|------|--------|---------------------------------|
| `title` | String | - | 列标题（必填）                         |
| `key` | String | - | 数据字段名                           |
| `width` | Number | `defaultColumnWidth` | 列宽度                             |
| `fixed` | Boolean | `false` | 是否固定列                           |
| `align` | String | `'left'` | 对齐方式（left/center/right）         |
| `sortable` | Boolean | `false` | 是否可排序                           |
| `type` | String | - | 特殊列类型（如 'index' 序号列，会在内部处理序号逻辑） |
| `emptyValue` | String | `''` | 空值时显示的内容                        |
| `ellipsis` | Boolean | `false` | 文本是否溢出省略                        |

## 事件说明

| 事件名 | 参数 | 说明            |
|--------|------|---------------|
| `sort-change` | `{column, key, order, sortBy, sortOrder}` | 排序状态改变时触发     |
| `scroll` | `{scrollLeft, scrollTop}` | 滚动时触发         |

## 使用示例

### 基础用法

```vue
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
  data() {
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
```


### 固定列和排序

```vue
<template>
  <view>
    <simplex-table 
      :data="tableData" 
      :columns="columns" 
      :height="400"
      @sort-change="handleSortChange"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, name: '张三', age: 25, department: '技术部', salary: 12000 },
        { id: 2, name: '李四', age: 30, department: '产品部', salary: 15000 },
        { id: 3, name: '王五', age: 28, department: '设计部', salary: 10000 }
      ],
      columns: [
        { title: 'ID', key: 'id', width: 80, fixed: true, sortable: true },
        { title: '姓名', key: 'name', width: 100, fixed: true },
        { title: '年龄', key: 'age', width: 80, sortable: true },
        { title: '部门', key: 'department', width: 120 },
        { title: '薪资', key: 'salary', width: 100, sortable: true }
      ]
    }
  },
  methods: {
    handleSortChange(sortInfo) {
      console.log('排序信息:', sortInfo)
      // 根据 sortInfo.sortBy 和 sortInfo.sortOrder 进行排序处理
    }
  }
}
</script>
```


## 使用场景

1. **数据展示**：展示结构化数据，如用户列表、订单信息等
2. **数据分析**：展示大量数据的统计信息
3. **后台管理系统**：在管理后台中展示各类业务数据
4. **移动端报表**：在移动设备上展示报表数据
5. **复杂表格**：需要固定列、排序等高级功能的场景

## 注意事项

1. 当使用固定列功能时，建议为固定列设置明确的 `width`
2. 排序功能需要在列配置中设置 `sortable: true`
3. 使用嵌套数据时，通过 `key` 属性指定路径，如 `user.name`
4. 表格高度默认为 `auto`，会自动计算窗口高度，也可手动指定具体数值
5. 当数据为空时会显示 `emptyText` 设置的提示信息
6. 滚动加载功能需要配合 `load-more` 和 `load-complete` 事件使用

## 样式自定义

组件使用了以下 UniApp 样式变量，可以通过全局样式覆盖：

- `$uni-bg-color` - 背景色
- `$uni-border-color` - 边框颜色
- `$uni-text-color` - 文字颜色
- `$uni-text-color-grey` - 灰色文字颜色
- `$uni-font-size-base` - 基础字体大小
- `$uni-color-primary` - 主色调

可以通过覆盖这些变量来自定义组件样式。
