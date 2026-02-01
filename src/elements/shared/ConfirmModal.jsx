import { useTranslation } from "react-i18next";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

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

  // Reset checkbox when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDontAskAgain(false);
    }
  }, [isOpen]);

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-rose-500 hover:bg-rose-600 focus:ring-rose-500";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500";
      default:
        return "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500";
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-9999" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-bold text-gray-900 dark:text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-slate-300">{message}</p>
                </div>

                {showDontAskAgain && (
                  <div className="mt-4 flex items-center">
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
                      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-600 dark:bg-slate-700"
                    />
                    <label
                      htmlFor="dontAskAgain"
                      className="ml-2 text-sm text-gray-600 dark:text-slate-400"
                    >
                      {t("myurls.dontAskAgain")}
                    </label>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${getConfirmButtonClass()}`}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ConfirmModal;
