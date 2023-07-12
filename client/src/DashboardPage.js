import React, { useState, useEffect} from 'react';
import { Layout, Menu, Typography, Table, Button, Modal, Form, Input, Upload, Space, Card, Popconfirm } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import useFetch from './util/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

  const { data, loading, err } = useFetch('https://agri-map.onrender.com/farmers/view-all');
  console.log(data);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    onLogout();
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleRemoveClick = (record) => {
    const updatedFarmers = farmers.filter((farmer) => farmer.number !== record.number);
    setFarmers(updatedFarmers);
  };

  // const handleEditClick = (record) => {
  //   // Logic for handling the edit action
  //   const updatedFarmers = farmers.map((farmer) => {
  //     if (farmer.number === record.number) {
  //       // Perform the necessary edits to the farmer object
  //       // For example, you can update the farmer's name:
  //       const updatedFarmer = { ...farmer, name: 'Updated Name' };
  //       return updatedFarmer;
  //     }
  //     return farmer;
  //   });
  
  //   setFarmers(updatedFarmers);
  // };
  

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // bar graph for statistics/analytics
  const renderChart = () => {
    return (
      <BarChart width={1100} height={300} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="number" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="hectaresOwned" fill="#75AA3F" />
      </BarChart>
    );
  };

  const handleModalSubmit = (values) => {
    const newFarmer = {
      referenceNumber: values.referenceNumber,
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
    setStats([
      {number: '10-13-07-014-000076',firstName: 'Cresente', lastName: 'Abonero', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 3 },
      {number: '10-13-07-014-000165',firstName: 'Juanito', lastName:'Abonero', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 1 },
      {number: '10-13-07-014-000159',firstName: 'Mercidita', lastName: 'Acuram', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 1 },
      {number: '10-13-07-014-000160',firstName: 'Romel', lastName: 'Acuram', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 1 },
      {number: '10-13-07-014-000106',firstName: 'Jerson' ,lastName:'Adami', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 0.5 },
      {number: '10-13-07-014-000083',firstName: 'Rosario', lastName: 'Albino', address:"Malaybalay City, Philippines", phone:"09123456789",hectaresOwned: 1 },
    ]);
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

  // export to excel
  const handlePrint = () => {
    const printContent = document.getElementById('statsTable');

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(printContent);

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
    const dateString = currentDate.toLocaleDateString('en-US', options).replace('-');

    XLSX.utils.book_append_sheet(workbook, worksheet, `Statistics-Report-${dateString}`);

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statistics-Report-${dateString}.xlsx`;
    link.click();
  };

  // const columns = [
  //   { title: 'Reference Number', dataIndex: 'number', key: 'number' },
  //   { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  //   { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  //   { title: 'Address', dataIndex: 'address', key: 'address' },
  //   { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
  //   { title: 'Total Hectares Owned', dataIndex: 'hectaresOwned', key: 'hectaresOwned' },
  //   {
  //     title: 'Actions',
  //     dataIndex: 'actions',
  //     key: 'actions',
  //     render: (_, record) => (
  //       <Button type="primary" danger onClick={() => handleRemoveClick(record)}>Remove</Button>
  //     ),
  //   },
  // ];

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
      <Title level={2} style={{color:'white'}}>Agrimap</Title>
    </Space>
        <br />
        <br />
        <h2 style={{ height: '32px', margin: '16px', color: 'white' }}>Dashboard</h2>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
          <Menu.Item icon={<TeamOutlined />} onClick={handleFarmersClick}>
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
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {showFarmersTable && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={3} >List of Farmers</Title>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button style={{ marginRight: '8px' }} onClick={handleAddClick}>Add</Button>
                  </div>
                </div>
                {/* <Table dataSource={farmers} columns={columns} /> */}
                <Table dataSource={data} columns={columns} pagination={{
          total: meta?.total ? meta?.total : 0,
          pageSize: 5,
        }}/>
              </>
            )}
         {showStats && (
            <>
            <Card>
              <Title level={3} >Analytics</Title>
              {renderChart()}
              </Card>
              <br/>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={3} >Statistics Report</Title>
                <div style={{ marginLeft: 'auto' }}>
                  <Button style={{ marginRight: '8px' }} disabled>Upload</Button>
                  <Button type='primary' onClick={handlePrint}>Download</Button>
                </div>
              </div>
              <Table id="statsTable" dataSource={data} pagination={{
              total: meta?.total ? meta?.total : 0,
              pageSize: 5,}}>
                <Table.Column title="Reference Number" dataIndex="DA_referenceNumber" key="referenceNumber" />
                <Table.Column title="First Name" dataIndex="username" key="username" />
                <Table.Column title="Last Name" dataIndex="lastname" key="lastname" />
                <Table.Column title="Address" dataIndex="address" key="address" />
                <Table.Column title="Phone Number" dataIndex="phoneNumber" key="phoneNumber" />
                <Table.Column title="Total Hectares Owned" dataIndex="totalHectaresOwned" key="totalHectaresOwned"align='center' />
              </Table>
              </Card>
            </>
          )}
        </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Agrimap ©2023</Footer>
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
