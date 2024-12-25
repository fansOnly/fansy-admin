import Mock from 'mockjs'

const menus = [
  {
    path: '/index',
    name: 'Index',
    component: 'index',
    sortnum: 10,
    parentId: '',
    id: 'M20210923173316046410000000005',
    auth: 1,
    type: 'default',
    icon: 'house',
    title: '首页',
    affix: 1,
    visible: 1,
    cache: 1
  },
  {
    path: '/system',
    name: 'System',
    component: '',
    sortnum: 20,
    parentId: '',
    id: 'M20210924141757209200000000051',
    auth: 1,
    type: 'default',
    icon: 'setting',
    title: '系统管理',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/system/admin',
    name: 'SystemAdmin',
    component: 'system/admin',
    sortnum: 100,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100001',
    relationId: '',
    auth: 1,
    type: 'default',
    icon: '',
    title: '用户管理',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/system/admin/add',
    name: 'SystemAdminAdd',
    component: 'system/admin/detail',
    sortnum: 1000,
    parentId: 'M20210924141757209200000000051',
    id: 'M20210924141757209200000000051000012',
    relationId: 'M2021092414175720920000000005100001',
    auth: 1,
    type: 'default',
    icon: '',
    title: '新增用户',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/admin/edit',
    name: 'SystemAdminEdit',
    component: 'system/admin/detail',
    sortnum: 2000,
    parentId: 'M20210924141757209200000000051',
    id: 'M202109241417572092000000000510000123',
    relationId: 'M2021092414175720920000000005100001',
    auth: 1,
    type: 'default',
    icon: '',
    title: '编辑用户',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/role',
    name: 'SystemRole',
    component: 'system/role',
    sortnum: 200,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100002',
    auth: 1,
    type: 'default',
    icon: '',
    title: '角色管理',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/system/role/add',
    name: 'SystemRoleAdd',
    component: 'system/role/detail',
    sortnum: 1000,
    parentId: 'M20210924141757209200000000051',
    id: 'M20210924141757209200000000051000012222',
    relationId: 'M2021092414175720920000000005100002',
    auth: 1,
    type: 'default',
    icon: '',
    title: '新增角色',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/role/edit',
    name: 'SystemRoleEdit',
    component: 'system/role/detail',
    sortnum: 2000,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100001233333',
    relationId: 'M2021092414175720920000000005100002',
    auth: 1,
    type: 'default',
    icon: '',
    title: '编辑角色',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/menu',
    name: 'SystemMenu',
    component: 'system/menu',
    sortnum: 300,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100003',
    auth: 1,
    type: 'default',
    icon: '',
    title: '菜单管理',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/system/menu/add',
    name: 'SystemMenuAdd',
    component: 'system/menu/detail',
    sortnum: 1000,
    parentId: 'M20210924141757209200000000051',
    id: 'M20210924141757209200000000051000036675',
    relationId: 'M2021092414175720920000000005100003',
    auth: 1,
    type: 'default',
    icon: '',
    title: '新增菜单',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/menu/edit',
    name: 'SystemMenuEdit',
    component: 'system/menu/detail',
    sortnum: 2000,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100003121212',
    relationId: 'M2021092414175720920000000005100003',
    auth: 1,
    type: 'default',
    icon: '',
    title: '编辑菜单',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/dictionary',
    name: 'SystemDictionary',
    component: 'system/dictionary',
    sortnum: 400,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100004',
    auth: 1,
    type: 'default',
    icon: '',
    title: '字典管理',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/system/dictionary/add',
    name: 'SystemDictionaryAdd',
    component: 'system/dictionary/detail',
    sortnum: 1000,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100004001',
    relationId: 'M2021092414175720920000000005100004',
    auth: 1,
    type: 'default',
    icon: '',
    title: '新增字典',
    affix: 0,
    visible: 0,
    cache: 0
  },
  {
    path: '/system/dictionary/edit',
    name: 'SystemDictionaryEdit',
    component: 'system/dictionary/detail',
    sortnum: 2000,
    parentId: 'M20210924141757209200000000051',
    id: 'M2021092414175720920000000005100004002',
    relationId: 'M2021092414175720920000000005100004',
    auth: 1,
    type: 'default',
    icon: '',
    title: '编辑字典',
    affix: 0,
    visible: 0,
    cache: 0
  }
]

const initList = () => {
  let res = []
  for (let i = 0; i < menus.length; i++) {
    res.push(
      Mock.mock({
        ...menus[i],
        createTime: '@date(yyyy-MM-dd hh:mm:ss)',
        updateTime: '@date(yyyy-MM-dd hh:mm:ss)',
        status: 1
      })
    )
  }
  return res
}

const TABLE_LIST = initList()

export default [
  {
    url: '/api-mock/common/menu/list',
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { roleId } = config.query
      return {
        code: 10000,
        message: 'success',
        data: TABLE_LIST
      }
    }
  },
  {
    url: '/api-mock/common/menu/detail',
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { id } = config.query
      return {
        code: 10000,
        message: 'success',
        data: TABLE_LIST.find((v) => v.id === id)
      }
    }
  },
  {
    url: '/api-mock/common/menu/update',
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 10000,
        message: 'success',
        data
      }
    }
  },
  {
    url: '/api-mock/common/menu/add',
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 10000,
        message: 'success',
        data
      }
    }
  },
  {
    url: '/api-mock/common/menu/remove',
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 10000,
        message: 'success',
        data: {
          affected: 1
        }
      }
    }
  }
]

export const demoMenus = [
  {
    path: '/demo',
    name: 'Demo',
    component: '',
    sortnum: 15,
    parentId: '',
    id: 'M2021092317331604641000000018',
    auth: 1,
    type: 'default',
    icon: 'reading',
    title: '演示示例',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/icon',
    name: 'DemoIcon',
    component: 'demo/icons',
    sortnum: 100,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092317331604641000000018001',
    auth: 1,
    type: 'default',
    icon: 'element-plus',
    title: '图标示例',
    affix: 0,
    visible: 1,
    cache: 0
  },
  {
    path: '/demo/table',
    name: 'DemoTable',
    component: 'demo/table',
    sortnum: 200,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092317331604641000000018002',
    auth: 1,
    type: 'default',
    icon: 'tickets',
    title: '表格示例',
    affix: 0,
    visible: 1,
    cache: 0
  },
  {
    path: '/demo/echarts',
    name: 'DemoEcharts',
    component: 'demo/echarts',
    sortnum: 300,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092317331604641000000018003',
    auth: 1,
    type: 'default',
    icon: 'pie-chart',
    title: '图表示例',
    affix: 0,
    visible: 1,
    cache: 0
  },
  {
    path: '/demo/link',
    name: 'DemoLink',
    component: '',
    sortnum: 1000,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092317331604641000000018004',
    auth: 1,
    type: 'default',
    icon: 'link',
    title: '链接示例',
    affix: 0,
    visible: 1,
    cache: 0
  },
  {
    path: '/demo/link/external',
    name: 'DemoLinkExternal',
    component: '',
    sortnum: 1000,
    parentId: 'M2021092317331604641000000018004',
    id: 'M202109231733160464100000001800401',
    auth: 1,
    type: 'external-link',
    link: 'https://www.baidu.com',
    icon: '',
    title: '外链示例',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/link/iframe',
    name: 'DemoLinkIframe',
    component: '',
    sortnum: 2000,
    parentId: 'M2021092317331604641000000018004',
    id: 'M202109231733160464100000001800402',
    auth: 1,
    type: 'iframe',
    link: 'https://www.baidu.com',
    icon: '',
    title: 'iframe示例',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/richtext',
    name: 'DemoRichtext',
    component: 'demo/richtext',
    sortnum: 400,
    parentId: 'M2021092317331604641000000018',
    id: 'M202109231733160464100000001800402112',
    auth: 1,
    type: 'default',
    link: '',
    icon: 'EditPen',
    title: '富文本示例',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/excel',
    name: 'DemoExcel',
    component: 'demo/excel',
    sortnum: 500,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092317331604641000000018004021123323232323',
    auth: 1,
    type: 'default',
    link: '',
    icon: 'Document',
    title: 'EXCEL示例',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/file-preview',
    name: 'FilePreview',
    component: 'demo/file-preview',
    sortnum: 600,
    parentId: 'M2021092317331604641000000018',
    id: 'M20210923173316046410000000180040214545432323',
    auth: 1,
    type: 'default',
    link: '',
    icon: 'Reading',
    title: '文件预览',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/puzzle',
    name: 'Puzzle',
    component: 'demo/puzzle',
    sortnum: 700,
    parentId: 'M2021092317331604641000000018',
    id: 'M2021092314353454046410000000180040214545432323',
    auth: 1,
    type: 'default',
    link: '',
    icon: 'Cellphone',
    title: '拼图验证',
    affix: 0,
    visible: 1,
    cache: 1
  },
  {
    path: '/demo/image-recognition-text',
    name: 'ImageRecognitionText',
    component: 'demo/recognition/image-to-text',
    sortnum: 800,
    parentId: 'M2021092317331604641000000018',
    id: 'M20210923143534540180040214545432323',
    auth: 1,
    type: 'default',
    link: '',
    icon: 'Camera',
    title: '图片识别文字',
    affix: 0,
    visible: 1,
    cache: 1
  }
]
