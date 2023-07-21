
import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Typography, Table, Button, Modal, Form, Input, Upload, Space, Card, Popconfirm } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import useFetch from './util/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';

let environment = 'LOCAL';
let server;

environment === 'LOCAL' ? server = 'http://localhost:5001' : server = process.env.REACT_APP_SERVER;
console.log(server);


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;
const { Column } = Table;

const DashboardPage = ({ onLogout, visible }) => {
  const [meta, setMeta] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showFarmersTable, setShowFarmersTable] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const fileInputRef = useRef(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [users, setUsers] = useState([]); // Store the user data
  const [showUsersTable, setShowUsersTable] = useState(false); // Control the visibility of the users table
  const [showland, setShowland] = useState(false);


  const { data, loading, err } = useFetch(`${server}/farmers/view-all`);

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
    console.log(record._id);

    fetch(`${server}/farmers/delete-farmer/${record._id}`, {
      method: 'DELETE', 
    })
    .then( res => res.json())
    .then(data => {
      console.log(`deleted ${data}`);

    })
    .catch((e) => {
      return(e)
    })

    // const updatedFarmers = farmers.filter((farmer) => farmer.number !== record.number);
    // setFarmers(updatedFarmers);
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

  const handleModalSubmit = (values) => {
    const newFarmer = {
      DA_referenceNumber: values.DA_referenceNumber,
      userInfo: values.userId,
      address: values.address,
      phoneNumber: values.phoneNumber,
      totalHectaresOwned: values.totalHectaresOwned,
      proofOfOwnership: values.proofOfOwnership
    };

    console.log(newFarmer);

    fetch(`${server}/farmers/add-farmer`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newFarmer)
    }).then( res => res.json())
    .then(data => {
      console.log(data);

    })
    .catch((e) => {
      return(e)
    })

    setFarmers([...farmers, newFarmer]);
    setIsModalVisible(false);
    setShowFarmersTable(true);
  };

  const handleAddUser = (values) => {
    const newUser = {
      username: values.username,
      password: values.password,
      lastname: values.lastname,
      firstname: values.firstname,
    };

    fetch(`${server}/add-user`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newUser)
    }).then( res => res.json())
    .then(data => {
      console.log(`added ${data}`);

    })
    .catch((e) => {
      return(e)
    })

    setUsers([...users, newUser]);
    setIsAddUserModalVisible(false);
    setShowUsersTable(true);
  };

  const handleRemoveUser = (_id) => {
    console.log(_id);
    fetch(`${server}/delete-user/${_id}`, {
      method: 'DELETE', 
    })
    .then( res => res.json())
    .then(data => {
      console.log(`deleted ${data}`);

    })
    .catch((e) => {
      return(e)
    })
  };

  const handleStatsClick = () => {
    setShowStats(true);
    setShowFarmersTable(false);
    setShowUsersTable(false);
    setShowland(false);
  };
  const handleFarmersClick = () => {
    setShowFarmersTable(true);
    setShowStats(false);
    setShowUsersTable(false);
    setShowland(false);
  };

  const handleShowlandClick = () => {
    setShowland(true);
    setShowStats(false);
    setShowFarmersTable(false);
  };
  
  const handleUsersClick = async ()  => {

    const users = await fetch(`${server}/view-all`)
    const JsonUsers = await users.json()

    console.log(JsonUsers);
    setUsers(JsonUsers);

    setShowUsersTable(true);
    setShowStats(false);
    setShowFarmersTable(false);
  };
  
  // useEffect(() => {
  //   const savedFarmers = localStorage.getItem('farmers');
  //   if (savedFarmers) {
  //     setFarmers(JSON.parse(savedFarmers));
  //     setShowFarmersTable(true);

  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem('farmers', JSON.stringify(farmers));
  }, [farmers]);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
      // setShowUsersTable(true);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

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

  // revise
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
      { title: 'ID',  render: (data) => (data?._id), key: 'id', width: 150 },
      { title: 'Reference Number',  render: (data) => (data?.DA_referenceNumber), key: 'referenceNumber', width: 150 },
      { title: 'First Name', render: (data) => (data?.userInfo.firstname), key: 'username', width: 120 },
      { title: 'Last Name', render: (data) => (data?.userInfo.lastname), width: 120 },
      { title: 'Address', render: (data) => (data?.address), key: 'address', width: 250, align: 'center' },
      { title: 'Phone Number',render: (data) => (data?.phoneNumber), key: 'phoneNumber', width: 150 },
      {
        title: 'View Land',
        key: 'viewLand',
        align: 'center',
        render: (_, record) => (
          <Button >View Land</Button>
        ),
        width: 100,
      },
      { title: 'Total Hectares Owned', render: (data) => (data?.totalHectaresOwned), key: 'totalHectaresOwned', align: 'center', width: 150 },
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
              onConfirm={() => handleRemoveClick(record)}
            >
              <Text type="danger" style={{ cursor: 'pointer' }}>
                Remove
              </Text>
            </Popconfirm>
          </>
        ),
        width: 100,
      },
    ];

    const cols = [
      { title: 'Mortgaged',  key: 'mortgaged', width: 150 },
      { title: 'Contact Number', key: 'contactnumber', width: 120 },
      { title: 'Land Owner',  key: 'landowner',width: 120 },
      { title: 'Hectares',  key: 'hectares', width: 250, align: 'center' },
    ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ position: 'fixed', height: '100vh' }}>
        <Space>
          <img src="logo-leaf.png" alt="Logo" style={{ height: 50, marginTop: 10, marginLeft: 5 }} />
          <Title level={2} style={{ color: 'white', marginTop: '25px' }}>Agrimap</Title>
        </Space>
        <br />
        <br />
        <h2 style={{ height: '32px', margin: '16px', color: 'white' }}>Dashboard</h2>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
          <Menu.Item key='1' icon={<TeamOutlined />} onClick={handleFarmersClick}>
            Farmers
          </Menu.Item>
          <Menu.Item icon={<LineChartOutlined />}onClick={handleShowlandClick}>
            Mortgage Land
          </Menu.Item>
          <Menu.Item icon={<LineChartOutlined />} onClick={handleStatsClick}>
            Statistics Report
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />} onClick={handleUsersClick}>
            Users
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
                }} />
              </Card>
            </>
          )}
          {showland && (
            <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Title level={3} >Mortgage Land</Title>
                </div>
                <Table  columns={cols} pagination={{
                  total: meta?.total ? meta?.total : 0,
                  pageSize: 5,
                }} />
              </Card>
            </>
          )}
          {showStats && (
            <>
              <br />
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
                  <Space>
                    <input ref={fileInputRef} type="file" className="form-control" required onChange={handleFile} />
                    <Button type="primary" value='small' htmlType="submit">Upload</Button>
                    <Button type='primary' value='small' danger onClick={removeFile}>Remove</Button>
                  </Space>
                  {typeError && (
                    <div className="alert alert-danger" role="alert">{typeError}</div>
                  )}
                </form>
                <br />
                <br />
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
                ) : (
                  <div>No File is uploaded yet!</div>
                )}
              </Card>

            </>
          )}
          {showUsersTable && (
            <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Title level={3}>List of Users</Title>
                  <div style={{ marginLeft: 'auto' }}>
                    <Button type="primary" onClick={() => setIsAddUserModalVisible(true)}>Add</Button>
                  </div>
                </div>
                <Table dataSource={users} pagination={{
                  total: meta?.total ? meta?.total : 0,
                  pageSize: 5,
                }}>
                  
                  <Column title="ID" dataIndex="_id" key="_id" />
                  {/* <Column title="Username" dataIndex="username" key="username" /> */}
                  <Column title="Last Name" dataIndex="lastname" key="lastname" />
                  <Column title="First Name" dataIndex="firstname" key="firstname" />
                  <Column
                    title="Actions"
                    key="actions"
                    render={(text, user) => (
                      <>
                        <Popconfirm
                          placement="topRight"
                          title="Are you sure?"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => handleRemoveUser(user._id)}
                        >
                          <Text type="danger" style={{ cursor: 'pointer' }}>
                            Remove
                          </Text>
                        </Popconfirm>
                      </>
                    )}
                  />
                </Table>
              </Card>
            </>
          )}

        </div>

        <Footer style={{ position: 'fixed', bottom: 0, marginLeft: '520px' }}>
          <div>Agrimap ©2023</div>
        </Footer>
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
          
          <Form.Item label="User ID" name="userId" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Total Hectares Owned" name="totalHectaresOwned" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Proof Of Ownership (drive link)" name="proofOfOwnership" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item label="Proof Of Ownership" name="proofOfOwnership">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add User"
        visible={isAddUserModalVisible}
        onCancel={() => setIsAddUserModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddUser}>
          <Form.Item label="Username" name="username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="First Name" name="firstname">
            <Input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Last Name" name="lastname">
            <Input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
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
