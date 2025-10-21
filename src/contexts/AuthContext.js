import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import authService from '../services/auth.service';

// Estados do contexto de autenticação
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

// Perfis/Roles do sistema
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANAGER: 'manager'
};

// Tipos de ações
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_USER: 'SET_USER',
};

// Reducer para gerenciar o estado
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload.error,
            };

        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                loading: false,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// Criação do contexto
const AuthContext = createContext();

// Provider do contexto
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Verificar autenticação ao carregar a aplicação
    useEffect(() => {
        const initializeAuth = async () => {
            try {
               // console.log('AuthProvider: Inicializando...'); // Debug
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
                
                const token = authService.getToken();
                if (token) {
                    // Aqui você pode fazer uma chamada para validar o token e obter dados do usuário
                    // Por enquanto, vamos apenas definir como autenticado se houver token
                    const userData = await getUserData(); // Implementar esta função se necessário
                    dispatch({ 
                        type: AUTH_ACTIONS.SET_USER, 
                        payload: userData || { token } 
                    });
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Erro ao inicializar autenticação:', error);
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        initializeAuth();
    }, []);

    // Função para obter dados do usuário usando a API /user/profile
    const getUserData = async () => {
        try {
            return await authService.getCurrentUser();
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
            return null;
        }
    };

    // Função de login
    const login = useCallback(async (email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });
            
            const response = await authService.login(email, password);
            
            // Obter dados do usuário após login bem-sucedido
            const userData = await getUserData() || { 
                email, 
                token: response.token
            };
            
            dispatch({ 
                type: AUTH_ACTIONS.LOGIN_SUCCESS, 
                payload: { user: userData } 
            });
            
            return { success: true, data: response };
        } catch (error) {
            dispatch({ 
                type: AUTH_ACTIONS.LOGIN_FAILURE, 
                payload: { error: error.message } 
            });
            return { success: false, error: error.message };
        }
    }, []);

    // Função de registro
    const register = useCallback(async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.REGISTER_START });
            
            const response = await authService.register(userData);
            
            dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
            
            return { success: true, data: response };
        } catch (error) {
            dispatch({ 
                type: AUTH_ACTIONS.REGISTER_FAILURE, 
                payload: { error: error.message } 
            });
            return { success: false, error: error.message };
        }
    }, []);

    // Função de logout
    const logout = useCallback(() => {
        authService.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }, []);

    // Função para limpar erros
    const clearError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }, []);

    // Funções helper para verificar roles
    const hasRole = useCallback((role) => {
        return state.user?.role === role;
    }, [state.user]);

    const isAdmin = useCallback(() => {
        // Verifica tanto o campo 'role' quanto o campo 'admin' booleano
        return state.user?.role === USER_ROLES.ADMIN || state.user?.admin === true;
    }, [state.user]);

    const isManager = useCallback(() => {
        return hasRole(USER_ROLES.MANAGER);
    }, [hasRole]);

    const canAccessAdmin = useCallback(() => {
        return isAdmin() || isManager();
    }, [isAdmin, isManager]);

    // Valor do contexto memorizado para evitar re-renders desnecessários
    const value = useMemo(() => ({
        // Estado
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        
        // Ações
        login,
        register,
        logout,
        clearError,
        
        // Verificações de role
        hasRole,
        isAdmin,
        isManager,
        canAccessAdmin,
    }), [state, login, register, logout, clearError, hasRole, isAdmin, isManager, canAccessAdmin]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    //console.log('useAuth context:', context); // Debug
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    
    return context;
};

export default AuthContext;