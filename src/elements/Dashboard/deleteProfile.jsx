import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import ConfirmModal from "../shared/ConfirmModal";

function DeleteProfile() {
  const API_DELETE_USER = "/user/deleteuser";
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteUser = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosPrivate.delete(API_DELETE_USER);
      setAuth({});
      navigate("/");
    } catch (err) {
      console.error("Delete user error:", err);
      alert(t("modal.error", "Failed to delete account. Please try again."));
    }
  };
  return (
    <>
      <button
        onClick={handleDeleteUser}
        type="button"
        className="touch-manipulation flex h-8 w-8 items-center justify-center rounded-md bg-red-300 p-1.5 text-sm font-bold text-white shadow-md transition-all duration-200 ease-out hover:bg-red-400 hover:shadow-lg active:bg-red-500 sm:h-10 sm:w-10 sm:text-base md:h-14 md:w-14 dark:bg-red-500 dark:text-slate-900 dark:hover:bg-red-600 dark:active:bg-red-700"
        title={t("myurls.deleteProfile")}
      >
        <svg fill="#FFFFFF" viewBox="-3 -2 24 24" preserveAspectRatio="xMinYMin">
          <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
        </svg>
      </button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title={t("modal.deleteProfile.title")}
        message={t("modal.deleteProfile.confirm")}
        confirmText={t("modal.deleteProfile.confirmBtn")}
        cancelText={t("modal.deleteProfile.cancelBtn")}
        type="danger"
      />
    </>
  );
}
export default DeleteProfile;
