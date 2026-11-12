import React from 'react';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

const OrderTracking = ({ currentStatus }) => {
    // Array specifying structural steps, validation identifiers, and mapping properties
    const statuses = [
        { id: 'placed', label: 'Placed', icon: CheckCircle },
        { id: 'packed', label: 'Packed', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: Home }
    ];

    const getCurrentIndex = () => statuses.findIndex(s => s.id === currentStatus);

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                <div 
                    className="absolute left-0 top-1/2 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(getCurrentIndex() / (statuses.length - 1)) * 100}%` }}
                ></div>

                {statuses.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= getCurrentIndex();
                    
                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                                <Icon size={16} />
                            </div>
                            <span className={`text-xs font-semibold mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTracking;