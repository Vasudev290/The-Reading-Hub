import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoginForm from '../components/auth/LoginForm';
import AuthLayout from '../components/auth/AuthLayout';

const Login = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <AuthLayout
      title={t('signInToAccount')}
      subtitle={t('discoverBooks')}
    >
      <div className="flex flex-col items-center">
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        
      </div>
    </AuthLayout>
  );
};

export default Login;