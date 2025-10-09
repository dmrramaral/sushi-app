import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const Register = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);

      try {
        // Preparar dados para a API
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          addresses: [address]
        };

        // Chamada à API
        const response = await fetch('http://localhost:3000/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar usuário');
        }

        // Redirecionar para login com state
        navigate('/login', { 
          state: { 
            fromRegister: true,
            email: formData.email,
            message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
          } 
        });

      } catch (error) {
        setErrors({
          submit: error.message || 'Erro ao criar conta. Tente novamente.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>Criar Conta</h1>
        <p>Preencha as informações abaixo para se cadastrar</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome Completo*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="validation-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="validation-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="password-strength">
            <div className={`password-strength-bar ${passwordStrength}`}></div>
          </div>
          <div className="password-requirements">
            <span>A senha deve conter:</span>
            <ul>
              <li>Pelo menos 6 caracteres</li>
              <li>Uma letra maiúscula</li>
              <li>Uma letra minúscula</li>
              <li>Um número</li>
              <li>Um caractere especial (!@#$%^&*)</li>
            </ul>
          </div>
          {errors.password && <span className="validation-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="validation-error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-divider">
          <span>Endereço</span>
        </div>

        <div className="form-group">
          <label htmlFor="street">Rua</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Cidade</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">Estado</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">CEP</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleAddressChange}
          />
        </div>

        {errors.submit && <div className="validation-error">{errors.submit}</div>}

        <button 
          type="submit" 
          className="register-button" 
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <div className="login-link">
        <p>
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;