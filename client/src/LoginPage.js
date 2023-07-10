import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import usePost from './util/usePost'

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  // const {data} = usePost('http://localhost:5000/login')
  
  useEffect(()=>{
    if (localStorage.getItem('userName')) {
    }
  },[])

  const handleSubmit = (values) => {
    setLoading(true);

    

    setTimeout(() => {
      setLoading(false);
      // console.log('Login successful!', values);
      
      fetch('https://agri-map.onrender.com/login', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    }).then( res => res.json())
    .then(data => {
        localStorage.setItem('userName', data.username)
        localStorage.setItem('userRole', data.userRole)
        window.location.href = '/';
    })
    .catch((e) => {
      return(e)
    })

      // Redirect to the dashboard or perform other actions
    }, 2000);


  };

  const handleForgotPassword = () => {
    // Handle the "Forgot Password" action
    console.log('Forgot Password clicked!');
    // Perform actions such as showing a modal, navigating to the password recovery page, etc.
  };

  return (
    <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', }}>
      <Card style={{ borderRadius: 10, width: 400, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/path/to/logo.png" alt="Logo" style={{ height: 50 }} />
        </div>

        <Form
          name="loginForm"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <a href="#" onClick={handleForgotPassword}>
              Forgot password?
            </a>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
