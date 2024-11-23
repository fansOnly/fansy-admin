import { read, utils, writeFileXLSX } from 'xlsx'

export const exportExcel = (data, fileName) => {
  /* generate worksheet from state */
  const worksheet = utils.json_to_sheet(data)
  /* create workbook and append worksheet */
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet')
  /* export to XLSX */
  writeFileXLSX(workbook, `${fileName}.xlsx`)
}

export const importExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    /* read XLSX file */
    reader.onload = (e) => {
      const _data = new Uint8Array(e.target?.result)
      // const f = await fetch('https://docs.sheetjs.com/pres.numbers')
      // const ab = await file.arrayBuffer()
      const workbook = read(_data, { type: 'array' })
      /* get first worksheet */
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      /* convert worksheet to JSON */
      const data = utils.sheet_to_json(worksheet, { header: 1 })
      console.log('data111: ', data)
      resolve(data)
    }
    // reader.error = () => {
    //   reject(new Error('Error reading file'))
    // }
    reader.readAsArrayBuffer(file)
    // return data
  })
}
