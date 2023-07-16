import { useState, useEffect, useRef } from "react";
import { Layout, Menu, Typography, Table, Button, Modal, Form, Input, Upload, Space, Card, Popconfirm } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import useFetch from './util/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;

const DashboardPage = ({ onLogout, visible }) => {
  let [meta, setMeta] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showFarmersTable, setShowFarmersTable] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const fileInputRef = useRef(null);

  // data storage
  // const getExcelDataFromStorage = () => {
  //   const storedData = localStorage.getItem('excelData');
  //   if (storedData) {
  //     return JSON.parse(storedData);
  //   }
  //   return null;
  // };

  // const [excelData, setExcelData] = useState(getExcelDataFromStorage());
  // submit state
  // const [excelData, setExcelData] = useState(null);

  const { data, loading, err } = useFetch('https://agri-map.onrender.com/farmers/view-all');
  console.log(data);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    onLogout();
  };

  // Helper function to convert Excel date value to a readable format
  const formatDate = (excelDate) => {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toLocaleDateString();
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleRemoveClick = (record) => {
    const updatedFarmers = farmers.filter((farmer) => farmer.number !== record.number);
    setFarmers(updatedFarmers);
  };

  const removeFile = () => {
    setExcelFile(null);
    setTypeError(null);
    setExcelData([]);
    localStorage.removeItem("uploadedExcelData");
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // bar graph for statistics/analytics
  // const renderChart = () => {
  //   return (
  //     <BarChart width={1100} height={300} data={data}>
  //       <CartesianGrid strokeDasharray="3 3" />
  //       <XAxis dataKey="DA_referenceNumber" />
  //       <YAxis />
  //       <Tooltip />
  //       <Legend />
  //       <Bar dataKey="totalHectaresOwned" fill="#75AA3F" />
  //     </BarChart>
  //   );
  // };

  const handleModalSubmit = (values) => {
    const newFarmer = {
      referenceNumber: values.DA_referenceNumber,
      username: values.username,
      lastname: values.lastname,
      address: values.address,
      phoneNumber: values.phoneNumber,
      totalHectaresOwned: values.totalHectaresOwned,
    };
    setFarmers([...farmers, newFarmer]);
    setIsModalVisible(false);
    setShowFarmersTable(true);
  };

  const handleFarmersClick = () => {
    setShowFarmersTable(true);
    setShowStats(false);
  };

  const handleStatsClick = () => {
    setShowStats(true);
    setShowFarmersTable(false);
  };

  useEffect(() => {
    const savedFarmers = localStorage.getItem('farmers');
    if (savedFarmers) {
      setFarmers(JSON.parse(savedFarmers));
      setShowFarmersTable(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("uploadedExcelData"));
    if (storedData) {
      setExcelData(storedData);
    }
  }, []);


  // submit
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      // Convert date values to readable format
      const formattedData = data.map((row) => {
        const formattedRow = {};
        for (let key in row) {
          if (row.hasOwnProperty(key) && row[key] instanceof Date) {
            formattedRow[key] = formatDate(row[key]);
          } else {
            formattedRow[key] = row[key];
          }
        }
        return formattedRow;
      });

      setExcelData(formattedData.slice(0, 10));
      localStorage.setItem("uploadedExcelData", JSON.stringify(formattedData));
    }
  };

  // onchange event
  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    } else {
      console.log('Please select your file');
    }
  };

  // revise download file
  const handlePrint = () => {
    if (excelData) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
  
      const columnWidths = [
        { wch: 20 }, // Column A
        { wch: 20 }, // Column B
        { wch: 20 }, // Column C
        { wch: 20 }, // Column D
        { wch: 20 }, // Column E
      ];
      worksheet['!cols'] = columnWidths;
  
      const currentDate = new Date();
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const dateString = currentDate.toLocaleDateString('en-US', options).replace('-', '');
  
      XLSX.utils.book_append_sheet(workbook, worksheet, `Statistics-Report-${dateString}`);
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Statistics-Report-${dateString}.xlsx`;
      link.click();
    }
  };

  const columns = [
    { title: 'Reference Number', render: (data) => (data?.DA_referenceNumber), key: 'referenceNumber' },
    { title: 'First Name', render: (data) => (data?.userInfo.firstname), key: 'username' },
    { title: 'Last Name', render: (data) => (data?.userInfo.lastname), key: 'lastname' },
    { title: 'Address', render: (data) => (data?.address), key: 'Address' },
    { title: 'Phone Number', render: (data) => (data?.phoneNumber), key: 'phoneNumber' },
    { title: 'Total Hectares Owned', render: (data) => (data?.totalHectaresOwned), key: 'totalHectaresOwned', align: 'center',},
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <>
           <Popconfirm
            placement="topRight"
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() =>  handleRemoveClick(record)}
          >
            <Text type="danger" style={{ cursor: 'pointer' }}>
              Remove
            </Text>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
           <Sider style={{ position: 'fixed', height: '100vh' }}>
      <Space >
      <img src="logo-leaf.png" alt="Logo" style={{ height: 50, marginTop:10, marginLeft: 5 }} />
      <Title level={2} style={{color:'white', marginTop:'25px'}}>Agrimap</Title>
    </Space>
        <br />
        <br />
        <h2 style={{ height: '32px', margin: '16px', color: 'white' }}>Dashboard</h2>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
          <Menu.Item key='1' icon={<TeamOutlined />} onClick={handleFarmersClick}>
            Farmers
          </Menu.Item>
          <Menu.Item icon={<LineChartOutlined />} disabled>
            Mortgage Land
          </Menu.Item>
          <Menu.Item icon={<LineChartOutlined />} onClick={handleStatsClick}>
            Statistics Report
          </Menu.Item>
          <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

            {showFarmersTable && (
              <>
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={3} >List of Farmers</Title>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button type='primary' style={{ marginRight: '8px' }} onClick={handleAddClick}>Add</Button>
                  </div>
                </div>
                <Table dataSource={data} columns={columns} pagination={{
          total: meta?.total ? meta?.total : 0,
          pageSize: 5,
        }}/>
              </Card>
              </>
            )}
         {showStats && (
            <>
              <br/>
              <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={3} >Statistics Report</Title>
                <div style={{ marginLeft: 'auto' }}>
              {excelData && (
              <button className="btn btn-primary btn-sm" onClick={handlePrint}>Download</button>
            )}
                </div>
              </div>
        <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <Space >
          <input ref={fileInputRef}  type="file" className="form-control" required onChange={handleFile} />
          <Button type="primary" value='small' htmlType="submit">Upload</Button>
          <Button type='primary' value='small' danger onClick={removeFile}>Remove</Button>
          </Space>
          {typeError&&(
            <div className="alert alert-danger" role="alert">{typeError}</div>
          )}
        </form>
        <br/>
        <br/>
        {excelData && excelData.length > 0 ? (
            <table className="table">
             <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        ):(
          <div>No File is uploaded yet!</div>
        )}
          </Card>

            </>
          )}
        </div>
        <Footer style={{position: 'fixed', bottom: 0, marginLeft:'520px' }}>
  <      div>Agrimap ©2023</div>
        </Footer>
      </Layout>
    
      <Modal
        title="Add Farmer"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleModalSubmit}>
          <Form.Item label="Reference Number" name="referenceNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="First Name" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hectares Owned" name="totalHectaresOwned" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Proof Of Ownership" name="proofOfOwnership">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </Layout>
  );
};

export default DashboardPage;
