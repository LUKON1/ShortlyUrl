import { createContext, useState, useContext } from "react";

export const OfflineContext = createContext({});

export const OfflineProvider = ({ children }) => {
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  const showOfflineModal = () => {
    setIsOfflineModalOpen(true);
  };

  const hideOfflineModal = () => {
    setIsOfflineModalOpen(false);
  };

  return (
    <OfflineContext.Provider
      value={{
        isOfflineModalOpen,
        showOfflineModal,
        hideOfflineModal,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  return useContext(OfflineContext);
};

export default OfflineContext;
