import {useEffect, useState} from "react";

export const AccountCard = ({ account, onAddCash }) => {
    const [amount, setAmount] = useState('');
    const expirationDate = new Date(account.expirationDate);
    const formattedDate = `${String(expirationDate.getMonth() + 1).padStart(2, '0')}/${String(expirationDate.getFullYear()).slice(-2)}`;

    const handleAddCash = () => {
        if (amount && !isNaN(amount)) {
            onAddCash(account.id, parseFloat(amount));
            setAmount('');
        }
    };

    return (
        <div className="account-container">
            <div className="card">
                <div className="card-number">{account.number}</div>
                <div className="card-details">
                    <span>Valid thru: {formattedDate}</span>
                    <span>CVV: {account.cvv}</span>
                </div>
            </div>
            <div className="account-info">
                <div className="balance">Balance: ${account.balance.toFixed(2)}</div>
                <div className="account-type">
                    {account.accountType === 'INDIVIDUAL' ? 'Personal Account' : 'Corporate Account'}
                </div>
                <div className="add-cash">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                    <button onClick={handleAddCash}>Add funds</button>
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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
                <div className="account-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="INDIVIDUAL"
                            checked={accountType === 'INDIVIDUAL'}
                            onChange={(e) => setAccountType(e.target.value)}
                        />
                        Individual
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="CORPORATE"
                            checked={accountType === 'CORPORATE'}
                            onChange={(e) => setAccountType(e.target.value)}
                        />
                        Corporate
                    </label>
                </div>
                <button onClick={createAccount}>Создать счёт</button>
            </div>

            {accounts.length === 0 ? (
                <div className="no-accounts">У вас пока что нет счетов</div>
            ) : (
                <div className="accounts-list">
                    {accounts.map(account => (
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