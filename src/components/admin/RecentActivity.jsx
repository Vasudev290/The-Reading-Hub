import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const RecentActivity = ({ borrowedBooks }) => {
  const { t } = useLanguage();

  const recentActivities = borrowedBooks.slice(0, 8);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('recentActivity')}
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {recentActivities.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {t('noRecentActivity')}
            </p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-300 text-sm sm:text-base">📚</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {activity.book.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {t('borrowedBy')} User {activity.userId}
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0 ml-2">
                {new Date(activity.borrowedAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;