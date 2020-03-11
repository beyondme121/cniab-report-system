import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Card, Table, Button } from 'antd'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { CSVLink, CSVDownload } from "react-csv";
import ReactExport from 'react-data-export';
import { reqUserList } from '../api'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const multiDataSet = [
  {
    columns: [
      { title: "Headings", width: { wpx: 80 } },//pixels width 
      { title: "Text Style", width: { wch: 40 } },//char width 
      { title: "Colors", width: { wpx: 90 } },
    ],
    data: [
      [
        { value: "H1", style: { font: { sz: "24", bold: true } } },
        { value: "Bold", style: { font: { bold: true } } },
        { value: "Red", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
      ],
      [
        { value: "H2", style: { font: { sz: "18", bold: true } } },
        { value: "underline", style: { font: { underline: true } } },
        { value: "Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FF0000FF" } } } },
      ],
      [
        { value: "H3", style: { font: { sz: "14", bold: true } } },
        { value: "italic", style: { font: { italic: true } } },
        { value: "Green", style: { fill: { patternType: "solid", fgColor: { rgb: "FF00FF00" } } } },
      ],
      [
        { value: "H4", style: { font: { sz: "12", bold: true } } },
        { value: "strike", style: { font: { strike: true } } },
        { value: "Orange", style: { fill: { patternType: "solid", fgColor: { rgb: "FFF86B00" } } } },
      ],
      [
        { value: "H5", style: { font: { sz: "10.5", bold: true } } },
        { value: "outline", style: { font: { outline: true } } },
        { value: "Yellow", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFFFF00" } } } },
      ],
      [
        { value: "H6", style: { font: { sz: "7.5", bold: true } } },
        { value: "shadow", style: { font: { shadow: true } } },
        { value: "Light Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } }
      ]
    ]
  }
];

const file_saver_data = [
  { name: "sanfeng", id: 1, type: 'customer' },
  { name: "sanfeng", id: 1, type: 'customer' },
  { name: "sanfeng", id: 1, type: 'customer' },
  { name: "sanfeng", id: 1, type: 'customer' }
]

function TestExportExcel() {
  const [userList, setUserList] = useState([])
  const refTable = useRef()
  const getUserList = async () => {
    const result = await reqUserList()
    if (result.status === 0) {
      setUserList(result.data)
    }
  }
  // 加载数据
  useEffect(() => {
    getUserList()
    const tableCon = ReactDOM.findDOMNode(refTable.current)
    const table = tableCon.querySelectorAll('table')
    table[1].setAttribute('id', 'table-to-xls2')
  }, [])


  const columns = [
    {
      title: '用户名',
      dataIndex: 'user_name'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    }
  ]
  const title = (
    <>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls2"
        filename="data"
        sheet="dataxls"
        buttonText="Download as XLS"
      />
      <CSVLink data={userList}>下载</CSVLink>
      <ExcelFile element={<button>Download Data With Styles</button>}>
        <ExcelSheet dataSet={multiDataSet} name="Organization" />
      </ExcelFile>
      <Button type="primary" onClick={() => { }}></Button>
    </>
  )
  return (
    <Card
      hoverable={true} bodyStyle={{ height: 300 }}
      title={title}
    >
      <Table
        bordered
        columns={columns}
        dataSource={userList}
        rowKey="user_id"
        scroll={{ y: 400 }}
        size={'small'}
        ref={refTable}
      />
    </Card>

  )
}

export default TestExportExcel