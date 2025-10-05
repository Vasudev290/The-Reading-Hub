import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLayout from '../components/auth/AuthLayout';

const Register = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout
      title={t('createAccount')}
      subtitle={t('joinOurLibrary')}
    >
      <div className="flex flex-col items-center">
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </AuthLayout>
  );
};

export default Register;