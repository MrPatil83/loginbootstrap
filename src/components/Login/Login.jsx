import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineRefresh,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isvalidform, setisvalidform] = useState("");

  const navigate = useNavigate();

  function generateCaptcha() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captcha;
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserCaptcha("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && userCaptcha === captcha) {
      setisvalidform("");
      navigate("/dashboard");
    } else {
      setisvalidform(
        "Please fill in all details correctly and solve the captcha."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 bg-gray-100 flex items-center justify-center">
          <div className="w-full">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Notice
            </h3>
            <div className="overflow-hidden h-48">
              <motion.div
                animate={{ y: ["0%", "-100%"] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="space-y-4"
              >
                <div className="bg-gray-200 p-4 rounded-lg text-gray-800">
                  Notice 1: Welcome to the login page.
                </div>
                <div className="bg-gray-200 p-4 rounded-lg text-gray-800">
                  Notice 2: Please enter your email and password to access your
                  account.
                </div>
                <div className="bg-gray-200 p-4 rounded-lg text-gray-800">
                  Notice 3: Make sure to solve the captcha correctly.
                </div>
                <div className="bg-gray-200 p-4 rounded-lg text-gray-800">
                  Notice 4: For any issues, contact support.
                </div>
                <div className="bg-gray-200 p-4 rounded-lg text-gray-800">
                  Notice 5: Thank you for using our service.
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 bg-white"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-800"
              >
                Email
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-800"
              >
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="captcha"
                className="text-sm font-medium text-gray-800"
              >
                Captcha
              </label>
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-800 font-mono text-xl p-2 rounded-lg flex-grow text-center"
                >
                  {captcha}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <HiOutlineRefresh className="h-5 w-5" />
                </motion.button>
              </div>
              <input
                id="captcha"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-400"
                placeholder="Enter captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
              />
            </div>
            {isvalidform && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 text-sm mt-2"
              >
                {isvalidform}
              </motion.div>
            )}
            <div className=" flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-40 py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Sign In
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
