import { useEffect, useState } from "react";
import "./MyAccounts.css";

export const AccountCard = ({ account, onAddCash }) => {
    const [amount, setAmount] = useState('');
    const expirationDate = new Date(account.expirationDate);
    const formattedDate = `${String(expirationDate.getMonth() + 1).padStart(2, '0')}/${String(expirationDate.getFullYear()).slice(-2)}`;

    // Форматирование номера карты
    const formatCardNumber = (number) => {
        return number.match(/.{1,4}/g).join(' ');
    };

    const handleAddCash = () => {
        if (amount && !isNaN(amount)) {
            onAddCash(account.id, parseFloat(amount));
            setAmount('');
        }
    };

    return (
        <div className="account-container">
            <div className={account.accountType === 'INDIVIDUAL' ? 'card-i' : 'card-c'}>
                <div className={account.accountType === 'INDIVIDUAL' ? 'j-bank-i' : 'j-bank-c'}>PetroffBank</div>
                <div className="card-number">{formatCardNumber(account.number)}</div>
                <div className="card-details">
                    <span>MM/YY: {formattedDate}</span>
                    <span>CVV: {account.cvv}</span>
                </div>
            </div>
            <div className="account-info">
                <div className="balance">{account.balance.toFixed(2)}₽</div>
                <div className="account-type">
                    {account.accountType === 'INDIVIDUAL' ? 'Личный счёт' : 'Юридический счёт'}
                </div>
                <div className="add-cash">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Введите сумму"
                    />
                    <button className={"add-cash-button"} onClick={handleAddCash}>Пополнить счёт</button>
                </div>
            </div>
        </div>
    );
};

export const AccountsList = () => {
    const [accounts, setAccounts] = useState([]);
    const [accountType, setAccountType] = useState('INDIVIDUAL');

    const fetchOptions = {
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await fetch(
                'https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/secured/accounts/my',
                {
                    ...fetchOptions,
                    method: 'GET'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const createAccount = async () => {
        try {
            const endpoint = accountType === 'INDIVIDUAL' ? '/create/individual' : '/create/corporate';
            const response = await fetch(
                `https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/secured${endpoint}`,
                {
                    ...fetchOptions,
                    method: 'POST'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchAccounts();
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    const addCash = async (accountId, amount) => {
        try {
            const response = await fetch(
                `https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/secured/account=${accountId}/cash/add${amount}/`,
                {
                    ...fetchOptions,
                    method: 'PUT'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchAccounts();
        } catch (error) {
            console.error('Error adding cash:', error);
        }
    };

    return (
        <div className="accounts-page">
            <div className="create-account">
                <button className={"create-account-button"} onClick={createAccount}>Завести счёт</button>
                <div className="account-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="INDIVIDUAL"
                            checked={accountType === 'INDIVIDUAL'}
                            onChange={(e) => setAccountType(e.target.value)}
                        />
                        Личный
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="CORPORATE"
                            checked={accountType === 'CORPORATE'}
                            onChange={(e) => setAccountType(e.target.value)}
                        />
                        Юридический
                    </label>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div className="no-accounts">У вас пока что нет счетов</div>
            ) : (
                <div className="accounts-list">
                    {accounts
                        .sort((a, b) => a.id - b.id) // Сортировка по id
                        .map(account => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onAddCash={addCash}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};