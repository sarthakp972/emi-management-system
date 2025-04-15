import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default function AddEmiPayments() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const docRef = doc(db, 'clients', customerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setCustomer({ id: docSnap.id, ...docSnap.data() });
        else setError('Customer not found');
      } catch (err) {
        setError('Error fetching customer');
        console.error(err);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleAddEmi = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const emi = {
        amount: Number(amount),
        date: new Date().toISOString(),
      };

      const updatedEmis = [...(customer.emis || []), emi];
      const newTotalPaid = (customer.totalPaid || 0) + emi.amount;

      await updateDoc(doc(db, 'clients', customerId), {
        emis: updatedEmis,
        totalPaid: newTotalPaid,
      });

      setSuccess('EMI added successfully');
      setAmount('');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError('Failed to add EMI');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>➕ Add EMI Payment</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {customer && (
        <Form onSubmit={handleAddEmi}>
          <Form.Group className="mb-3">
            <Form.Label>Customer: <strong>{customer.name}</strong></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter EMI amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Submit EMI</Button>
        </Form>
      )}
    </Container>
  );
}