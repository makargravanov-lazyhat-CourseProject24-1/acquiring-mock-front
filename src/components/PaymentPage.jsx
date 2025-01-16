import "./PaymentPage.css"
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

export const PaymentModal = ({ isSuccess, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className={`modal-icon ${isSuccess ? 'success' : 'error'}`}>
                    {isSuccess ? '✓' : '✕'}
                </div>
                <h3>{isSuccess ? 'Оплата прошла успешно' : 'Ошибка оплаты'}</h3>
                <p>
                    {isSuccess
                        ? 'Спасибо за оплату! Ваш платеж успешно обработан.'
                        : 'Произошла ошибка при обработке платежа. Пожалуйста, попробуйте снова.'}
                </p>
                <button className="modal-button" onClick={onClose}>
                    {isSuccess ? 'Закрыть' : 'Повторить'}
                </button>
            </div>
        </div>
    );
};

export const PaymentPage = () => {
    console.log('Component rendered');
    const {uuid} = useParams();
    const [paymentData, setPaymentData] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        cvv: '',
        expirationMonth: '',
        expirationYear: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({
        isOpen: false,
        isSuccess: false
    });

    useEffect(() => {
        console.log('Effect triggered', uuid);
        fetchPaymentData();
    }, [uuid]);

    const fetchPaymentData = async () => {
        try {
            const response = await axios.get(`https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/uuid=${uuid}`);
            console.log('Request', uuid);
            console.log(response.data)
            setPaymentData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load payment data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'number') {
            if (!/^[\d\s]*$/.test(e.target.value)) return;

            const value = e.target.value.replace(/\D/g, '');
            const formattedValue = value.replace(/(\d{4})(?=\d)/g, '\$1 ').trim();
            setFormData({
                ...formData,
                number: formattedValue
            });
        } else if (e.target.name === 'expirationMonth') {
            if (!/^[\d\s]*$/.test(e.target.value)) return;

            let v = e.target.value;
            if (parseInt(v) > 12) {
                v = '12';
            }
            setFormData({
                ...formData,
                [e.target.name]: v
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleModalClose = () => {
        setModalState({ ...modalState, isOpen: false });
        if (modalState.isSuccess) {
            // Можно добавить редирект или другую логику после успешной оплаты
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/uuid=${uuid}`, formData);
            setModalState({ isOpen: true, isSuccess: true });
        } catch (err) {
            setModalState({ isOpen: true, isSuccess: false });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="payment-page">
            <h2 className="payment-title">Оплата</h2>
            {paymentData && (
                <div className="payment-container">
                    <div className="amount-display">
                        Сумма: {paymentData.amount}₽
                    </div>
                    <div className="card-form">
                        <div className="card-preview">
                            <div className="card-logo">PETROFF BANK</div>
                            <div className="card-number-display">
                                {formData.number || '•••• •••• •••• ••••'}
                            </div>
                            <div className="card-details-preview">
                                <div className="expiry-preview">
                                    {(formData.expirationMonth || '••')}/{(formData.expirationYear || '••')}
                                </div>
                                <div className="cvv-preview">
                                    {formData.cvv ? '•••' : 'CVV'}
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="input-group">
                                <label>Номер карты</label>
                                <input
                                    type="text"
                                    name="number"
                                    maxLength="19"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="expiry-cvv-container">
                                <div className="input-group">
                                    <label>Месяц</label>
                                    <input
                                        type="text"
                                        name="expirationMonth"
                                        maxLength="2"
                                        placeholder="MM"
                                        value={formData.expirationMonth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Год</label>
                                    <input
                                        type="text"
                                        name="expirationYear"
                                        maxLength="2"
                                        placeholder="YY"
                                        value={formData.expirationYear}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>CVV</label>
                                    <input
                                        type="password"
                                        name="cvv"
                                        maxLength="3"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="pay-button">Оплатить</button>
                        </form>
                    </div>
                </div>
            )}
            <PaymentModal
                isOpen={modalState.isOpen}
                isSuccess={modalState.isSuccess}
                onClose={handleModalClose}
            />
        </div>
    );
}
