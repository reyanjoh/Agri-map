import React, { useState } from 'react';
import { Layout, Menu, Typography, Table, Button, Breadcrumb } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const DashboardPage = ({ onLogout }) => {
  const [showTable, setShowTable] = useState(false); 
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(false); 

  const handleLogout = () => {
    onLogout();
  };

  const handleFarmersClick = () => {
    setShowTable(true);
    setShowStats(false);
    setFarmers([
      {number: '10-13-07-014-000076',last: 'ABONERO', first: 'CRESENTE', middle: 'GEREDOS', phone: '1234567890', hectaresOwned: 3 },
      {number: '10-13-07-014-000165',last: 'ABONERO', first: 'JUANITO', middle: 'CUBIO', phone: '1234567890', hectaresOwned: 1 },
      {number: '10-13-07-014-000159',last: 'ACURAM', first: 'MERCIDITA', middle: 'ABONERO', phone: '1234567890', hectaresOwned: 1 },
      {number: '10-13-07-014-000160',last: 'ACURAM', first: 'ROMEL', middle: 'ABONERO', phone: '1234567890', hectaresOwned: 1 },
      {number: '10-13-07-014-000106',last: 'ADAMI', first: 'JERSON', middle: 'ESLITA', phone: '1234567890', hectaresOwned: 0.5 },
      {number: '10-13-07-014-000083',last: 'ALBINO', first: 'ROSARIO', middle: 'MERIEL', phone: '1234567890', hectaresOwned: 1 },
    ]);
  };

  const handleStatsClick = () => {
    setShowStats(true);
    setShowTable(false);
    setStats([
      {number: '10-13-07-014-000076',last: 'ABONERO', first: 'CRESENTE', middle: 'GEREDOS', hectaresOwned: 3 },
      {number: '10-13-07-014-000165',last: 'ABONERO', first: 'JUANITO', middle: 'CUBIO', hectaresOwned: 1 },
      {number: '10-13-07-014-000159',last: 'ACURAM', first: 'MERCIDITA', middle: 'ABONERO', hectaresOwned: 1 },
      {number: '10-13-07-014-000160',last: 'ACURAM', first: 'ROMEL', middle: 'ABONERO',  hectaresOwned: 1 },
      {number: '10-13-07-014-000106',last: 'ADAMI', first: 'JERSON', middle: 'ESLITA',  hectaresOwned: 0.5 },
      {number: '10-13-07-014-000083',last: 'ALBINO', first: 'ROSARIO', middle: 'MERIEL',  hectaresOwned: 1 },
    ]);
  };

  // const handlePrint = () => {
  //   window.print();
  // };

  // print as a word file
  // const handlePrint = () => {
  //   const printContent = document.getElementById('statsTable');
  //   const printWindow = window.open('', '', 'width=800,height=600');
  //   printWindow.document.write('<html><head><title>Statistics Report</title>');
  //   printWindow.document.write('<style>');
  //   printWindow.document.write('table { border-collapse: collapse; width: 100%; }');
  //   printWindow.document.write('th, td { border: 1px solid black; padding: 8px; }');
  //   printWindow.document.write('</style>');
  //   printWindow.document.write('</head><body>');
  //   printWindow.document.write(printContent.innerHTML);
  //   printWindow.document.write('</body></html>');
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  // print as a excel file
  const handlePrint = () => {
    const printContent = document.getElementById('statsTable');
  
    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(printContent);
  
    // Adjust the width of columns B to E (B1 to E1)
    const columnWidths = [
      { wch: 20 }, // Column A
      { wch: 20 }, // Column B
      { wch: 20 }, // Column C
      { wch: 20 }, // Column D
      { wch: 20 }, // Column E
    ];
    worksheet['!cols'] = columnWidths;
  
    // Get the current date
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const dateString = currentDate.toLocaleDateString('en-US', options).replace('-');
  
    // Add the worksheet to the workbook with the date in the sheet name
    XLSX.utils.book_append_sheet(workbook, worksheet, `Statistics-Report-${dateString}`); 
  
    // Convert the workbook to an Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statistics-Report-${dateString}.xlsx`;
    link.click();
  
  };
  
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
          <Menu.Item icon={<LineChartOutlined />} >
          Mortgage Land
          </Menu.Item>
          <Menu.Item  icon={<LineChartOutlined />} onClick={handleStatsClick}>
            Statistics Report
          </Menu.Item>
          <Menu.Item  icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {showTable && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ marginRight: '16px' }}>List of Farmers</h3>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button style={{ marginRight: '8px' }}>Add</Button>
                    <Button>Remove</Button>
                  </div>
                </div>
                <Table dataSource={farmers}>
                  <Table.Column title="Reference Number" dataIndex="number" key="number" />
                  <Table.Column title="Last Name" dataIndex="last" key="last" />
                  <Table.Column title="First Name" dataIndex="first" key="first" />
                  <Table.Column title="Middle Name" dataIndex="middle" key="middle" />
                  <Table.Column title="Phone Number" dataIndex="phone" key="phone" />
                  <Table.Column title="Total Hectares" dataIndex="hectaresOwned" key="hectaresOwned" />
                </Table>
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
    </Layout>
  );
};

export default DashboardPage;
