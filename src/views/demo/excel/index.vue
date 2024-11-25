<template>
  <div>
    <el-button type="primary" @click="export2">导出Excel2</el-button>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="API" name="1">
        <el-button type="primary" @click="exportToExcel(tableList)">导出Excel</el-button>
        <el-table :data="tableList" rowKey="id" border style="width: 100%">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="序号" prop="sortnum" />
          <el-table-column label="标题" prop="name" />
          <el-table-column label="内容" prop="content" />
          <el-table-column label="省份" prop="province" />
          <el-table-column label="城市" prop="city" />
          <el-table-column label="邮编" prop="zip" />
          <el-table-column label="日期" prop="date" />
          <el-table-column label="状态" prop="status" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="EXCEL" name="2">
        <el-button type="primary" @click="exportToExcel(tableData)">导出Excel</el-button>
        <el-table :data="tableData" rowKey="Index" border style="width: 100%">
          <el-table-column label="序号" prop="Index" />
          <el-table-column label="名称" prop="Name" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { read, utils, writeFileXLSX } from 'xlsx'
import { getTableList } from '@/api/demo/table'
import { exportExcel, importExcel } from '@/utils/excel'

const tableList = ref([])
const tableData = ref([])
const activeName = ref('1')

const exportToExcel = (data) => {
  if (!data.length) return
  exportExcel(data, 'SheetJSVueAoO')
  // /* generate worksheet from state */
  // const worksheet = utils.json_to_sheet(data)
  // /* create workbook and append worksheet */
  // const workbook = utils.book_new()
  // utils.book_append_sheet(workbook, worksheet, 'Data')
  // /* export to XLSX */
  // writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
}

async function export2() {
  /* fetch JSON data and parse */
  const url = 'https://docs.sheetjs.com/executive.json'
  const raw_data = await (await fetch(url)).json()

  /* filter for the Presidents */
  const prez = raw_data.filter((row) => row.terms.some((term) => term.type === 'prez'))

  /* sort by first presidential term */
  prez.forEach((row) => (row.start = row.terms.find((term) => term.type === 'prez').start))
  prez.sort((l, r) => l.start.localeCompare(r.start))

  /* flatten objects */
  const rows = prez.map((row) => ({
    name: row.name.first + ' ' + row.name.last,
    birthday: row.bio.birthday
  }))
  console.log('rows: ', rows)

  /* generate worksheet and workbook */
  const worksheet = utils.json_to_sheet(rows)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Dates')

  /* fix headers */
  utils.sheet_add_aoa(worksheet, [['Name', 'Birthday']], { origin: 'A1' })

  /* calculate column width */
  const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10)
  worksheet['!cols'] = [{ wch: max_width }]

  /* create an XLSX file and try to save to Presidents.xlsx */
  writeFileXLSX(workbook, 'Presidents.xlsx', { compression: true })
}

const loadExcel = async () => {
  const f = await fetch('https://docs.sheetjs.com/pres.numbers')
  const ab = await f.arrayBuffer()
  // /* parse */
  const workbook = read(ab)
  // /* generate array of objects from first worksheet */
  const worksheet = workbook.Sheets[workbook.SheetNames[0]] // get the first worksheet
  const data = utils.sheet_to_json(worksheet) // generate objects
  /* update state */
  tableData.value = data
}

const loadTable = async () => {
  const data = await getTableList()
  tableList.value = data.list
}

onMounted(() => {
  loadTable()
  loadExcel()
})
</script>

<style lang="scss" scoped></style>