import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const UserManagement = ({ users, borrowedBooks }) => {
  const { t } = useLanguage();

  const getUserBorrowedBooks = (userId) => {
    return borrowedBooks.filter(record => record.userId === userId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {t('usersManagement')}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('user')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('email')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('borrowedBooks')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('memberSince')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {getUserBorrowedBooks(user.id).length} {t('books')}
                    </div>
                    {getUserBorrowedBooks(user.id).length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                        {getUserBorrowedBooks(user.id)
                          .slice(0, 2)
                          .map(record => record.book.title)
                          .join(', ')}
                        {getUserBorrowedBooks(user.id).length > 2 && '...'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden p-4 space-y-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {getUserBorrowedBooks(user.id).length} {t('borrowedBooks')}
                    </p>
                    {getUserBorrowedBooks(user.id).length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {getUserBorrowedBooks(user.id)
                          .slice(0, 2)
                          .map(record => record.book.title)
                          .join(', ')}
                        {getUserBorrowedBooks(user.id).length > 2 && '...'}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;