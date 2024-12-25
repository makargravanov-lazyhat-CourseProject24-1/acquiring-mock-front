import {useEffect, useState} from 'react';
import classes from './LogReg.module.css';
import {useNavigate} from "react-router-dom";

export const LogReg = () => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [isFormVisible] = useState(true);
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });
    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    useEffect(() => {

        return () => {

        };
    }, []);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const newErrors = {
            name: registerFormData.firstName.length < 2,
            email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerFormData.email),
            password: registerFormData.password.length < 6
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            const response = await fetch('https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerFormData)
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                alert('Ошибка при регистрации');
            }
        } catch (error) {
            alert('Ошибка при отправке данных');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('https://acquiring.lazyhat.ru/acquiring-mock-backend/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginFormData),
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/my/accounts/');
            } else {
                alert('Ошибка при входе');
            }
        } catch (error) {
            console.log(error)
            alert('Ошибка при отправке данных');
        }
    };


    return (
        <div>
            <div className={classes.background}>
            </div>
            {isFormVisible && (
                <div className={classes.container}>
                    {isRegistering ? (
                        <div className={classes.registerform}>
                            <div className={classes.jettours}>Регистрация</div>
                            <input
                                type="text"
                                placeholder="Имя"
                                value={registerFormData.firstName}
                                onChange={(e) => {
                                    setRegisterFormData({
                                        ...registerFormData,
                                        firstName: e.target.value
                                    });
                                    setErrors({...errors, firstName: false});
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={registerFormData.email}
                                onChange={(e) => {
                                    setRegisterFormData({
                                        ...registerFormData,
                                        email: e.target.value
                                    });
                                    setErrors({...errors, email: false});
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={registerFormData.password}
                                onChange={(e) => {
                                    setRegisterFormData({
                                        ...registerFormData,
                                        password: e.target.value
                                    });
                                    setErrors({...errors, password: false});
                                }}
                            />
                            <button onClick={handleRegister}>Зарегистрироваться</button>
                            <button onClick={toggleForm}>Уже есть аккаунт? Войти</button>
                        </div>
                    ) : (
                        <div className={classes.loginform}>
                            <div className={classes.jettours}>Вход</div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginFormData.email}
                                onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={loginFormData.password}
                                onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                            />
                            <button onClick={handleLogin}>Войти</button>
                            <button onClick={toggleForm}>Нет аккаунта? Зарегистрироваться</button>
                        </div>
                    )}
                </div>
            )}
            {showSuccessModal && (
                <div className={classes.modal}>
                    <div className={classes.modalcontent}>
                        <h2>Регистрация успешна!</h2>
                        <button onClick={() => {
                            setShowSuccessModal(false);
                            setIsRegistering(false);
                        }}>
                            Войти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};