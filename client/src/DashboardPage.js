
import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Typography, Table, Button, Modal, Form, Input, Upload, Space, Card, Popconfirm } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, LogoutOutlined, BorderBottomOutlined, LineChartOutlined, UploadOutlined, BorderOuterOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import useFetch from './util/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { parseISO, format } from 'date-fns';

import * as proj from 'ol/proj';
import Mapa from "./util/map/Mapa";
import AllFarmsMap from "./util/map/AllFarmsMap";


let environment = '';
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
  const [isFarmlandModalVisible, setIsFarmlandModalVisible] = useState(false);

  
  const [isAddMortgageLandModalVisible, setIsAddMortgageLandModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const fileInputRef = useRef(null);

  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [showFarmersTable, setShowFarmersTable] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);


  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [userRole, setUserRole] = useState('');

  const [users, setUsers] = useState([]); // Store the user data
  const [showUsersTable, setShowUsersTable] = useState(false); // Control the visibility of the users table
  const [showland, setShowland] = useState(false);
  const [showFarmLands, setShowFarmLands] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const [coordinates, setCoordinates]  = useState([]);
  const [mortgageLand, setMortgageLand]  = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const [isFarmLandModal, setisFarmLandModal] = useState(false);
  const [farmLandCoordinates, setFarmLandCoordinates]  = useState([]);

  const [farmLands, setFarmLands]  = useState([]);
  const [landlord, setLandlord]  = useState('');


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

  const handleRemoveStatistics = (fileId) => {
    const updatedFiles = uploadedFiles.filter((file) => file.fileId !== fileId);
    setUploadedFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  };
  
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null && excelData !== null) {
      const fileId = Date.now(); // Generate a unique identifier for the file
      const newUploadedFile = {
        fileId: fileId, // Add the fileId to the uploaded file object
        filename: excelFile.name,
        data: excelData.slice(0, 10),
      };
  
      const updatedFiles = [...uploadedFiles, newUploadedFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    } else {
      // If no file selected or data is not formatted, display an error message
      setTypeError('Please select an excel file');
    }
  };
  
  const handleViewLandClick = (data) => {

    // fetch(`${server}/landCoordinates/view-land/64a301f7894a337f1101f9ef`, {
    //   method: 'GET', 
    // })
   
    // .then( res => res.json())
    // .then(data => {
    //   console.log(`get ${data}`);

    // })
    // .catch((e) => {
    //   return(e)
    // })

    setCoordinates(proj.fromLonLat([data.landCoordinates.yAxis, data.landCoordinates.xAxis]))
    setIsModal(true);
  };

  const handleViewFarmLandClick = (data) => {
    console.log(data);
    // setLandlord(data)
    setFarmLandCoordinates(proj.fromLonLat([data.yAxis, data.xAxis]))
    setisFarmLandModal(true);
  };

  const handleViewMortgageLandClick = (data) => {
    // setLandlord(data)
    setFarmLandCoordinates(proj.fromLonLat([data.coordinates[0].yAxis, data.coordinates[0].xAxis]))
    setisFarmLandModal(true);
  };

  const handleModalClose = () => {
    setIsModal(false);
  };

  

  const handleFarmLandModalClose = () => {
    setisFarmLandModal(false);
  };
  

  const formatExcelData = (data) => {
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
  
    return formattedData;
  };
  
  

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  
  

  const handleAddMortgageLand = () => {
    setIsAddMortgageLandModalVisible(true);
  };

  const handleAddFarmlandClick = () => {
    setIsFarmlandModalVisible(true);
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


  const handleRemoveMortgageLand = (record) => {
    console.log(record._id);

    fetch(`${server}/morgage/delete-mortgaged-land/${record._id}`, {
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

  
  const handleFarmCoordinatesRemove = (record) => {
    console.log(record._id);

    fetch(`${server}/landCoordinates/delete-land/${record._id}`, {
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
  const handleAddMortgageLandModalCancel = () => {
    setIsAddMortgageLandModalVisible(false);
  };

  

  const handleModalSubmit = (values) => {
    const newFarmer = {
      DA_referenceNumber: values.DA_referenceNumber,
      userInfo: values.userId,
      address: values.address,
      phoneNumber: values.phoneNumber,
      landCoordinates: values.landCoordinates,
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


  

  const handleAddMortgageLandModalSubmit = (values) => {
    const newMortgageLand = {
      mortgagedTo: values.mortgagedTo,
      phoneNumber: values.phoneNumber,
      hectares: values.hectares,
      location: values.location,
      coordinates: values.coordinates,
      landOwner: values.landOwner
    };

    console.log(newMortgageLand);

    fetch(`${server}/morgage/add-land`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(newMortgageLand)
    }).then( res => res.json())
    .then(data => {
      console.log(data);

    })
    .catch((e) => {
      return(e)
    })

    // setFarmers([...farmers, newMortgageLand]);
    setIsAddMortgageLandModalVisible(false);
    setShowland(true);
  };


  const handleFarmLandModalCancel = () => {
    setIsFarmlandModalVisible(false);
  };

  const handleFarmLandModalSubmit = (values) => {
    const newFarmer = {
      landOwner: values.landOwner,
      xAxis: values.xAxis,
      yAxis: values.yAxis
    };

    console.log(newFarmer);

    fetch(`${server}/landCoordinates/add-land`, {
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
    setIsFarmlandModalVisible(false);
    setShowFarmLands(true);
  };

  const handleAddUser = (values) => {
    const newUser = {
      username: values.username,
      password: values.password,
      lastname: values.lastname,
      firstname: values.firstname,
      userRole: values.userRole,

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
    setShowDashboard(false);
    setShowFarmersTable(false);
    setShowFarmLands(false)
    setShowStats(true);
    setShowUsersTable(false);
    setShowland(false);
  };
  const handleFarmersClick = () => {
    setShowDashboard(false);
    setShowFarmersTable(true);
    setShowFarmLands(false)
    setShowStats(false);
    setShowUsersTable(false);
    setShowland(false);
  };

  const handleShowlandClick = () => {

    fetch(`${server}/morgage/view-all`, {
      method: 'GET'
    }).then( res => res.json()) 
    .then(data => {
      console.log(data);
      setDataSource(data)

      console.log(dataSource);
    })
    .catch((e) => {
      return(e)
    })




    setShowDashboard(false);
    setShowFarmersTable(false);
    setShowFarmLands(false)
    setShowStats(false);
    setShowUsersTable(false);
    setShowland(true);
  };

  

  const handleFarmLandsClick = () => {
    fetch(`${server}/landCoordinates/view-lands`, {
      method: 'GET'
    }).then( res => res.json())
    .then(data => {
      console.log(data);
      setFarmLands(data);


    })
    .catch((e) => {
      return(e)
    })

    // const JsonUsers = await users.json()

    // console.log(JsonUsers);
    setShowDashboard(false);
    setShowFarmersTable(false);
    setShowFarmLands(true)
    setShowStats(false);
    setShowUsersTable(false);
    setShowland(false);
  };
  
  const handleUsersClick = async ()  => {

    const users = await fetch(`${server}/view-all`)
    const JsonUsers = await users.json()

    console.log(JsonUsers);
    setUsers(JsonUsers);
    setShowDashboard(false);
    setShowFarmersTable(false);
    setShowFarmLands(false)
    setShowStats(false);
    setShowUsersTable(true);
    setShowland(false);
  };

  useEffect(() => {

    localStorage.getItem('userRole') === 'ADMIN' ?  setIsAdmin(true) :  setIsAdmin(false)
    
  }, []);
  
  useEffect(() => {
    const savedFarmers = localStorage.getItem('farmers');
    if (savedFarmers) {
      setFarmers(JSON.parse(savedFarmers));
      // setShowFarmersTable(true);

    }
  }, []);

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

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles'));
    if (storedFiles) {
      setUploadedFiles(storedFiles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);


  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result, { type: 'buffer' });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          setExcelFile(selectedFile);
  
          // Format the data and set it in a separate state
          const formattedData = formatExcelData(data);
          setExcelData(formattedData);
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
  const handlePrint = (fileId) => {
    const selectedFile = uploadedFiles.find((file) => file.fileId === fileId);
    if (selectedFile) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(selectedFile.data);
  
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
      const dateString = currentDate.toLocaleDateString('en-US', options).replace(/[/]/g, '');
  
      XLSX.utils.book_append_sheet(workbook, worksheet, `Statistics-Report-${dateString}`);
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
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
      
      { title: 'Total Hectares Owned', render: (data) => (data?.totalHectaresOwned), key: 'totalHectaresOwned', align: 'center', width: 150 },
      {
        title: '',
        key: 'viewLand',
        align: 'center',
        render: (data) => (
          <Button type="primary" onClick={() => handleViewLandClick(data)}>View Land</Button>
        ),
        width: 100,
      },
      { 
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
          <>
            {isAdmin && <Popconfirm
              placement="topRight"
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRemoveClick(record)}
            >
              <Text type="danger" style={{ cursor: 'pointer' }}>
                Remove
              </Text>
            </Popconfirm>}
          </>
        ),
        width: 100,
      },
    ];
    
    const farmLandColumns = [
      { title: 'ID',  render: (data) => (data?._id), key: 'id', width: 150 },
      { title: 'User',  render: (data) => (data?.landOwner.lastname), key: 'landOwner', width: 150 },
      { title: 'Latitude',  render: (data) => (data?.xAxis), key: 'referenceNumber', width: 150 },
      { title: 'Longitude', render: (data) => (data?.yAxis), key: 'username', width: 120 },
      {
        title: '',
        key: 'viewLand',
        align: 'center',
        render: (data) => (
          <Button type="primary" onClick={() => handleViewFarmLandClick(data)}>View Land</Button>
        ),
        width: 100,
      },
      {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
          <>
            { isAdmin && <Popconfirm
              placement="topRight"
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleFarmCoordinatesRemove(record)}
            >
              <Text type="danger" style={{ cursor: 'pointer' }}>
                Remove
              </Text>
            </Popconfirm>}
          </>
        ),
        width: 100,
      },
    ];

    const cols = [

      { title: 'ID',  render: (data) => (data?._id), key: 'id', width: 150 },
      { title: 'Mortgaged To',  render: (data) => (data?.mortgagedTo), key: 'mortgagedTo', width: 150 },
      { title: 'Location/Address',  render: (data) => (data?.location), key: 'location', width: 150 },
      { title: 'Contact Numbe', render: (data) => (data?.phoneNumber), key: 'phoneNumber', width: 120 },
      { title: 'Land Owner', render: (data) => (data?.landOwner.firstname), key: 'landOwner', width: 120 },
      { title: 'Hectares', render: (data) => (data?.hectares), key: 'hectares', width: 120 },

      {
        title: '',
        key: 'viewLand',
        align: 'center',
        render: (data) => (
          <Button type="primary" onClick={() => handleViewMortgageLandClick(data)}>View Land</Button>
        ),
        width: 100,
      },
      {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
          <>
            <Popconfirm
              placement="topRight"
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRemoveMortgageLand(record)}
            >
              {isAdmin && <Text type="danger" style={{ cursor: 'pointer' }}>
                Remove
              </Text>}
            </Popconfirm>
          </>
        ),
        width: 100,
      },
    ]; 
    // const [locations, setLocations] = useState([]);

    // useEffect(() => {
    //   fetch(`${server}/landCoordinates/view-lands`, {
    //     method: 'GET'
    //   }).then( res => res.json())
    //   .then(data => {
    //     console.log(data);
    //     setLocations(data);
  
  
    //   })
    //   .catch((e) => {
    //     return(e)
    //   })

      
    // }, []);

    const locations = [
      { lat: 7.725380, lon:124.752999 },
      { lat: 7.775680, lon:124.755799 },
      { lat: 7.775280, lon:124.752399 },
      { lat: 7.775290, lon:124.785399 },
      { lat: 7.774280, lon:124.712399 },
      { lat: 7.864280, lon:124.65512 },

      // Add more locations as needed
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
        <a href="/"><h2 style={{ height: '32px', margin: '16px', color: 'white', textDecoration: 'none'}}>Dashboard</h2></a>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
          <Menu.Item icon={<TeamOutlined />} onClick={handleFarmersClick}>
            Farmers
          </Menu.Item>  
          <Menu.Item icon={<BorderOuterOutlined />}onClick={handleShowlandClick}>
            Mortgage Land
          </Menu.Item>
          <Menu.Item icon={<LineChartOutlined />} onClick={handleStatsClick}>
            Statistics Report
          </Menu.Item>
          <Menu.Item icon={<BorderOuterOutlined />} onClick={handleFarmLandsClick}>
            Farm Coordinates
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
        {showDashboard && (
            <>
              <Card style={{ height: '90dvh' }}>
            { locations && <AllFarmsMap locations={locations} />}
              </Card>
            </>
          )}

          {showFarmersTable &&  (
            <>
              <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={3} >List of Farmers</Title>
                
                <div style={{ marginLeft: 'auto' }}>
                  {isAdmin && <Button type='primary' style={{ marginRight: '8px' }} onClick={handleAddClick}>Add farmer</Button>}
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
                  {isAdmin && <div style={{ marginLeft: 'auto' }}>
                    <Button type='primary' style={{ marginRight: '8px' }} onClick={handleAddMortgageLand}>Add Mortgage Land</Button>
                  </div>}
                </div>
                <Table  dataSource={dataSource}  columns={cols} pagination={{
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
                </div>
                <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                  {isAdmin && <Space>
                    <input ref={fileInputRef} type="file" className="form-control" required onChange={handleFile} />
                    <Button type="primary" value='small' htmlType="submit">Upload</Button>
                    {/* <Button type='primary' value='small' danger onClick={removeFile}>Remove</Button> */}
                  </Space>}
                  {typeError && (
                    <div className="alert alert-danger" role="alert">{typeError}</div>
                  )}
                </form>
                <br />
                <br />
                {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => {
                   // Remove the .xlsx extension from the filename
                const filenameWithoutExtension = file.filename.replace(".xlsx", "");
                return (
                  <div key={index}>
                    <Space>
                    <h3>{filenameWithoutExtension}</h3>
                    <Popconfirm
                    title="Are you sure you want to remove this file?"
                    onConfirm={() => handleRemoveStatistics(file.fileId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger>
                      Remove
                    </Button>
                  </Popconfirm>
                  <Button type="primary" onClick={() => handlePrint(file.fileId)}>Download</Button>
                  </Space>
                    <table className="table">
                      <thead>
                        <tr>
                          {Object.keys(file.data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.data.map((individualExcelData, index) => (
                          <tr key={index}>
                            {Object.keys(individualExcelData).map((key) => (
                              <td key={key}>{individualExcelData[key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  </div>
                 );
                })
              ) : (
                <div>No files uploaded yet!</div>
              )}

              </Card>
            </>
          )}

          {showFarmLands && (
            <>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={3} >Farm Coordinates</Title>
                {isAdmin && <div style={{ marginLeft: 'auto' }}>
                  <Button type='primary' style={{ marginRight: '8px' }} onClick={handleAddFarmlandClick}>Add Farmland</Button>
                </div>}
              </div>
              <Table dataSource={farmLands} columns={farmLandColumns} pagination={{
                total: meta?.total ? meta?.total : 0,
                pageSize: 5,
              }} />
            </Card>
          </>
          )}
          {showUsersTable && (
            <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Title level={3}>List of Users</Title>
                  { isAdmin && <div style={{ marginLeft: 'auto' }}>
                    <Button type="primary" onClick={() => setIsAddUserModalVisible(true)}>Add</Button>
                  </div>}
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
                    title=""
                    key="actions"
                    render={(text, user) => (
                      <>
                      { isAdmin && <Popconfirm
                          placement="topRight"
                          title="Are you sure?"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => handleRemoveUser(user._id)}
                        >
                          <Text type="danger" style={{ cursor: 'pointer' }}>
                            Remove
                          </Text>
                        </Popconfirm>}
                      </>
                    )}
                  />
                </Table>
              </Card>
            </>
          )}

        </div>

      </Layout>

      <Modal
        title="Add Farmer"
        open={isModalVisible}
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
          <Form.Item label="Farm Coordinates ID" name="landCoordinates" rules={[{ required: true }]}>
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
               Add farmer
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Add Mortgage Land"
        open={isAddMortgageLandModalVisible}
        onCancel={handleAddMortgageLandModalCancel}
        footer={null}
      >
        <Form onFinish={handleAddMortgageLandModalSubmit}>
          <Form.Item label="Mortgaged to" name="mortgagedTo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Location/address" name="location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Coordinates ID" name="coordinates" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Land Owner" name="landOwner" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Total Hectares" name="hectares" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          
          {/* <Form.Item label="Proof Of Ownership" name="proofOfOwnership">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
               Add Mortgaged Land
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Farm Land"
        open={isFarmlandModalVisible}
        onCancel={handleFarmLandModalCancel}
        footer={null}
      >
        

        <Form onFinish={handleFarmLandModalSubmit}>
          
          
          <Form.Item label="Land Lords User ID" name="landOwner" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Latitude" name="xAxis" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Longitude" name="yAxis" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
               Add Farmland
            </Button>
          </Form.Item>
        </Form>
      </Modal>



      <Modal
        title="Add User"
        open={isAddUserModalVisible}
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

          <Form.Item label="User Role [ADMIN/FARMER]" name="userRole">
            <Input
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>  
      
    
      {/* for view land */}
      <Modal title="Land Details"  onCancel={handleModalClose} open={isModal}  width={800} bodyStyle={{height: 400}} footer={null} >
        <Mapa coordinates={coordinates} />
      </Modal>

      <Modal title="Land Details"  onCancel={handleFarmLandModalClose} open={isFarmLandModal}  width={800} bodyStyle={{height: 400}} footer={null} >
        <p>{landlord}</p>
        <Mapa coordinates={farmLandCoordinates} />
      </Modal>
    </Layout>
  );
};

export default DashboardPage;
