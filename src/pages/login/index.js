import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Aqui você implementaria a lógica de autenticação
        console.log('Login com:', email, password);
        
        // Após login bem-sucedido, redirecionar para a página inicial
        navigate('/');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Implementar lógica de cadastro
        console.log('Cadastro:', registerData);
        
        // Após cadastro, fechar o formulário e mostrar o login
        setShowRegister(false);
        setEmail(registerData.email);
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Sushi House</h1>
                <p>Entre para fazer seu pedido ou participar do rodízio</p>
            </div>
            
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="login-button">
                    Entrar
                </button>
            </form>
            
            <div className="login-footer">
                <p>
                    Não tem uma conta? {" "}
                    <span 
                        className="register-link"
                        onClick={() => setShowRegister(!showRegister)}
                    >
                        Cadastre-se
                    </span>
                </p>
            </div>
            
            <div className={`register-form ${showRegister ? 'active' : ''}`}>
                <h2>Criar conta</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="register-name">Nome completo</label>
                        <input 
                            type="text" 
                            id="register-name" 
                            name="name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-email">Email</label>
                        <input 
                            type="email" 
                            id="register-email" 
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-password">Senha</label>
                        <input 
                            type="password" 
                            id="register-password" 
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-confirm">Confirmar senha</label>
                        <input 
                            type="password" 
                            id="register-confirm" 
                            name="confirmPassword"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
