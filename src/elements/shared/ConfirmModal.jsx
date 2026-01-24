import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // "warning", "danger", "info"
  showDontAskAgain = false,
  dontAskAgainKey = null,
  onDontAskAgainChange = null,
}) {
  const { t } = useTranslation();
  const [dontAskAgain, setDontAskAgain] = useState(false);

  // Сброс состояния галочки при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setDontAskAgain(false);
    }
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Блокировка скролла при открытом модале
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
      default:
        return "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-140 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
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
                    {title}
                  </h3>
                </div>

                {/* Message */}
                <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>

                {/* Don't ask again checkbox */}
                {showDontAskAgain && (
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="dontAskAgain"
                      checked={dontAskAgain}
                      onChange={(e) => {
                        setDontAskAgain(e.target.checked);
                        if (onDontAskAgainChange) {
                          onDontAskAgainChange(e.target.checked);
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-2 focus:ring-sky-500 dark:border-gray-600 dark:bg-slate-700"
                    />
                    <label
                      htmlFor="dontAskAgain"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {t("myurls.dontAskAgain")}
                    </label>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="touch-manipulation rounded-md px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:text-gray-400 dark:hover:bg-slate-700"
                    style={{ transition: "var(--transition-bg)" }}
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`touch-manipulation px-4 py-2 ${getConfirmButtonClass()} rounded-md font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none`}
                    style={{ transition: "var(--transition-bg)" }}
                  >
                    {confirmText}
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

export default ConfirmModal;
