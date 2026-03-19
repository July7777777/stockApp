<template>
  <view class="x-table-container">
    <!-- 表格区域 -->
    <view class="x-table-box">
      <scroll-view
        class="x-table-scroll"
        :style="{ maxHeight: tableHeight * 2 + 'rpx' }"
        scroll-y="true"
        scroll-x="true"
        @scroll="handleScroll"
        @scrolltolower="handleScrollToLower"
        :scroll-with-animation="false"
        :enable-back-to-top="false"
        :throttle="false"
        bounces="false"
      >
        <view class="x-table-scroll-view">
          <!-- 表头 -->
          <view
            class="x-table-header"
            :style="{ width: totalWidth * 2 + 'rpx' }"
          >
            <view
              class="x-table-header-item"
              v-for="(column, index) in columns"
              :key="index"
              :class="{
                'fixed-column': column.fixed,
                'last-fixed-column': isLastFixedColumn(index) && showShadow,
                'first-fixed-column': index === 0,
                'full-border': border,
                'bottom-border': !border,
                'sortable-header': column.sortable,
              }"
              :style="{
                width: (column.width || defaultColumnWidth) * 2 + 'rpx',
                left: column.fixed ? getFixedLeft(index) * 2 + 'rpx' : '',
              }"
              @click="handleHeaderClick(column, index)"
            >
              <view
                class="x-header-content"
                :style="{
                  textAlign: column.align || 'left',
                  justifyContent:
                    column.align === 'center'
                      ? 'center'
                      : column.align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                }"
              >
                <text class="header-title">{{ column.title }}</text>
                <!-- 排序图标 -->
                <view
                  v-if="column.sortable"
                  class="sort-icons"
                >
                  <view
                    class="sort-icon sort-asc"
                    :class="{
                      active:
                        sortConfig.key === column.key &&
                        sortConfig.order === 'asc',
                    }"
                  >
                    ▲
                  </view>
                  <view
                    class="sort-icon sort-desc"
                    :class="{
                      active:
                        sortConfig.key === column.key &&
                        sortConfig.order === 'desc',
                    }"
                  >
                    ▼
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 表格内容 -->
          <view class="x-table-content">
            <view
              class="x-table-content-line"
              v-for="(dataItem, index) in displayList"
              :key="getRowKey(dataItem, index)"
              :style="{ width: totalWidth * 2 + 'rpx' }"
            >
              <view
                class="x-table-content-line-item"
                v-for="(column, colIndex) in columns"
                :key="colIndex"
                :class="{
                  'fixed-column': column.fixed,
                  'last-fixed-column':
                    isLastFixedColumn(colIndex) && showShadow,
                  'first-fixed-column': colIndex === 0,
                  'full-border': border,
                  'bottom-border': !border,
                  'ellipsis-cell': column.ellipsis,
                }"
                :style="{
                  width: (column.width || defaultColumnWidth) * 2 + 'rpx',
                  left: column.fixed ? getFixedLeft(colIndex) * 2 + 'rpx' : '',
                  textAlign: column.align || 'left',
                  justifyContent:
                    column.align === 'center'
                      ? 'center'
                      : column.align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                }"
              >
                {{ getCellValue(dataItem, column, index) }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 空数据提示 - 移到scroll-view外部 -->
      <view
        v-if="displayList.length === 0"
        class="x-empty-data"
      >
        {{ emptyText }}
      </view>
    </view>

    <!-- 加载更多提示 -->
    <view
      v-if="loading"
      class="x-loading-tip"
    >{{ loadingText }}</view>
  </view>
</template>

<script>
  export default {
    name: "SimplexTable",
    props: {
      // 表格数据
      data: {
        type: Array,
        default: () => [],
      },
      // 表头配置
      columns: {
        type: Array,
        required: true,
      },
      // 行数据的唯一标识字段
      rowKey: {
        type: [String, Function],
        default: "id",
      },
      // 表格高度
      height: {
        type: [Number, String],
        default: "auto",
      },
      // 空数据提示文字
      emptyText: {
        type: String,
        default: "暂无数据",
      },
      // 加载中提示文字
      loadingText: {
        type: String,
        default: "加载中...",
      },
      // 默认列宽
      defaultColumnWidth: {
        type: Number,
        default: 75,
      },
      // 是否需要边框
      border: {
        type: Boolean,
        default: false,
      },
      // 默认排序配置
      defaultSort: {
        type: Object,
        default: () => ({
          key: "",
          order: "", // 'asc' | 'desc' | ''
        }),
      },
    },
    data () {
      return {
        loading: false,
        currentPage: 1,
        systemInfo: {},
        scrollTop: 0,
        scrollLeft: 0,
        // 排序配置
        sortConfig: {
          key: this.defaultSort.key || "",
          order: this.defaultSort.order || "",
        },
      };
    },
    computed: {
      // 当前显示的数据列表
      displayList () {
        return this.data;
      },

      // 表格总宽度
      totalWidth () {
        return this.columns.reduce((total, column) => {
          return total + (column.width || this.defaultColumnWidth);
        }, 0);
      },

      // 表格高度(此处应为最大高度，当没有数据时会变成单行高度，以免表格被撑开）
      tableHeight () {
        if (this.height === "auto") {
          const windowHeight = this.systemInfo.windowHeight || 600;
          return windowHeight - 48;
        }
        return typeof this.height === "number"
          ? this.height
          : parseInt(this.height);
      },

      // 找到columns最后一个有fixed参数的项的index
      lastFixedColumnIndex () {
        for (let i = this.columns.length - 1; i >= 0; i--) {
          if (this.columns[i].fixed) {
            return i;
          }
        }
        return -1;
      },

      // 只有当水平滚动位置大于0时才显示阴影
      showShadow () {
        return this.scrollLeft > 0;
      },
    },
    watch: {
      // 监听默认排序配置变化
      defaultSort: {
        handler (newVal) {
          this.sortConfig = {
            key: newVal.key || "",
            order: newVal.order || "",
          };
        },
        deep: true,
        immediate: true,
      },
    },
    mounted () {
      // 获取系统信息
      // #ifdef MP-WEIXIN
      this.systemInfo = uni.getWindowInfo();
      // #endif
      // #ifndef MP-WEIXIN
      uni.getSystemInfo({
        success: (res) => {
          this.systemInfo = res;
        },
      });
      // #endif
    },
    methods: {
      // 计算固定列的left值
      getFixedLeft (index) {
        let left = 0;
        for (let i = 0; i < index; i++) {
          if (this.columns[i].fixed) {
            left += this.columns[i].width || this.defaultColumnWidth;
          } else {
            break;
          }
        }
        return left;
      },

      // 判断当前列是否是最后一个固定列
      isLastFixedColumn (index) {
        return index === this.lastFixedColumnIndex;
      },

      // 获取单元格值
      getCellValue (row, column, index) {
        // 如果是序号列，返回索引+1
        if (column.type === "index") {
          return index + 1;
        }

        let value;
        if (column.key && column.key.includes(".")) {
          // 支持嵌套属性，如 'user.name'
          value = column.key
            .split(".")
            .reduce((obj, key) => obj && obj[key], row);
        } else {
          value = row[column.key];
        }

        // 处理 null、undefined 或空字符串的情况
        if (value === null || value === undefined || value === "") {
          // 如果列配置中定义了 emptyValue，则使用它，否则默认显示 '-'
          return column?.emptyValue || "";
        }

        return value;
      },

      // 获取行的唯一标识
      getRowKey (row, index) {
        if (typeof this.rowKey === "function") {
          return this.rowKey(row, index);
        }
        return row[this.rowKey] || index;
      },

      // 处理表头点击事件
      handleHeaderClick (column, index) {
        // 如果列不支持排序，直接返回
        if (!column.sortable) {
          return;
        }

        let newOrder = "";

        // 如果点击的是当前排序列
        if (this.sortConfig.key === column.key) {
          // 切换排序顺序：无排序 -> 正序 -> 倒序 -> 无排序
          switch (this.sortConfig.order) {
            case "":
              newOrder = "asc";
              break;
            case "asc":
              newOrder = "desc";
              break;
            case "desc":
              newOrder = "";
              break;
          }
        } else {
          // 点击新列，默认正序
          newOrder = "asc";
        }

        // 更新排序配置
        this.sortConfig = {
          key: newOrder ? column.key : "",
          order: newOrder,
        };

        // 发送排序事件给父组件
        this.$emit("sort-change", {
          column: column,
          key: this.sortConfig.key,
          order: this.sortConfig.order,
          // 提供排序参数，方便API调用
          sortBy: this.sortConfig.key,
          sortOrder: this.sortConfig.order,
        });
      },

      // 处理滚动事件
      handleScroll (e) {
        // 更新水平滚动位置
        this.scrollLeft = e.detail.scrollLeft || 0;
        this.$emit("scroll", e.detail);
      },

      // 触底事件
      handleScrollToLower () {
        if (this.loading) return;

        const hasMore = this.currentPage * this.pageSize < this.data.length;

        if (hasMore) {
          this.loading = true;
          setTimeout(() => {
            this.currentPage++;
            this.loading = false;
            this.$emit("load-more", {
              page: this.currentPage,
              pageSize: this.pageSize,
            });
          }, 300);
        } else {
          this.$emit("load-complete");
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .x-table-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 29rpx;
    margin: 0;
    background-color: $uni-bg-color;
    overscroll-behavior: none;
  }

  .full-border {
    border: 1rpx solid $uni-border-color;
  }

  .bottom-border {
    border-bottom: 1rpx solid $uni-border-color;
  }

  .x-table-box {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    position: relative;
    z-index: 90;
    overscroll-behavior: none;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .x-table-scroll {
    background: $uni-bg-color;
    overscroll-behavior: none;
  }

  .x-table-header {
    position: sticky;
    top: 0;
    z-index: 90;
    display: grid;
    grid-auto-flow: column;
    font-size: 28rpx;
    font-weight: bold;
    color: $uni-text-color;
    background: $uni-bg-color;
    border-top: 1rpx solid $uni-border-color;
    // border-right: 1rpx solid $uni-border-color;
    // border-left: 1rpx solid $uni-border-color;
  }

  .x-table-header-item {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    background: $uni-bg-color;
    height: 100rpx;
    position: relative;
    border-left: 0;
    border-top: 0;
    padding-block: 20rpx;
    padding-inline: 20rpx;

    &.sortable-header {
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .x-header-content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .sort-icons {
    display: flex;
    flex-direction: column;
    margin-left: 8rpx;
    align-items: center;
  }

  .sort-icon {
    font-size: 18rpx;
    line-height: 1;
    color: $uni-text-color-grey;
    transition: color 0.2s;

    &.sort-asc {
      margin-bottom: 2rpx;
    }

    &.active {
      color: $uni-color-primary;
    }
  }

  .x-table-content {
    background-color: $uni-bg-color;
    position: relative;
    min-height: 100rpx;
    border-right: 1rpx solid $uni-border-color;
    // border-left: 1rpx solid $uni-border-color;
  }

  .x-table-content-line {
    display: grid;
    grid-auto-flow: column;
    position: relative;
    background-color: $uni-bg-color;
  }

  .x-table-content-line-item {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    background-color: $uni-bg-color;
    height: 100rpx;
    border-left: 0;
    border-top: 0;
    word-break: break-all;
    overflow: hidden;
    font-weight: 500;
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    padding-block: 20rpx;
    padding-inline: 20rpx;

    &.ellipsis-cell {
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: normal;
    }
  }

  .fixed-column {
    position: sticky;
    z-index: 88;
    background-color: inherit;
  }

  .last-fixed-column {
    box-shadow: 6rpx 0 6rpx -2rpx rgba(0, 0, 0, 0.15);
  }

  .first-fixed-column {
    border-left: 1rpx solid $uni-border-color;
  }


  .x-empty-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding-top: 120rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-base;
    z-index: 100;
    background-color: transparent;
    pointer-events: none;
  }

  .x-loading-tip {
    text-align: center;
    padding: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-base;
  }
</style>
