import React, { useState, useEffect} from 'react';
import { Layout, Menu, Typography, Table, Button, Modal, Form, Input, Upload } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import useFetch from './util/useFetch';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const DashboardPage = ({ onLogout, visible }) => {
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

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    const newFarmer = {
      number: values.DA_referenceNumber,
      fullName: values.fullName,
      address: values.address,
      phone: values.phoneNumber,
      hectaresOwned: values.totalHectaresOwned,
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
      {number: '10-13-07-014-000076',last: 'ABONERO', first: 'CRESENTE', middle: 'GEREDOS', hectaresOwned: 3 },
      {number: '10-13-07-014-000165',last: 'ABONERO', first: 'JUANITO', middle: 'CUBIO', hectaresOwned: 1 },
      {number: '10-13-07-014-000159',last: 'ACURAM', first: 'MERCIDITA', middle: 'ABONERO', hectaresOwned: 1 },
      {number: '10-13-07-014-000160',last: 'ACURAM', first: 'ROMEL', middle: 'ABONERO',  hectaresOwned: 1 },
      {number: '10-13-07-014-000106',last: 'ADAMI', first: 'JERSON', middle: 'ESLITA',  hectaresOwned: 0.5 },
      {number: '10-13-07-014-000083',last: 'ALBINO', first: 'ROSARIO', middle: 'MERIEL',  hectaresOwned: 1 },
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

  const columns = [
    { title: 'Reference Number', render: (data) => (data?.DA_referenceNumber), key: 'referenceNumber' },
    { title: 'First Name', render: (data) => (data?.userInfo.firstname), key: 'username' },
    { title: 'Last Name', render: (data) => (data?.userInfo.lastname), key: 'lastname' },
    { title: 'Address', render: (data) => (data?.address), key: 'Address' },
    { title: 'Phone Number', render: (data) => (data?.phoneNumber), key: 'phoneNumber' },
    { title: 'Total Hectares Owned', render: (data) => (data?.totalHectaresOwned), key: 'totalHectaresOwned' },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleRemoveClick(record)}>Remove</Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider >
        <Title style={{ height: '32px', margin: '16px', color: 'white' }}>Agrimap</Title>
        <br />
        <h2 style={{ height: '32px', margin: '16px', color: 'white' }}>Dashboard</h2>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {showFarmersTable && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ marginRight: '16px' }}>List of Farmers</h3>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button style={{ marginRight: '8px' }} onClick={handleAddClick}>Add</Button>
                  </div>
                </div>
                <Table dataSource={data} columns={columns} />
              </>
            )}
            {showStats && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ marginRight: '16px' }}>Statistics Report</h3>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button style={{ marginRight: '8px' }}>Upload</Button>
                    <Button onClick={handlePrint}>Download</Button>
                  </div>
                </div>
                <Table id="statsTable"  dataSource={stats}>
                  <Table.Column title="Reference Number" dataIndex="number" key="number" />
                  <Table.Column title="Last Name" dataIndex="last" key="last" />
                  <Table.Column title="First Name" dataIndex="first" key="first" />
                  <Table.Column title="Middle Name" dataIndex="middle" key="middle" />
                  <Table.Column title="Total Hectares" dataIndex="hectaresOwned" key="hectaresOwned" />
                </Table>
              </>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Agrimap ©2023</Footer>
      </Layout>


      <Modal
        title="Add Farmer"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleModalSubmit}>
          <Form.Item label="Reference Number" name="DA_referenceNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
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
