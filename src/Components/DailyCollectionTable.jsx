import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Card, Button, Table, Spinner, Form } from 'react-bootstrap';
import { CustomerContext } from '../Context/CustomerContext';
import { db } from '../FirebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function CustomerEmiAccordion() {
  const { customers, setCustomers, loading } = useContext(CustomerContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const customerData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            totalPaid: (data.emis || []).reduce((acc, emi) => acc + (emi.amount || 0), 0),
          };
        });

        setCustomers(customerData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers(); // Fetch customers when the component mounts
  }, [setCustomers]);

  if (loading) return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;

  // Calculate total per day EMI from all customers
  const totalPerDayEmi = (customers || []).reduce((acc, cust) => acc + (cust.perDayEmi || 0), 0);

  // Filter customers based on the search term
  const filteredCustomers = customers.filter(cust => cust.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">📒 Customer EMI Details</h2>
      <h3 className="mb-4 text-center text-success">🎯 Daily EMI Target: ₹{totalPerDayEmi}</h3>

      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Group controlId="search">
          <Form.Label><strong>Search Customer by Name:</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter customer name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </Form.Group>
      </Form>

      <Accordion defaultActiveKey="0">
        {filteredCustomers.map((cust) => {
          const emiCount = (cust.emis || []).length;

          return (
            <Accordion.Item eventKey={cust.id} key={cust.id}>
              <Accordion.Header>
                {cust.name} <strong>&nbsp; ₹{cust.totalPaid || 0}</strong>,&nbsp; Paid Till Now
              </Accordion.Header>
              <Accordion.Body>
                <Card className="mb-3 border-light">
                  <Card.Body>
                    <h5>Customer Information</h5>
                    <p><strong>🆔 Doc ID:</strong> {cust.id}</p>
                    <p><strong>📱 Mobile:</strong> {cust.mobile}</p>
                    <p><strong>💸 Loan Amount:</strong> ₹{cust.loanAmount}</p>
                    <p><strong>🧑‍💼 Agent:</strong> {cust.agent}</p>
                    <p><strong>💰 Per Day EMI:</strong> ₹{cust.perDayEmi}</p>
                    <p><strong>📅 Total Days:</strong> {cust.totalDays}</p>
                    <p><strong>✅ Total Paid:</strong> ₹{cust.totalPaid}</p>
                    <p><strong>📝 Total EMI Payments:</strong> {emiCount}</p>
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => navigate(`/add-emi/${cust.id}`)}
                    >
                      ➕ Add EMI
                    </Button>
                  </Card.Body>
                </Card>

                <h5 className="mb-2">📄 EMI Payments</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(cust.emis || []).map((emi, index) => (
                      <tr key={emi.id || index}>
                        <td>{index + 1}</td>
                        <td>{emi.date ? new Date(emi.date).toLocaleDateString() : 'N/A'}</td>
                        <td>₹{emi.amount}</td>
                      </tr>
                    ))}
                  </tbody>
        </Table>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}
