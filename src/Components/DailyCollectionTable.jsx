import React, { useContext, useEffect } from 'react';
import { Accordion, Card, Button, Table, Spinner } from 'react-bootstrap';
import { CustomerContext } from '../Context/CustomerContext';
import { db } from '../FirebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function CustomerEmiAccordion() {
    const { customers, setCustomers, loading } = useContext(CustomerContext);
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

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">📒 Customer EMI Details</h2>
            <Accordion defaultActiveKey="0">
                {customers.map((cust) => {
                    const emiCount = (cust.emis || []).length;

                    return (
                        <Accordion.Item eventKey={cust.id} key={cust.id}>
                            <Accordion.Header>
                                {cust.name} - <strong>₹{cust.totalPaid || 0}</strong> , Paid Till Now
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <h5 className="card-title">Customer Information</h5>
                                        <p><strong>🆔 Firebase Doc ID:</strong> {cust.id}</p>
                                        <p><strong>📱 Mobile:</strong> {cust.mobile}</p>
                                        <p><strong>💸 Loan Amount:</strong> ₹{cust.loanAmount}</p>
                                        <p><strong>🧑‍💼 Agent:</strong> {cust.agent}</p>
                                        <p><strong>💰 Per Day EMI:</strong> ₹{cust.perDayEmi}</p>
                                        <p><strong>📅 Total Days:</strong> {cust.totalDays}</p>
                                        <p><strong>✅ Total Paid:</strong> ₹{cust.totalPaid}</p>
                                        <p><strong>📝 Total EMI Payments:</strong> {emiCount}</p>
                                        <Button
                                            variant="success"
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
