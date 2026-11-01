import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTracking from '../components/OrderTracking';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error('Error trying to download user specific historical lifecycle states:', err);
            }
        };
        fetchOrders();
    }, [token]);

    return (
        <div className="max-w-4xl mx-auto p-6 mt-6">
            <h2 className="text-2xl font-bold mb-6">Your Purchase Orders History</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">No processing transactions logged found across account indexes.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 shadow rounded border border-gray-100">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <div>
                                    <span className="text-sm text-gray-500 font-mono">ID: {order._id}</span>
                                    <p className="text-xs text-gray-400">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded">
                                    Current Status: {order.status}
                                </span>
                            </div>
                        
                            <OrderTracking currentStatus={order.status} />

                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-bold text-gray-700 mb-1">Purchased Manifest Cargo:</h4>
                                {order.items.map((item, index) => (
                                    <p key={index} className="text-sm text-gray-600 pl-2">
                                        • {item.name} <span className="font-semibold text-gray-800">x{item.quantity}</span> - ${item.price}
                                    </p>
                                ))}
                                <p className="text-right font-bold text-md text-gray-900 mt-2">Paid Aggregate: ${order.totalPrice}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;