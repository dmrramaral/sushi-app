import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Usar o contexto de autenticação
    const { login: authLogin, loading, error, clearError } = useAuth();
    
    // Capturar dados vindos do registro, se houver
    useEffect(() => {
        if (location.state?.fromRegister) {
            setEmail(location.state.email || '');
            setSuccess(location.state.message || 'Cadastro realizado com sucesso!');
            
            // Limpar state após exibição
            window.history.replaceState({}, document.title);
            
            // Limpar erros do contexto quando vier do registro com sucesso
            clearError();
        }
    }, [location, clearError]);

    // Limpar erros quando o componente for montado ou quando houver mudanças
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000); // Limpa o erro após 5 segundos
            
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const result = await authLogin(email, password);
        
        if (result.success) {
            // Redirecionar para a página anterior ou home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { state: { fromLogin: true }, replace: true });
        }
        // Os erros são tratados automaticamente pelo contexto
    };

    return (
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Sushi House</h1>
                <p className="text-gray-600">Entre para fazer seu pedido ou participar do rodízio</p>
            </div>
            
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {success}
                </div>
            )}
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            <form className="flex flex-col gap-4 mb-5" onSubmit={handleLogin}>
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1.5 font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                    />
                </div>
                
                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1.5 font-medium text-gray-700">Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            
            <div className="text-center mt-6">
                <p>
                    Não tem uma conta? {" "}
                    <Link to="/register" className="text-green-800 font-medium hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
