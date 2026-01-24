import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useOffline } from "../../context/OfflineProvider";

function OfflineModal() {
  const { t } = useTranslation();
  const { isOfflineModalOpen, hideOfflineModal } = useOffline();

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOfflineModalOpen) {
        hideOfflineModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOfflineModalOpen, hideOfflineModal]);

  // Блокировка скролла при открытом модале
  useEffect(() => {
    if (isOfflineModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOfflineModalOpen]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOfflineModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-140 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={hideOfflineModal}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-150 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="relative w-full max-w-md transform rounded-xl bg-white shadow-xl dark:bg-slate-800"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("offline.title")}
                  </h3>
                </div>

                {/* Message */}
                <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                  {t("offline.message")}
                </p>

                {/* Buttons */}
                <div className="flex justify-center">
                  <button
                    onClick={handleReload}
                    className="touch-manipulation rounded-md bg-sky-500 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                    style={{ transition: "var(--transition-bg)" }}
                  >
                    {t("offline.reload")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OfflineModal;
