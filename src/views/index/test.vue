<template>
  <div class="test-page">
    <div>this is test page</div>
    <!-- <el-button @click="loadExcel">导入数据</el-button> -->
    <div class="mb-20px"><input type="file" @change="handleFileUpload" accept=".xlsx, .xls" /></div>
    <el-button @click="exportData">导出数据</el-button>
  </div>
</template>

<script setup>
import { readFile, read, utils, writeFileXLSX, writeFile } from 'xlsx'

const inheritKeys = ['!cols', '!rows', '!margins', '!merges', '!ref'];

let excelData = []
let sheetName = 'Sheet'
let worksheetConfig = {}
let worksheetOriginalData = {}

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array', cellDates: true, cellFormula: true, cellStyles: true });
      console.log('workbook: ', workbook);
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
      // const jsonData = utils.sheet_to_json(worksheet);
      // console.log('jsonData: ', jsonData);
      excelData = jsonData1;
    };
    reader.readAsArrayBuffer(selectedFile);
  }
};

const exportData = () => {
  const jsonHeaderData = excelData.slice(0, 3)
  console.log('jsonHeaderData: ', jsonHeaderData);

  const employeeData = excelData.slice(3)
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
  const worksheet = utils.aoa_to_sheet(data);

  utils.book_append_sheet(workbook, worksheet, sheetName)
  console.log('worksheet output: ', worksheet);

  inheritKeys.forEach((key) => {
    worksheet[key] = worksheetConfig[key];
  })

  Object.keys(worksheet).forEach((key) => {
    if (!inheritKeys.includes(key) && worksheetOriginalData[key]) {
      worksheet[key].s = worksheetOriginalData[key].s;
      worksheet[key].z = worksheetOriginalData[key].z;
    }
  })

  console.log('workbook output: ', workbook);

  writeFileXLSX(workbook, `${fileName}.xlsx`)
}
</script>

<style lang="scss" scoped>
.test-page {
  height: 100vh;
  overflow-y: auto;
  background: #fff;
}
</style>
