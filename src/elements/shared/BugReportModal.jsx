import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios.js";
import { motion } from "motion/react";

const BugReportModal = ({ isOpen, closeModal }) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState("UI/UX");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await axios.post("/support/report", {
        topic,
        description,
        contact,
      });
      setStatus("success");
      setTimeout(() => {
        closeModal();
        // Reset form after close
        setTimeout(() => {
          setStatus(null);
          setDescription("");
          setContact("");
        }, 500);
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-300" onClose={closeModal}>
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
                  {t("bugreport.title", "Report a Bug")} 🐞
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("bugreport.subtitle", "Found an issue? Let us know so we can fix it ASAP.")}
                  </p>
                </div>

                {!status && (
                  <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("bugreport.topic", "Topic")}
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="UI/UX">UI / Design Glitch</option>
                        <option value="Functionality">Broken Feature</option>
                        <option value="Account">Account Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("bugreport.description", "Description")} *
                      </label>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        placeholder={t("bugreport.descPlaceholder", "Describe what happened...")}
                      ></textarea>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("bugreport.contact", "Contact (Optional)")}
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Email or Telegram @"
                      />
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                        onClick={closeModal}
                      >
                        {t("common.cancel", "Cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-lg border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none disabled:opacity-50"
                      >
                        {isLoading ? "Sending..." : t("common.send", "Send Report")}
                      </button>
                    </div>
                  </form>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex flex-col items-center justify-center p-4 text-center text-green-500"
                  >
                    <svg
                      className="mb-3 h-16 w-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">Report Sent!</h3>
                    <p className="text-sm text-gray-500">Thank you for helping us improve.</p>
                  </motion.div>
                )}

                {status === "error" && (
                  <div className="mt-8 text-center text-red-500">
                    <p>Something went wrong. Please try again later.</p>
                    <button onClick={() => setStatus(null)} className="mt-4 text-sm underline">
                      Try Again
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BugReportModal;
