<template>
  <div class="test-page">
    <div>this is test page</div>
    <div class="mb-20px"><input type="file" @change="handleFileUpload" accept=".xlsx, .xls" /></div>
    <el-button @click="exportData">导出数据</el-button>
  </div>
</template>

<script setup>
import { readFile, read, utils, write, writeFileXLSX, writeFile } from 'xlsx'

const inheritKeys = ['!cols', '!rows', '!margins', '!merges', '!ref'];

let excelData = []
let sheetName = 'Sheet'
let worksheetConfig = {}
let worksheetOriginalData = {}
let workbookOriginalData = {}

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array', cellDates: true, cellFormula: true, cellStyles: true });
      console.log('workbook: ', workbook);
      workbookOriginalData = workbook
      const firstSheetName = workbook.SheetNames[1];
      sheetName = firstSheetName;
      console.log('firstSheetName: ', firstSheetName);
      const worksheet = workbook.Sheets[firstSheetName];
      console.log('worksheet: ', worksheet);
      worksheetOriginalData = worksheet;

      inheritKeys.forEach((key) => {
        worksheetConfig[key] = worksheet[key];
      })

      const jsonData1 = utils.sheet_to_json(worksheet, { header: 1 });
      console.log('====jsonData1: ', jsonData1);
      const jsonData = utils.sheet_to_json(worksheet);
      console.log('jsonData: ', jsonData);
      excelData = jsonData1;
    };
    reader.readAsArrayBuffer(selectedFile);
  }
};

const exportData = () => {
  // 排除前两个空行
  const jsonHeaderData = excelData.slice(2, 5)
  console.log('jsonHeaderData: ', jsonHeaderData);

  const employeeData = excelData.slice(5)
  console.log('employeeData: ', employeeData);
  const employees = [...new Set(employeeData.map((item) => item[1]))];
  console.log('employees: ', employees);
  employees.forEach((employee) => {
    const value = employeeData.filter((item) => item[1] === employee)
    console.log('employee value: ', employee, value);
    const salesData = [...jsonHeaderData, ...value]
    console.log('salesData: ', salesData);
    exportExcel(salesData, employee)
  })
}

const exportExcel = (data, fileName) => {
  const workbook = utils.book_new()
  // origin 写入数据的起始位置
  const worksheet = utils.aoa_to_sheet(data, { origin: 'A3' });

  utils.book_append_sheet(workbook, worksheet, sheetName)
  console.log('worksheet output: ', worksheet);

  inheritKeys.forEach((key) => {
    worksheet[key] = worksheetConfig[key];
  })

  Object.keys(worksheet).forEach((key) => {
    if (!inheritKeys.includes(key) && worksheetOriginalData[key]) {
      worksheet[key].s = worksheetOriginalData[key].s;
      worksheet[key].z = worksheetOriginalData[key].z;
      // worksheet[key].w = worksheetOriginalData[key].w;
      // worksheet[key].f = worksheetOriginalData[key].f;
    }
  })

  // TODO:  手动设置样式
  worksheet['A5'].s = {
    font: { name: '宋体', sz: 30, color: { rgb: 'FF0000' }, bold: true, italic: false, underline: false },
    alignment: { horizontal: 'center' }
  };

  if (!workbook.Props) workbook.Props = {};
  workbook.Props["Author"] = "zhangx";
  workbook.Props['Application'] = 'Microsoft Excel'

  // workbook.Directory = workbookOriginalData.Directory
  // workbook.Custprops = workbookOriginalData.Custprops
  // workbook.Props = workbookOriginalData.Props
  // workbook.Strings = workbookOriginalData.Strings
  // workbook.Styles = workbookOriginalData.Styles
  // workbook.Themes = workbookOriginalData.Themes
  // workbook.Workbook = workbookOriginalData.Workbook
  // workbook.bookType = "xlsx"

  console.log('workbook output: ', workbook);

  writeFileXLSX(workbook, `${fileName}.xlsx`, { cellStyles: true })
  // const binary = write(workbook, {
  //   type: 'binary',
  //   bookType: 'xlsx',
  // })

  // var blob = new Blob([s2ab(binary)], { type: "s2ab" });
  // saveAs(blob, `${fileName}.xlsx`);
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

</script>

<style lang="scss" scoped>
.test-page {
  height: 100vh;
  overflow-y: auto;
  background: #fff;
}
</style>
