import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import notFound from "../../assets/eapyff.png";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: 1.5 }}
      transition={{ type: "spring", stiffness: 60, damping: 20 }}
      className="flex min-h-[50vh] flex-col items-center justify-center text-center"
    >
      <motion.div
        className="motion-safe relative"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <img
          src={notFound}
          alt="404"
          className="absolute -top-15 right-12 z-20 h-19 w-16"
          onDragStart={(e) => e.preventDefault()}
        />
        <h1 className="z-15 text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
      </motion.div>

      <motion.p
        className="motion-safe notranslate mt-4 text-xl text-gray-600 dark:text-gray-400"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 60, damping: 20 }}
      >
        Page Not Found
      </motion.p>

      <motion.p
        className="motion-safe mt-2 text-gray-500"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 60, damping: 20 }}
      >
        Route: {window.location.pathname}
      </motion.p>

      <motion.div
        className="motion-safe"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 20 }}
      >
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-sky-500 px-6 py-2 text-white hover:bg-sky-600"
        >
          Go Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
