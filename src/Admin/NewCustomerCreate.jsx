import React, { useState } from 'react';
import { db } from '../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

export default function NewCustomerCreate() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    loanAmount: '',
    agent: '',
    agentMobile: '',
    totalPaid: '',
    perDayEmi: '',
    totalDays: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await addDoc(collection(db, 'clients'), {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        totalPaid: Number(formData.totalPaid),
        perDayEmi: Number(formData.perDayEmi),
        totalDays: Number(formData.totalDays),
        emis: [],
        createdAt: new Date()
      });

      setMessage({ text: '✅ Customer added successfully.', type: 'success' });

      // ✅ Redirect to /admin after 1.5 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ text: '❌ Failed to add customer.', type: 'danger' });
    }

    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h2>➕ Add New Customer</h2>
      {message.text && (
        <Alert variant={message.type} className="mt-3">{message.text}</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile</Form.Label>
          <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Loan Amount</Form.Label>
          <Form.Control type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Agent Name</Form.Label>
          <Form.Control type="text" name="agent" value={formData.agent} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Agent Mobile</Form.Label>
          <Form.Control type="text" name="agentMobile" value={formData.agentMobile} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Total Paid</Form.Label>
          <Form.Control type="number" name="totalPaid" value={formData.totalPaid} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Per Day EMI</Form.Label>
          <Form.Control type="number" name="perDayEmi" value={formData.perDayEmi} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Total Days</Form.Label>
          <Form.Control type="number" name="totalDays" value={formData.totalDays} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Customer'}
        </Button>
      </Form>
    </Container>
  );
}
