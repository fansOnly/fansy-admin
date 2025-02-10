<template>
  <div class="test-page">
    <div>this is test page</div>
    <el-button @click="exportExcel3()">ExcelJS test</el-button>
    <div class="mb-20px"><input type="file" @change="handleFileUpload2" accept=".xlsx, .xls" /></div>
    <el-button @click="exportExcel2()">ExcelJS</el-button>
    <div class="mb-20px"><input type="file" @change="handleFileUpload" accept=".xlsx, .xls" /></div>
    <el-button @click="exportData">导出数据</el-button>
  </div>
</template>

<script setup>
import { readFile, read, utils, write, writeFileXLSX, writeFile } from 'xlsx'
import ExcelJS from 'exceljs';

async function exportExcel3(data, fileName = 'xxx') {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  data = [
    { name: '1', title: '11', value: '111' },
    { name: '2', title: '22', value: '222' },
    { name: '3', title: '33', value: '333' },
    { name: '4', title: '44', value: '444' },
    { name: '5', title: '55', value: '555' },
    { name: '6', title: '66', value: '666' },
  ]

  // 添加表头
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // 添加数据行
  data.forEach(item => {
    worksheet.addRow(Object.values(item));
  });

  console.log('worksheet.rowCount: ', worksheet.rowCount);

  console.log('worksheet: ', worksheet);

  // start = 2, count = 3
  for (let i = 2; i < 5; i++) {
    worksheet.spliceRows(2, 1)
  }

  // 导出文件
  await workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });
}

let excelJsData = []
let workbook = null
let worksheet = null
let employees = []
let bodyStart = 0

const handleFileUpload2 = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      excelJsData = data
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      console.log('workbook: ', workbook);
      const sheetName = '月度-客户经理助理'
      worksheet = workbook.getWorksheet(sheetName);
      console.log('worksheet: ', worksheet);

      // const allRows = worksheet.getRows(0, worksheet.rowCount - 1);
      // console.log('allRows: ', allRows);
      // const emptyRowCount = 2 // 空行数
      // const headerRowCount = 3 // 表头行数
      // const headers = worksheet.getRows(emptyRowCount, headerRowCount)
      // console.log('headers: ', headers);
      // bodyStart = emptyRowCount + headerRowCount + 1
      // const bodyRowCount = worksheet.rowCount - emptyRowCount - headerRowCount
      // console.log('bodyStart: ', bodyStart);
      // console.log('bodyEnd: ', bodyStart + bodyRowCount);
      // const body = worksheet.getRows(bodyStart, bodyRowCount).map(v => v.values)
      // console.log('body: ', body);

      // // 删除数据，保留表头
      // const total = worksheet.rowCount
      // console.log('worksheet.rowCount: ', total);
      // for (let i = bodyStart; i <= total; i++) {
      //   worksheet.spliceRows(bodyStart, 1);
      // }

      // // 获取员工数据
      // const employeeColumn = worksheet.getCell('B2')
      // console.log('employeeColumn: ', employeeColumn);
      // employees = [...new Set(employeeColumn._column.values.slice(6))]
      // console.log('employees: ', employees);
    };
    reader.readAsArrayBuffer(selectedFile);
  }
};

async function exportExcel2() {
  const emptyRowCount = 2 // 空行数
  const headerRowCount = 3 // 表头行数
  const headers = worksheet.getRows(emptyRowCount, headerRowCount)
  console.log('headers: ', headers);
  const bodyStart = emptyRowCount + headerRowCount + 1
  const bodyRowCount = worksheet.rowCount - emptyRowCount - headerRowCount
  console.log('bodyStart: ', bodyStart);
  console.log('bodyEnd: ', bodyStart + bodyRowCount);
  const bodyRows = worksheet.getRows(bodyStart, bodyRowCount).map(v => v.values)
  console.log('body: ', bodyRows);

  // 获取员工数据
  const employeeColumn = worksheet.getCell('B2')
  console.log('employeeColumn: ', employeeColumn);
  const employees = [...new Set(employeeColumn._column.values.slice(6))]
  console.log('employees: ', employees);

  const total = worksheet.rowCount
  console.log('worksheet.rowCount: ', total);

  employees.forEach(async (employee) => {
    console.log('excelJsData: ', excelJsData);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(excelJsData);
    const sheetName = '月度-客户经理助理'
    const ws = wb.getWorksheet(sheetName);

    console.log('employee: ', employee);
    let pos = bodyStart // 删除索引

    bodyRows.forEach((row, index) => {
      if (row[2] === employee) {
        pos++
      } else {
        console.log('pos: ', pos, row[2]);
        ws.spliceRows(pos, 1);
      }
    })
    exportExcel22(wb, employee)
  })
}

async function exportExcel22(wb, fileName = 'ExcelJS') {
  // 导出文件
  console.log('wb: ', fileName, wb);
  await wb.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });
}

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
