import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const StatsCards = ({ stats }) => {
  const { t } = useLanguage();

  const statItems = [
    {
      label: t('totalBooks'),
      value: stats.totalBooks,
      color: 'bg-blue-500',
      icon: '📚'
    },
    {
      label: t('totalUsers'),
      value: stats.totalUsers,
      color: 'bg-green-500',
      icon: '👥'
    },
    {
      label: t('currentlyBorrowed'),
      value: stats.borrowedBooks,
      color: 'bg-yellow-500',
      icon: '📖'
    },
    {
      label: t('outOfStockBooks'),
      value: stats.outOfStock,
      color: 'bg-red-500',
      icon: '⚠️'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.color} text-white p-4 sm:p-6 rounded-lg shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              <p className="opacity-90 text-xs sm:text-sm">{stat.label}</p>
            </div>
            <span className="text-2xl sm:text-3xl">{stat.icon}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;