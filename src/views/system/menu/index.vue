<template>
  <div>
    <el-button class="mb-3" icon="Plus" @click="onAdd()">新增</el-button>
    <el-table v-loading="loading" :data="menuList" :tree-props="treeProps" row-key="id" border default-expand-all
      style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sortnum" label="序号" width="120" />
      <el-table-column prop="title" label="菜单名称" width="140" />
      <el-table-column prop="name" label="路由名称" width="180" />
      <el-table-column prop="path" label="路由地址" width="200" />
      <el-table-column prop="type" label="菜单类型" width="90" :formatter="getMenuTypeText" />
      <!-- <el-table-column prop="createTime" label="创建时间" width="180" /> -->
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <div class="flex-[center]">
            <div class="relative w-16px mr-4px">
              <el-badge is-dot :type="getBadgeType(scope.row.status)" :offset="[-17, 8]">
                <div :class="['badge-status', `is-${getBadgeType(scope.row.status)}`]"></div>
              </el-badge>
            </div>
            {{ getStatusText(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="default" size="small" icon="Edit" @click="onEdit(scope.row.id)">编辑</el-button>
          <el-button type="success" size="small" icon="Plus" @click="onAdd(scope.row.id, 'sub')">新增子菜单</el-button>
          <el-button type="warning" size="small" icon="Plus"
            @click="onAdd(scope.row.parentId, 'relation')">新增关联菜单</el-button>
          <el-button type="danger" size="small" icon=Delete @click="onRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getMenuList, removeMenu } from '@/api/common/menu'
import { useMessage } from '@/hooks/use-message'
import { getConstantLabel } from '@/constants/util'
import { BADGE_STATUS_LIST, ACCOUNT_STATUS_LIST, MENU_TYPE_LIST } from '@/constants/common'
import { generateRouteTree } from '@/router/util'

const router = useRouter()
const { showMessage } = useMessage()

const loading = ref(false)
const menuList = ref([])
const treeProps = reactive({
  checkStrictly: false
})

const getStatusText = (status) => getConstantLabel(ACCOUNT_STATUS_LIST, status)
const getBadgeType = (status) => getConstantLabel(BADGE_STATUS_LIST, status, 'info')
const getMenuTypeText = (item) => getConstantLabel(MENU_TYPE_LIST, item.type)

const onEdit = (id) => {
  router.push({ path: '/system/menu/edit', query: { id } })
}
const onAdd = (id, type = 'default') => {
  router.push({ path: '/system/menu/add', query: { id, type } })
}
const onRemove = (id) => {
  removeMenu(id)
  loadList()
}

const loadList = async () => {
  try {
    loading.value = true
    const data = await getMenuList()
    menuList.value = generateRouteTree(data)
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadList()
})
</script>

<style lang="scss" scoped>
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