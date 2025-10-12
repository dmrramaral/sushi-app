import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  
  // Usar o contexto de autenticação
  const { register: authRegister, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');

  // Validação de senha
  const validatePassword = (password) => {
    let strength = 0;
    let feedback = [];

    if (password.length < 6) {
      feedback.push('A senha deve ter pelo menos 6 caracteres');
    } else {
      strength += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('A senha deve conter pelo menos uma letra maiúscula');
    } else {
      strength += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('A senha deve conter pelo menos uma letra minúscula');
    } else {
      strength += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('A senha deve conter pelo menos um número');
    } else {
      strength += 1;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      feedback.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
    } else {
      strength += 1;
    }

    let strengthClass = '';
    if (strength <= 2) {
      strengthClass = 'strength-weak';
    } else if (strength <= 4) {
      strengthClass = 'strength-medium';
    } else {
      strengthClass = 'strength-strong';
    }

    return { strengthClass, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validação específica para senha
    if (name === 'password') {
      const { strengthClass } = validatePassword(value);
      setPasswordStrength(strengthClass);
    }

    // Limpar erros quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value
    });

    // Limpar erros quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos obrigatórios
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha usando a função existente
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation.feedback.length > 0) {
      newErrors.password = passwordValidation.feedback[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Preparar dados para a API
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          addresses: [address]
        };

        // Usar o contexto de autenticação
        const result = await authRegister(userData);

        if (result.success) {
          // Redirecionar para login com state
          navigate('/login', { 
            state: { 
              fromRegister: true,
              email: formData.email,
              message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
            } 
          });
        } else {
          setErrors({
            submit: result.error || 'Erro ao criar conta. Tente novamente.'
          });
        }
      } catch (error) {
        setErrors({
          submit: error.message || 'Erro ao criar conta. Tente novamente.'
        });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Criar Conta</h1>
        <p className="text-gray-600">Preencha as informações abaixo para se cadastrar</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1.5 font-medium text-gray-700">Nome Completo*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
          {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1.5 font-medium text-gray-700">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
          {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1.5 font-medium text-gray-700">Senha*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
          <div className="mt-2 h-1 bg-gray-200 rounded overflow-hidden">
            <div className={`h-full transition-all ${
              passwordStrength === 'strength-weak' ? 'w-1/3 bg-red-500' : 
              passwordStrength === 'strength-medium' ? 'w-2/3 bg-orange-500' : 
              passwordStrength === 'strength-strong' ? 'w-full bg-green-500' : 
              'w-0'
            }`}></div>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            <span>A senha deve conter:</span>
            <ul className="pl-5 mt-1 list-disc text-xs">
              <li>Pelo menos 6 caracteres</li>
              <li>Uma letra maiúscula</li>
              <li>Uma letra minúscula</li>
              <li>Um número</li>
              <li>Um caractere especial (!@#$%^&*)</li>
            </ul>
          </div>
          {errors.password && <span className="text-red-600 text-sm mt-1">{errors.password}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="mb-1.5 font-medium text-gray-700">Confirmar Senha*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
          {errors.confirmPassword && <span className="text-red-600 text-sm mt-1">{errors.confirmPassword}</span>}
        </div>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">Endereço</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="street" className="mb-1.5 font-medium text-gray-700">Rua</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1.5 font-medium text-gray-700">Cidade</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="state" className="mb-1.5 font-medium text-gray-700">Estado</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="zipCode" className="mb-1.5 font-medium text-gray-700">CEP</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleAddressChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10"
          />
        </div>

        {errors.submit && <div className="text-red-600 text-sm mt-2">{errors.submit}</div>}

        <button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md mt-3 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p>
          Já tem uma conta? <Link to="/login" className="text-green-800 font-medium hover:underline">Faça Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;