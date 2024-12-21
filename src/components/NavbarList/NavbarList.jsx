import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function NavbarList() {
  return (
    <motion.nav
      className="px-2 space-y-1"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {[
        { name: "Home", to: "/" },
        { name: "About us", to: "/about" },
        { name: "Dashboard", to: "/dashboard" },
        { name: "Contact us", to: "/contact" },
        { name: "Map", to: "/map" },
      ].map((item) => (
        <motion.div key={item.name} variants={itemVariants}>
          <Link
            to={item.to}
            className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
