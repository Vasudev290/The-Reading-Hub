import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../slices/toastSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);

  useEffect(() => {
    const timers = toasts.map(toast => 
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts, dispatch]);

  const getToastStyles = (type) => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg pointer-events-auto w-80";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white border-l-4 border-green-600`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white border-l-4 border-red-600`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-600`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-600`;
      default:
        return `${baseStyles} bg-gray-500 text-white border-l-4 border-gray-600`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1 
            }}
            className="flex justify-end"
          >
            <div className={getToastStyles(toast.type)}>
              <div className="flex-shrink-0 mr-3">
                <span className="text-xl">{getIcon(toast.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <button
                  onClick={() => dispatch(removeToast(toast.id))}
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;