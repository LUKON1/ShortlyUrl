import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { useOffline } from "../../context/OfflineProvider";

function OfflineModal() {
  const { t } = useTranslation();
  const { isOfflineModalOpen, hideOfflineModal } = useOffline();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Transition appear show={isOfflineModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-9999" onClose={hideOfflineModal}>
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
                  {t("offline.title")}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    {t("offline.message")}
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-sky-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    onClick={handleReload}
                  >
                    {t("offline.reload")}
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

export default OfflineModal;
