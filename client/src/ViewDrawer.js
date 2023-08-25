// ViewDrawer.js
import React from 'react';
import { Drawer, Button, Form, Input, DatePicker } from 'antd';

const ViewDrawer = ({ visible, onClose, formData }) => {
  return (
    <Drawer
      title="View Details"
      visible={visible}
      onClose={onClose}
      width={400}
    >
      <Form layout="vertical">
        <h5>Registered Owner</h5>
        <div style={{ marginBottom: '20px' }}>
          <Form.Item label="Last Name">
            <Input value={formData.lastName} readOnly  />
          </Form.Item>
          <Form.Item label="First Name">
            <Input value={formData.firstName} readOnly  />
          </Form.Item>
          <Form.Item label="Middle Name">
            <Input value={formData.middleName} readOnly />
          </Form.Item>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Form.Item label="Title No">
            <Input value={formData.titleNo} readOnly />
          </Form.Item>
          <Form.Item label="Lot Plan No">
            <Input value={formData.lotPlanNo} readOnly  />
          </Form.Item>
          <Form.Item label="Trackback TCT">
            <Input value={formData.trackbackTCT} readOnly  />
          </Form.Item>
        </div>

        <h5>TCT Registration Details</h5>
        <div style={{ marginBottom: '20px' }}>
          <Form.Item label="Registration Date">
            <DatePicker style={{ width: '100%' }} value={formData.registrationDate} readOnly />
          </Form.Item>
          <Form.Item label="Address">
            <Input value={formData.address} readOnly />
          </Form.Item>
          <Form.Item label="City">
            <Input value={formData.city} readOnly />
          </Form.Item>
          <Form.Item label="Municipality">
            <Input value={formData.municipality} readOnly />
          </Form.Item>
          <Form.Item label="Barangay">
            <Input value={formData.barangay} readOnly  />
          </Form.Item>
        </div>

        <h5>Property Location</h5>
        <div>
          <Form.Item label="City/Province">
            <Input value={formData.cityProvince} readOnly  />
          </Form.Item>
          <Form.Item label="Municipality">
            <Input value={formData.propertyMunicipality} readOnly  />
          </Form.Item>
          <Form.Item label="Barangay">
            <Input value={formData.propertyBarangay} readOnly  />
          </Form.Item>
        </div>

      </Form>
    </Drawer>
  );
};

export default ViewDrawer;
