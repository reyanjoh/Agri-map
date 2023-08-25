import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Modal } from 'antd';

const RegistrationForm = ({ onCancel }) => {
  const [form] = Form.useForm();

 
  const numberValidator = (_, value) => {
    if (value && !/^\d+$/.test(value)) {
      return Promise.reject('Please enter only numbers.');
    }
    return Promise.resolve();
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Save the form data to local storage
    localStorage.setItem('registrationFormData', JSON.stringify(values));
  };

  return (
    <Form form={form} name="registration-form" onFinish={onFinish}>
        <br/>
      <h5>Registered Owner</h5>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input your last name!' }]} style={{ flex: 1 }}>
          <Input />
        </Form.Item>

        <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input your first name!' }]} style={{ flex: 1 }}>
          <Input />
        </Form.Item>

        <Form.Item name="middleName" label="Middle Name" style={{ flex: 1 }}>
          <Input />
        </Form.Item>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
      <Form.Item name="titleNo" label="Title No" rules={[{ required: true, message: 'Please input the title number!' }, { validator: numberValidator }]}>
        <Input width={300} />
      </Form.Item>

      <Form.Item name="lotPlanNo" label="Lot Plan No" rules={[{ required: true, message: 'Please input the lot plan number!' }, { validator: numberValidator }]}>
        <Input />
      </Form.Item>

      <Form.Item name="trackbackTCT" label="Trackback TCT" rules={[{ required: true, message: 'Please input the trackback TCT!' }, { validator: numberValidator }]}>
        <Input />
      </Form.Item>
      </div>


      <h5>TCT Registration Details</h5>

      <Form.Item name="registrationDate" label="Registration Date" rules={[{ required: true, message: 'Please select the registration date!' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <div style={{ display: 'flex', gap: '10px' }}>
      <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please input the address!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please input the city!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="municipality" label="Municipality" rules={[{ required: true, message: 'Please input the municipality!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="barangay" label="Barangay" rules={[{ required: true, message: 'Please input the barangay!' }]}>
        <Input />
      </Form.Item>
      </div>

      <h5>Property Location</h5>
      <div style={{ display: 'flex', gap: '10px' }}>
      <Form.Item name="cityProvince" label="City/Province" rules={[{ required: true, message: 'Please input the city/province!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="propertyMunicipality" label="Municipality" rules={[{ required: true, message: 'Please input the municipality!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="propertyBarangay" label="Barangay" rules={[{ required: true, message: 'Please input the barangay!' }]}>
        <Input />
      </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};
export default RegistrationForm;