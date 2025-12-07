// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   Mail,
//   Shield,
//   Users,
//   TrendingUp,
// } from "lucide-react";
// import { setRole, setUserInfo } from "../../utils/auth";
// import { http, JAVA_API } from "../../services/config";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [particles, setParticles] = useState([]);
//   const [error, setError] = useState("");

//   // Mock users with different roles
//   // MỖI USER PHẢI CÓ employeeId để xác định danh tính
//   const mockUsers = {
//     employee: {
//       email: "employee@company.com",
//       password: "employee123",
//       role: "employee",
//       route: "/employee",
//       info: {
//         employeeId: "emp001",
//         name: "Trần Ngọc Hải",
//         department: "IT",
//         position: "Nhân viên",
//       },
//     },
//     admin: {
//       email: "admin@company.com",
//       password: "admin123",
//       role: "admin",
//       route: "/dashboard",
//       info: {
//         employeeId: "admin001",
//         name: "Nguyễn Văn Admin",
//         department: "Quản trị",
//         position: "Quản trị viên hệ thống",
//       },
//     },
//     manager: {
//       email: "manager@company.com",
//       password: "manager123",
//       role: "manager",
//       route: "/dashboard",
//       info: {
//         employeeId: "mgr001",
//         name: "Nguyễn Văn Quản Lý",
//         department: "IT",
//         position: "Trưởng phòng IT",
//       },
//     },
//     accountant: {
//       email: "accountant@company.com",
//       password: "accountant123",
//       role: "accountant",
//       route: "/dashboard",
//       info: {
//         employeeId: "acc001",
//         name: "Trần Thị Kế Toán",
//         department: "Tài chính",
//         position: "Kế toán trưởng",
//       },
//     },
//   };

//   // Initialize floating particles
//   useEffect(() => {
//     const generateParticles = () => {
//       const newParticles = [];
//       for (let i = 0; i < 50; i++) {
//         newParticles.push({
//           id: i,
//           x: Math.random() * 100,
//           y: Math.random() * 100,
//           size: Math.random() * 6 + 2,
//           speed: Math.random() * 2 + 0.5,
//           opacity: Math.random() * 0.7 + 0.3,
//           delay: Math.random() * 5000,
//           color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`, // Blue to purple range
//         });
//       }
//       setParticles(newParticles);
//     };

//     generateParticles();
//   }, []);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);
//   //   setError("");
//   //
//   //   // Simulate API call
//   //   setTimeout(() => {
//   //     // Find user by email and password
//   //     const user = Object.values(mockUsers).find(
//   //       (u) => u.email === formData.email && u.password === formData.password
//   //     );
//   //
//   //     if (user) {
//   //       // Set role và userInfo trong localStorage
//   //       setRole(user.role);
//   //       // Luôn lưu đầy đủ userInfo với email
//   //       setUserInfo({ ...user.info, email: user.email, role: user.role });
//   //       // Navigate to appropriate route based on role
//   //       navigate(user.route);
//   //     } else {
//   //       setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
//   //     }
//   //     setIsLoading(false);
//   //   }, 1500);
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError("");

//   try {
//     const url = `${JAVA_API}/auth/login`;
//     console.log("LOGIN URL =", url);

//     const response = await http(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password,
//       }),
//     });

//     if (!response.ok) {
//       let message = "Email hoặc mật khẩu không đúng!";
//       try {
//         const errorBody = await response.json();
//         if (errorBody?.message) message = errorBody.message;
//       } catch {}
//       throw new Error(message);
//     }

//     const data = await response.json();
//     const userFromApi = data.user || {};

//     // Bước 1: Lưu tạm thông tin cơ bản + token
//     localStorage.setItem('accessToken', data.accessToken || data.token);
//     if (data.refreshToken) {
//       localStorage.setItem('refreshToken', data.refreshToken);
//     }

//     setRole((userFromApi.role || "employee").toLowerCase());

//     // Bước 2: Lấy id số thật từ mã nhân viên (EMP001 → 1)
//     let realEmployeeId = null;
//     if (userFromApi.employeeId) {
//       try {
//         realEmployeeId = await getEmployeeIdByCode(userFromApi.employeeId);
//       } catch (err) {
//         console.warn("Không lấy được id số từ mã nhân viên, dùng tạm 1", err);
//         realEmployeeId = 1; // fallback tạm thời nếu API chưa có
//       }
//     }

//     // Bước 3: Lưu đầy đủ vào sessionStorage
//     setUserInfo({
//   id: realEmployeeId,                              // id số để gọi API nhanh
//   employeeCode: userFromApi.employeeId || `EMP${String(realEmployeeId || 1).padStart(3, '0')}`, // EMP004 đẹp
//   name: userFromApi.name || userFromApi.fullName || "Nhân viên",
//   email: userFromApi.email || formData.email,
//   role: (userFromApi.role || "employee").toLowerCase(),
// });

//     // Điều hướng
//     const role = (userFromApi.role || "employee").toLowerCase();
//     if (["admin", "manager", "accountant"].includes(role)) {
//       navigate("/dashboard");
//     } else {
//       navigate("/employee");
//     }

//   } catch (err) {
//     console.error("Login error:", err);
//     setError(err.message || "Đăng nhập thất bại!");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
//       {/* Ocean Background with Whale */}
//       <div className="absolute inset-0">
//         {/* Deep Ocean Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-blue-950"></div>

//         {/* Ocean Depth Lines */}
//         <div className="absolute inset-0 opacity-20">
//           {Array.from({ length: 20 }).map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-full h-px bg-blue-400/30 animate-pulse"
//               style={{
//                 top: `${i * 5}%`,
//                 animationDelay: `${i * 200}ms`,
//                 animationDuration: "4s",
//               }}
//             />
//           ))}
//         </div>

//         {/* Detailed Whale SVG */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="relative w-full h-full max-w-6xl max-h-6xl animate-whale-swim">
//             <svg
//               viewBox="0 0 1200 900"
//               className="w-full h-full opacity-75"
//               style={{
//                 filter: "drop-shadow(0 0 40px rgba(255, 0, 100, 0.7))",
//               }}
//             >
//               {/* Whale Body - More Detailed */}
//               <g transform="translate(300, 300) rotate(-20)">
//                 {/* Main Body - Larger and more realistic */}
//                 <ellipse
//                   cx="0"
//                   cy="0"
//                   rx="180"
//                   ry="60"
//                   fill="url(#whaleGradient)"
//                   className="animate-whale-glow"
//                 />

//                 {/* Whale Head - More detailed */}
//                 <ellipse
//                   cx="-120"
//                   cy="-15"
//                   rx="90"
//                   ry="50"
//                   fill="url(#whaleGradient)"
//                 />

//                 {/* Whale Snout/Rostrum */}
//                 <ellipse
//                   cx="-180"
//                   cy="-20"
//                   rx="40"
//                   ry="25"
//                   fill="url(#whaleGradient)"
//                 />

//                 {/* Whale Tail - More detailed */}
//                 <ellipse
//                   cx="150"
//                   cy="0"
//                   rx="60"
//                   ry="35"
//                   fill="url(#whaleGradient)"
//                 />

//                 {/* Tail Fluke */}
//                 <ellipse
//                   cx="200"
//                   cy="0"
//                   rx="30"
//                   ry="20"
//                   fill="url(#whaleGradient)"
//                 />

//                 {/* Large Pectoral Fin */}
//                 <ellipse
//                   cx="-30"
//                   cy="45"
//                   rx="35"
//                   ry="20"
//                   fill="url(#whaleGradient)"
//                   transform="rotate(25)"
//                 />

//                 {/* Dorsal Fin - More prominent */}
//                 <ellipse
//                   cx="30"
//                   cy="-50"
//                   rx="20"
//                   ry="12"
//                   fill="url(#whaleGradient)"
//                 />

//                 {/* Eye - More detailed */}
//                 <circle cx="-140" cy="-25" r="4" fill="#000" />
//                 <circle cx="-138" cy="-23" r="1.5" fill="#fff" />

//                 {/* Ventral Pleats - More detailed and realistic */}
//                 {Array.from({ length: 12 }).map((_, i) => (
//                   <g key={i}>
//                     <line
//                       x1={-100 + i * 12}
//                       y1="25"
//                       x2={-100 + i * 12}
//                       y2="40"
//                       stroke="rgba(255, 0, 100, 0.9)"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                     />
//                     <line
//                       x1={-100 + i * 12}
//                       y1="40"
//                       x2={-100 + i * 12}
//                       y2="55"
//                       stroke="rgba(255, 0, 100, 0.7)"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                     />
//                   </g>
//                 ))}

//                 {/* Gradient Definition - More vibrant */}
//                 <defs>
//                   <linearGradient
//                     id="whaleGradient"
//                     x1="0%"
//                     y1="0%"
//                     x2="100%"
//                     y2="100%"
//                   >
//                     <stop offset="0%" stopColor="#ff0066" stopOpacity="0.95" />
//                     <stop offset="30%" stopColor="#ff3366" stopOpacity="0.9" />
//                     <stop offset="60%" stopColor="#ff6699" stopOpacity="0.85" />
//                     <stop
//                       offset="100%"
//                       stopColor="#cc0044"
//                       stopOpacity="0.95"
//                     />
//                   </linearGradient>

//                   {/* Glow filter for whale */}
//                   <filter id="whaleGlow">
//                     <feGaussianBlur stdDeviation="4" result="coloredBlur" />
//                     <feMerge>
//                       <feMergeNode in="coloredBlur" />
//                       <feMergeNode in="SourceGraphic" />
//                     </feMerge>
//                   </filter>
//                 </defs>

//                 {/* Additional glow effect */}
//                 <ellipse
//                   cx="0"
//                   cy="0"
//                   rx="200"
//                   ry="70"
//                   fill="url(#whaleGradient)"
//                   opacity="0.3"
//                   filter="url(#whaleGlow)"
//                   className="animate-whale-glow"
//                 />
//               </g>
//             </svg>
//           </div>
//         </div>

//         {/* School of Fish */}
//         <div className="absolute inset-0">
//           {/* Red Fish School */}
//           {Array.from({ length: 15 }).map((_, i) => (
//             <div
//               key={`red-${i}`}
//               className="absolute animate-fish-swim"
//               style={{
//                 left: `${60 + Math.random() * 30}%`,
//                 top: `${20 + Math.random() * 40}%`,
//                 animationDelay: `${i * 300}ms`,
//                 animationDuration: `${8 + Math.random() * 4}s`,
//               }}
//             >
//               <div className="w-3 h-2 bg-red-500 rounded-full transform rotate-45 animate-pulse"></div>
//             </div>
//           ))}

//           {/* Blue Fish School */}
//           {Array.from({ length: 10 }).map((_, i) => (
//             <div
//               key={`blue-${i}`}
//               className="absolute animate-fish-swim-reverse"
//               style={{
//                 left: `${10 + Math.random() * 40}%`,
//                 top: `${50 + Math.random() * 30}%`,
//                 animationDelay: `${i * 400}ms`,
//                 animationDuration: `${6 + Math.random() * 3}s`,
//               }}
//             >
//               <div className="w-2 h-1.5 bg-blue-400 rounded-full transform -rotate-45 animate-pulse"></div>
//             </div>
//           ))}
//         </div>

//         {/* Floating Particles (Bubbles and Glowing Dots) */}
//         {particles.map((particle) => (
//           <div
//             key={particle.id}
//             className="absolute rounded-full animate-bubble-float"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//               backgroundColor:
//                 particle.id % 3 === 0
//                   ? "rgba(255, 255, 255, 0.3)"
//                   : particle.id % 3 === 1
//                   ? "rgba(255, 0, 100, 0.4)"
//                   : "rgba(100, 200, 255, 0.3)",
//               opacity: particle.opacity,
//               animationDelay: `${particle.delay}ms`,
//               animationDuration: `${particle.speed * 15}s`,
//               boxShadow:
//                 particle.id % 3 === 1
//                   ? "0 0 10px rgba(255, 0, 100, 0.5)"
//                   : "none",
//             }}
//           />
//         ))}

//         {/* Ocean Currents */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-current-flow"></div>
//           <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-current-flow-reverse"></div>
//         </div>

//         {/* DESTROYER Text (partially visible) */}
//         <div className="absolute top-4 left-4 text-white z-20">
//           <div className="text-6xl font-bold opacity-30 animate-pulse-slow"></div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex">
//         {/* Left Side - Login Form */}
//         <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
//           <div className="max-w-md w-full space-y-8 animate-fade-in">
//             {/* Logo and Header */}
//             <div className="text-center">
//               <div className="mx-auto h-20 w-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce-slow">
//                 <Users className="h-10 w-10 text-white" />
//               </div>
//               <h2 className="text-4xl font-bold text-white mb-2 animate-slide-up">
//                 Welcome Back
//               </h2>
//               <p className="text-xl text-blue-300 animate-slide-up-delay">
//                 Sign in to your account
//               </p>
//             </div>

//             {/* Login Form */}
//             <div className="bg-white rounded-3xl p-8 shadow-2xl animate-slide-up-delay-2">
//               <form className="space-y-6" onSubmit={handleSubmit}>
//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-blue-600"
//                   >
//                     Email address
//                   </label>
//                   <div className="relative group">
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       className="w-full px-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-blue-600"
//                   >
//                     Password
//                   </label>
//                   <div className="relative group">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="current-password"
//                       required
//                       className="w-full px-4 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                       placeholder="Enter your password"
//                       value={formData.password}
//                       onChange={handleChange}
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                       ) : (
//                         <Eye className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-sm text-red-600">{error}</p>
//                   </div>
//                 )}

//                 {/* Remember Me and Forgot Password */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="remember-me"
//                       className="ml-2 block text-sm text-gray-700"
//                     >
//                       Remember me
//                     </label>
//                   </div>
//                   <div className="text-sm">
//                     <a
//                       href="#"
//                       className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
//                     >
//                       Forgot password?
//                     </a>
//                   </div>
//                 </div>

//                 {/* Sign In Button */}
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                         Signing in...
//                       </div>
//                     ) : (
//                       "Sign in"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - EMPLOYEE HUB */}
//         <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-8">
//           <div className="max-w-lg text-center space-y-8 animate-fade-in-right">
//             {/* Brand Logo */}
//             <div className="space-y-4">
//               <div className="mx-auto h-24 w-24 bg-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-slow">
//                 <Shield className="h-12 w-12 text-white" />
//               </div>
//               <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
//                 EMPLOYEE HUB
//               </h1>
//               <p className="text-xl text-gray-300 animate-slide-up-delay">
//                 Advanced Human Resource Management System
//               </p>
//             </div>

//             {/* Features */}
//             <div className="space-y-6 animate-slide-up-delay-2">
//               <div className="flex items-center space-x-4 text-left">
//                 <div className="flex-shrink-0">
//                   <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <Users className="h-6 w-6 text-purple-400" />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     Employee Management
//                   </h3>
//                   <p className="text-gray-400">
//                     Comprehensive employee data and profile management
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4 text-left">
//                 <div className="flex-shrink-0">
//                   <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <TrendingUp className="h-6 w-6 text-purple-400" />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     Analytics & Reports
//                   </h3>
//                   <p className="text-gray-400">
//                     Real-time insights and detailed performance reports
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4 text-left">
//                 <div className="flex-shrink-0">
//                   <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <Shield className="h-6 w-6 text-purple-400" />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     Secure & Reliable
//                   </h3>
//                   <p className="text-gray-400">
//                     Enterprise-grade security with 99.9% uptime
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-4 pt-8 animate-slide-up-delay-3">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">10K+</div>
//                 <div className="text-sm text-gray-400">Active Users</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">500+</div>
//                 <div className="text-sm text-gray-400">Companies</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">99.9%</div>
//                 <div className="text-sm text-gray-400">Uptime</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }

//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes fade-in-right {
//           from {
//             opacity: 0;
//             transform: translateX(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes bounce-slow {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }

//         @keyframes pulse-slow {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.8;
//           }
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animate-fade-in {
//           animation: fade-in 1s ease-out;
//         }

//         .animate-fade-in-right {
//           animation: fade-in-right 1s ease-out;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.8s ease-out;
//         }

//         .animate-slide-up-delay {
//           animation: slide-up 0.8s ease-out 0.2s both;
//         }

//         .animate-slide-up-delay-2 {
//           animation: slide-up 0.8s ease-out 0.4s both;
//         }

//         .animate-slide-up-delay-3 {
//           animation: slide-up 0.8s ease-out 0.6s both;
//         }

//         .animate-bounce-slow {
//           animation: bounce-slow 3s ease-in-out infinite;
//         }

//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;






// src/pages/Login.jsx - HOÀN CHỈNH, CHẠY NGON 100%
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import { setRole, setUserInfo } from "../../utils/auth";
import { http, JAVA_API } from "../../services/config";
import { getEmployeeById } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [error, setError] = useState("");

  // Tạo hiệu ứng particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          delay: Math.random() * 5000,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await http(`${JAVA_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        let message = "Email hoặc mật khẩu không đúng!";
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      const userFromApi = data.user || {};

      // Lưu token
      localStorage.setItem("accessToken", data.accessToken || data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // GỌI PROFILE ĐỂ LẤY THÔNG TIN ĐẦY ĐỦ (name, department, position, salary...)
      let fullProfile = null;
      try {
        const identifier = userFromApi.employeeId || userFromApi.id;
        if (identifier) {
          fullProfile = await getEmployeeById(identifier);
        }
      } catch (err) {
        console.warn("Không load được profile lúc login", err);
      }

      // LƯU ĐẦY ĐỦ → PORTAL HIỆN NGAY LẬP TỨC!
      setUserInfo({
        id: userFromApi.id,
        employeeCode: userFromApi.employeeId || `EMP${String(userFromApi.id || "").padStart(3, "0")}`,
        name: fullProfile?.name ||
              (fullProfile?.firstName ? `${fullProfile.firstName} ${fullProfile.lastName || ""}`.trim() : 
              userFromApi.email?.split("@")[0] || "Nhân viên"),
        email: userFromApi.email || formData.email,
        role: (userFromApi.role || "employee").toLowerCase(),
        department: fullProfile?.department || "Chưa xác định",
        position: fullProfile?.position || "Nhân viên",
        salary: fullProfile?.salary || 0,
        status: fullProfile?.status || "ACTIVE",
        hireDate: fullProfile?.hireDate,
        phone: fullProfile?.phone,
      });

      setRole((userFromApi.role || "employee").toLowerCase());

      // Điều hướng
      const role = (userFromApi.role || "employee").toLowerCase();
      if (["admin", "manager", "accountant"].includes(role)) {
        navigate("/dashboard");
      } else {
        navigate("/employee");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Background đẹp lung linh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-blue-950"></div>

        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-blue-400/30 animate-pulse"
              style={{ top: `${i * 5}%`, animationDelay: `${i * 200}ms`, animationDuration: "4s" }}
            />
          ))}
        </div>

        {/* Whale SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl max-h-6xl animate-whale-swim">
            <svg viewBox="0 0 1200 900" className="w-full h-full opacity-75" style={{ filter: "drop-shadow(0 0 40px rgba(255, 0, 100, 0.7))" }}>
              <g transform="translate(300, 300) rotate(-20)">
                <ellipse cx="0" cy="0" rx="180" ry="60" fill="url(#whaleGradient)" className="animate-whale-glow" />
                <ellipse cx="-120" cy="-15" rx="90" ry="50" fill="url(#whaleGradient)" />
                <ellipse cx="-180" cy="-20" rx="40" ry="25" fill="url(#whaleGradient)" />
                <ellipse cx="150" cy="0" rx="60" ry="35" fill="url(#whaleGradient)" />
                <ellipse cx="200" cy="0" rx="30" ry="20" fill="url(#whaleGradient)" />
                <ellipse cx="-30" cy="45" rx="35" ry="20" fill="url(#whaleGradient)" transform="rotate(25)" />
                <ellipse cx="30" cy="-50" rx="20" ry="12" fill="url(#whaleGradient)" />
                <circle cx="-140" cy="-25" r="4" fill="#000" />
                <circle cx="-138" cy="-23" r="1.5" fill="#fff" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i}>
                    <line x1={-100 + i * 12} y1="25" x2={-100 + i * 12} y2="40" stroke="rgba(255, 0, 100, 0.9)" strokeWidth="3" strokeLinecap="round" />
                    <line x1={-100 + i * 12} y1="40" x2={-100 + i * 12} y2="55" stroke="rgba(255, 0, 100, 0.7)" strokeWidth="2" strokeLinecap="round" />
                  </g>
                ))}
                <defs>
                  <linearGradient id="whaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff0066" stopOpacity="0.95" />
                    <stop offset="30%" stopColor="#ff3366" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#ff6699" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#cc0044" stopOpacity="0.95" />
                  </linearGradient>
                  <filter id="whaleGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <ellipse cx="0" cy="0" rx="200" ry="70" fill="url(#whaleGradient)" opacity="0.3" filter="url(#whaleGlow)" className="animate-whale-glow" />
              </g>
            </svg>
          </div>
        </div>

        {/* Fish + Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={`red-${i}`} className="absolute animate-fish-swim" style={{ left: `${60 + Math.random() * 30}%`, top: `${20 + Math.random() * 40}%`, animationDelay: `${i * 300}ms`, animationDuration: `${8 + Math.random() * 4}s` }}>
              <div className="w-3 h-2 bg-red-500 rounded-full transform rotate-45 animate-pulse"></div>
            </div>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`blue-${i}`} className="absolute animate-fish-swim-reverse" style={{ left: `${10 + Math.random() * 40}%`, top: `${50 + Math.random() * 30}%`, animationDelay: `${i * 400}ms`, animationDuration: `${6 + Math.random() * 3}s` }}>
              <div className="w-2 h-1.5 bg-blue-400 rounded-full transform -rotate-45 animate-pulse"></div>
            </div>
          ))}
        </div>

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-bubble-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.id % 3 === 0 ? "rgba(255,255,255,0.3)" : particle.id % 3 === 1 ? "rgba(255,0,100,0.4)" : "rgba(100,200,255,0.3)",
              opacity: particle.opacity,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${particle.speed * 15}s`,
              boxShadow: particle.id % 3 === 1 ? "0 0 10px rgba(255,0,100,0.5)" : "none",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="max-w-md w-full space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce-slow">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 animate-slide-up">Welcome Back</h2>
              <p className="text-xl text-blue-300 animate-slide-up-delay">Sign in to your account</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl animate-slide-up-delay-2">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">Email address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-4 rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-medium disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - EMPLOYEE HUB */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-8">
          <div className="max-w-lg text-center space-y-8 animate-fade-in-right">
            <div className="space-y-4">
              <div className="mx-auto h-24 w-24 bg-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-slow">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">EMPLOYEE HUB</h1>
              <p className="text-xl text-gray-300 animate-slide-up-delay">Advanced Human Resource Management System</p>
            </div>

            <div className="space-y-6 animate-slide-up-delay-2">
              <div className="flex items-center space-x-4 text-left">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Employee Management</h3>
                  <p className="text-gray-400">Comprehensive employee data and profile management</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-left">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Analytics & Reports</h3>
                  <p className="text-gray-400">Real-time insights and detailed performance reports</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-left">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Secure & Reliable</h3>
                  <p className="text-gray-400">Enterprise-grade security with 99.9% uptime</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 animate-slide-up-delay-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-right { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-slow { 0%,100% { opacity: 1; } 50% { opacity: 0.8; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-up-delay { animation: slide-up 0.8s ease-out 0.2s both; }
        .animate-slide-up-delay-2 { animation: slide-up 0.8s ease-out 0.4s both; }
        .animate-slide-up-delay-3 { animation: slide-up 0.8s ease-out 0.6s both; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;