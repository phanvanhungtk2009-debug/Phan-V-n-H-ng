import React from 'react';
import Card from './common/Card';
import { ButtonSpinner } from './common/Spinner';

interface PaymentGatewayProps {
    isOpen: boolean;
    orderTotal: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const PaymentGateway = ({ isOpen, orderTotal, onSuccess, onCancel }: PaymentGatewayProps) => {
    const [cardNumber, setCardNumber] = React.useState('');
    const [expiry, setExpiry] = React.useState('');
    const [cvc, setCvc] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        value = value.replace(/(.{4})/g, '$1 ').trim(); // Add spaces every 4 digits
        setCardNumber(value.slice(0, 19));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setExpiry(value.slice(0, 5));
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvc(e.target.value.replace(/\D/g, '').slice(0, 3));
    };

    const validateForm = () => {
        if (cardNumber.length !== 19) {
            setError('Số thẻ không hợp lệ.');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setError('Ngày hết hạn không hợp lệ (MM/YY).');
            return false;
        }
        if (cvc.length !== 3) {
            setError('CVC phải có 3 chữ số.');
            return false;
        }
        setError('');
        return true;
    };

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // After showing success message, call the success callback
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="text-center p-6 animate-pop-in">
                        <svg className="mx-auto h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-2xl font-bold text-gray-800">Thanh toán thành công!</h3>
                        <p className="mt-2 text-gray-600">Đơn hàng của bạn đang được xử lý.</p>
                    </div>
                ) : (
                    <form onSubmit={handlePay}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thanh toán an toàn</h2>
                        <p className="text-gray-600 mb-6">Tổng số tiền: <span className="font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(orderTotal)}đ</span></p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Số thẻ</label>
                                <input type="text" id="card-number" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
                                    <input type="text" id="expiry" value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" id="cvc" value={cvc} onChange={handleCvcChange} placeholder="123" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"/>
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                        <div className="mt-6 flex flex-col gap-3">
                            <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg btn-primary disabled:opacity-50 flex items-center justify-center">
                                {isLoading ? <ButtonSpinner /> : `Thanh toán ${new Intl.NumberFormat('vi-VN').format(orderTotal)}đ`}
                            </button>
                            <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                Hủy
                            </button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default PaymentGateway;
