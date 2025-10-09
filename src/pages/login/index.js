import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Capturar dados vindos do registro, se houver
    useEffect(() => {
        if (location.state?.fromRegister) {
            setEmail(location.state.email || '');
            setSuccess(location.state.message || 'Cadastro realizado com sucesso!');
            
            // Limpar state após exibição
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Integração com API do backend
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }

            // Salvar token no localStorage
            localStorage.setItem('token', data.token);
            
            // Redirecionar para a home
            navigate('/', { state: { fromLogin: true } });
            
        } catch (err) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Sushi House</h1>
                <p>Entre para fazer seu pedido ou participar do rodízio</p>
            </div>
            
            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
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
                
                <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            
            <div className="login-footer">
                <p>
                    Não tem uma conta? {" "}
                    <Link to="/register" className="register-link">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
