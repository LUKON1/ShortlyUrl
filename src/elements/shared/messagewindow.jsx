import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "motion/react";

const Notifications = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([]);

  useImperativeHandle(ref, () => ({
    addNotification(message, duration = 5000) {
      const newNotification = {
        id: Date.now(),
        message,
        timestamp: Date.now(),
        duration,
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
  }));

  useEffect(() => {
    notifications.forEach((notification) => {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, notification.duration);
    });
  }, [notifications]);

  return (
    <div className="sticky top-24 z-145 h-0 w-[90vw] space-y-2 opacity-95 sm:mr-4 sm:ml-auto sm:w-60">
      <AnimatePresence mode="sync">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className="w-full rounded-lg border border-blue-600 bg-blue-500 px-4 py-2 text-xl text-white shadow-xl lg:px-10 lg:py-6 lg:text-2xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            style={{ transition: "var(--transition-bg)" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: index * 0.1,
            }}
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default Notifications;
