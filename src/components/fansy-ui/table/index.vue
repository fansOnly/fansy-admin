<template>
  <div>
    <div v-if="toolsConfig.show" class="flex-[center,space-between] mb-4">
      <div class="flex flex-1">
        <el-button v-if="toolsConfig.showAdd" :icon="toolsConfig.addButtonIcon" @click="emit('add')">{{
          toolsConfig.addButtonText }}</el-button>
        <el-button v-if="toolsConfig.showSelect" type="primary" @click="toggleSelect()">{{
          selections.length ? toolsConfig.unSelectButtonText : toolsConfig.selectButtonText
        }}</el-button>
        <template v-if="toolsConfig.showDelete">
          <el-button v-show="selections.length" type="danger" :icon="toolsConfig.deleteButtonIcon"
            @click="onBatchDelete()">{{ toolsConfig.deleteButtonText }}</el-button>
        </template>
        <template v-if="toolsConfig.showExport">
          <el-button v-show="selections.length" :icon="toolsConfig.exportButtonIcon" @click="onExport()">{{
            toolsConfig.exportButtonText }}</el-button>
        </template>
        <template v-if="toolsConfig.showImport">
          <el-button :icon="toolsConfig.importButtonIcon" @click="onImport()">{{
            toolsConfig.importButtonText
          }}</el-button>
        </template>
        <slot name="tools"></slot>
      </div>
      <div class="flex">
        <el-tooltip content="设置样式" placement="top">
          <el-icon class="cursor-pointer" size="18">
            <Tools />
          </el-icon>
        </el-tooltip>
        <!-- Operation start -->
        <el-icon ref="operationRef" v-click-outside="onClickOutside" size="18" class="ml-3 cursor-pointer">
          <Operation @hover="tooltipVisible = !tooltipVisible" @click="tooltipVisible = false" />
        </el-icon>
        <el-tooltip v-model:visible="tooltipVisible" content="设置列" placement="top" virtual-triggering
          :virtual-ref="operationRef" />
        <el-popover ref="popoverRef" :virtual-ref="operationRef" virtual-triggering :show-arrow="false"
          placement="bottom" :width="176" trigger="click">
          <VueDraggable v-if="showTable" v-model="tableColumns" target=".el-table__body tbody" handle=".handle"
            animation="150" ghostClass="ghost" @end="onDragEnd">
            <el-table :data="tableColumns" size="small" style="width: 100%" max-height="400"
              :row-class-name="onSetRowClass">
              <el-table-column width="50" property="" label="排序">
                <template #default="scope">
                  <el-icon v-if="scope.row.show && !scope.row.fixed" class="handle cursor-move">
                    <Sort />
                  </el-icon>
                  <el-icon v-else>
                    <Lock />
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column width="100" property="" label="是否显示">
                <template #default="scope">
                  <el-checkbox :checked="scope.row.show" :label="scope.row.label" :disabled="scope.row.fixed"
                    size="small" @change="onToggleColumnShow(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </VueDraggable>
        </el-popover>
        <!-- Operation end -->
        <el-tooltip content="待定" placement="top">
          <el-icon class="ml-3 cursor-pointer" size="18">
            <Histogram />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="待定" placement="top">
          <el-icon class="ml-3 cursor-pointer" size="18">
            <Grid />
          </el-icon></el-tooltip>
      </div>
    </div>
    <el-table v-if="showTable" ref="tableRef" v-loading="loading" :data="tableData" :rowKey="rowKey"
      :border="tableConfig.border" :stripe="tableConfig.stripe" style="width: 100%" @row-click="onRowClick"
      @selection-change="onSelectionChange">
      <!-- 选择栏 -->
      <template v-if="toolsConfig.showSelect">
        <el-table-column v-if="tableConfig.selection === 'single'" min-width="47"
          :fixed="shouldSingleSelectionColumnFixed">
          <template #default="scope">
            <el-radio :model-value="selection" :value="scope.row[rowKey]" />
          </template>
        </el-table-column>
        <el-table-column v-else-if="tableConfig.selection === 'multiple'" type="selection" width="42" />
      </template>
      <!-- 自定义栏 -->
      <el-table-column v-for="column in activeTableColumns" :key="column.prop" :property="column.prop"
        :label="column.label" :width="column.width || ''" :min-width="column.minWidth || ''" :fixed="column.fixed"
        :resizable="column.resizable || true" :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align || 'left'" :formatter="column.formatter">
        <template v-if="column.custom" #default="scope">
          <slot :name="column.prop" :index="scope.$index" :row="scope.row"></slot>
        </template>
        <template v-else-if="column.prop === 'status'" #default="scope">
          <div class="flex-[center] whitespace-nowrap">
            <div class="relative w-16px mr-4px">
              <el-badge is-dot :type="getBadgeType(scope.row.status)" :offset="[-17, 8]">
                <div :class="['badge-status', `is-${getBadgeType(scope.row.status)}`]"></div>
              </el-badge>
            </div>
            <template v-if="column.formatter">{{ column.formatter(scope.row) }}</template>
            <template v-else>{{ scope.row.status }}</template>
          </div>
        </template>
      </el-table-column>
      <!-- 操作栏 -->
      <el-table-column label="操作" :width="tableConfig.actionColumnWidth" :min-width="tableConfig.actionColumnMinWidth"
        :fixed="tableConfig.isActionColumnFixed ? 'right' : false">
        <template #default="scope">
          <el-button v-for="(action, index) in effectiveActions(scope.row.status)" :key="index" size="small"
            :type="action.type" :icon="action.icon" :text="tableConfig.isActionButtonText"
            @click="onAction(action, scope.$index, scope.row)">
            {{ action.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="pagination.show" class="flex-[center,flex-end] pt-20px">
      <el-pagination v-model:current-page="initData.pagination.currentPage"
        v-model:page-size="initData.pagination.pageSize" :page-sizes="pageSizes" :background="pagination.background"
        :layout="tableConfig.pagination.layout" :total="initData.pagination.total" @change="onPageChange" />
    </div>
  </div>
</template>

<script setup>
import { ClickOutside as vClickOutside } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { COMMON_ACTIONS, BADGE_STATUS_LIST } from '@/constants/common'
import { getConstantLabel } from '@/constants/util'
import { useMessage } from '@/hooks/use-message'
const { useMessageBox } = useMessage()

const props = defineProps({
  loading: Boolean,
  tableConfig: Object,
  tableData: Array,
  /**
   * @param {string} label 文本
   * @param {string} prop 键值
   * @param {boolean} fixed 固定栏 left right
   * @param {boolean} showOverflowTooltip 超出一行省略显示
   * @param {number} width 栏宽度
   */
  columns: Array,
  /**
   * @param {number} sortnum 排序
   * @param {string} label 文本
   * @param {string} value 键值
   * @param {string} icon 图标
   * @param {string} type 按钮类型
   * @param {Function} isShow 显示条件
   * @param {any} data 目标值
   */
  actions: {
    type: Array,
    default: () => []
  },
  initData: Object,
  toolsConfig: Object
})
const emit = defineEmits(['add', 'batch-delete', 'export', 'import', 'action', 'page-change'])

// 设置 prop 默认值
const tableConfig = Object.assign(
  {
    rowKey: 'id',
    selection: 'multiple', // single multiple
    border: true,
    stripe: true,
    pagination: {
      show: true,
      // pageSizes: [10, 20, 30, 40, 50],
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true
    },
    isActionButtonText: false, // 操作按钮文字
    isActionColumnFixed: false, // 固定操作栏
    actionColumnWidth: 250,
    useDialogDelete: true, // 使用弹窗删除
    actionPublishText: '发布',
    actionUnPublishText: '下架'
  },
  props.tableConfig
)
const initData = Object.assign(
  {
    selections: [],
    selection: '',
    pagination: {
      total: 0
    }
  },
  props.initData
)
const toolsConfig = Object.assign(
  {
    show: true,
    showAdd: true,
    showSelect: true,
    showExport: false,
    showImport: false,
    showDelete: true,
    showEdit: true,
    showPublish: true,
    addButtonText: '新增',
    addButtonIcon: 'Plus',
    deleteButtonText: '删除',
    deleteButtonIcon: 'Delete',
    selectButtonText: '全选',
    unSelectButtonText: '取消选中',
    exportButtonText: '导出 Excel',
    exportButtonIcon: 'Download',
    importButtonText: '导入 Excel',
    importButtonIcon: 'Upload'
  },
  props.toolsConfig
)
const actions = [
  {
    sortnum: 10,
    label: '编辑',
    value: COMMON_ACTIONS.EDIT,
    icon: 'Edit',
    isShow: () => toolsConfig.showEdit
  },
  {
    sortnum: 20,
    label: '发布',
    value: COMMON_ACTIONS.PUBLISH,
    icon: 'Promotion',
    type: 'success',
    isShow: (status) => toolsConfig.showPublish && status === 0,
    data: 1
  },
  {
    sortnum: 30,
    label: '下架',
    value: COMMON_ACTIONS.UN_PUBLISH,
    type: 'warning',
    icon: 'Hide',
    isShow: (status) => toolsConfig.showPublish && status !== 0,
    data: 0
  },
  {
    sortnum: 40,
    label: '删除',
    value: COMMON_ACTIONS.DELETE,
    type: 'danger',
    icon: 'Delete',
    isShow: () => toolsConfig.showDelete,
  }
].concat(props.actions)

// 数据
const operationRef = ref()
const popoverRef = ref()
const tableRef = ref()
const tooltipVisible = ref(false)
const showTable = ref(true)
const tableColumns = ref(
  props.columns.map((item, index) => ({ sortnum: index, show: true, ...item }))
)
const selections = ref([])
const selection = ref('')

const rowKey = tableConfig.rowKey || 'id'

const pagination = tableConfig.pagination
const pageSizes =
  tableConfig.pagination?.pageSizes || [1, 2, 3, 4, 5].map((v) => v * initData.pagination?.pageSize)

const shouldSingleSelectionColumnFixed = computed(() =>
  props.columns.some((item) => item.fixed === true || item.fixed === 'left')
)
const activeTableColumns = computed(() =>
  tableColumns.value.filter((v) => v.show).sort((a, b) => a.sortnum - b.sortnum)
)

const getBadgeType = (status) => getConstantLabel(BADGE_STATUS_LIST, status, 'info')
const effectiveActions = (status) => {
  return actions
    .slice()
    .map((v) => {
      if (v.value === COMMON_ACTIONS.PUBLISH) {
        v.label = tableConfig.actionPublishText
      } else if (v.value === COMMON_ACTIONS.UN_PUBLISH) {
        v.label = tableConfig.actionUnPublishText
      }
      return v
    })
    .filter((v) => v.isShow(status))
    .sort((a, b) => a.sortnum - b.sortnum)
}

// 右侧工具栏
const onToggleColumnShow = (row) => {
  row.show = !row.show
}

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const onSetRowClass = ({ row, rowIndex }) => {
  return row.show ? '' : 'cursor-not-allowed'
}

const onDragEnd = ({ newIndex, oldIndex }) => {
  // console.log('newIndex, oldIndex: ', newIndex, oldIndex);
  if (newIndex === oldIndex) return
  const oldTarget = tableColumns.value.find((v) => v.sort === oldIndex)
  const newTarget = tableColumns.value.find((v) => v.sort === newIndex)
  oldTarget.sort = newIndex
  newTarget.sort = oldIndex
  showTable.value = false
  nextTick(() => {
    showTable.value = true
  })
}

const onRowClick = (row) => {
  selection.value = row.id
}

const onSelectionChange = (value) => {
  selections.value = value.map((item) => item[rowKey])
}

const toggleSelect = () => {
  if (selections.value.length) {
    unref(tableRef).clearSelection()
  } else {
    unref(tableRef).toggleAllSelection()
  }
}

const onPageChange = (currentPage, pageSize) => {
  emit('page-change', { pageSize, currentPage })
}

function onBatchDelete() {
  useMessageBox('confirm', `即将删除${selections.value.length}条数据，是否继续？`, '', {
    iconType: 'warning',
    callback: (value, action) => {
      if (value === 'confirm') {
        emit('batch-delete', selections.value)
      }
    }
  })
}

const onAction = (item, index, data) => {
  if (tableConfig.useDialogDelete && item.value === COMMON_ACTIONS.DELETE) {
    useMessageBox('confirm', '即将删除当前数据，是否继续？', '', {
      iconType: 'warning',
      callback: (value, action) => {
        if (value === 'confirm') {
          emit('action', item, index, data)
        }
      }
    })
  } else {
    emit('action', item, index, data)
  }
}

const onExport = () => {
  emit('export')
}

const onImport = () => {
  emit('import')
}

onMounted(() => {
  if (tableConfig.selection === 'multiple' && initData?.selections?.length) {
    const rows = props.tableData.filter((item) => initData.selections.includes(item[rowKey]))
    rows.forEach((row) => {
      unref(tableRef).toggleRowSelection(row, true)
    })
  }
  if (tableConfig.selection === 'single' && initData?.selection) {
    const row = props.tableData.find((item) => item[rowKey] === initData.selection)
    onRowClick(row)
  }
})
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.badge-status {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 100%;
  background: var(--el-color-info);
  animation: dot-spread 1.5s infinite ease-out;

  &.is-success {
    background: var(--el-color-success);
  }

  &.is-danger {
    background: var(--el-color-danger);
  }

  &.is-primary {
    background: var(--el-color-primary);
  }

  &.is-warning {
    background: var(--el-color-warning);
  }
}

@keyframes dot-spread {
  0% {
    transform: scale(0);
    opacity: 1;
  }

  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 0.1;
  }
}
</style>
