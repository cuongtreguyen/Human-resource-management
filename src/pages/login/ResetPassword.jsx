import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Mail, Key } from "lucide-react";
import { http, JAVA_API } from "../../services/config";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validatePassword = (password) => {
    // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
      errors: {
        minLength: !minLength ? "Mật khẩu phải có ít nhất 8 ký tự" : "",
        hasUpperCase: !hasUpperCase ? "Mật khẩu phải có ít nhất 1 chữ hoa" : "",
        hasLowerCase: !hasLowerCase ? "Mật khẩu phải có ít nhất 1 chữ thường" : "",
        hasNumber: !hasNumber ? "Mật khẩu phải có ít nhất 1 số" : "",
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      const errorMessages = Object.values(passwordValidation.errors).filter((msg) => msg);
      setError(errorMessages.join(", "));
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Validate email
    if (!formData.email || !formData.email.trim()) {
      setError("Vui lòng nhập email!");
      return;
    }

    // Validate OTP
    if (!formData.otp || !formData.otp.trim()) {
      setError("Vui lòng nhập mã OTP!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await http(`${JAVA_API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
          newPassword: formData.password,
        }),
      });

      if (!response.ok) {
        let message = "Không thể đặt lại mật khẩu. Vui lòng thử lại!";
        try {
          const errorBody = await response.json();
          if (errorBody?.message) {
            message = errorBody.message;
          } else if (errorBody?.error) {
            // Handle specific error codes from API
            const errorCode = errorBody.error;
            if (errorCode.includes("OTP_NOT_FOUND") || errorCode.includes("OTP_EXPIRED") || errorCode.includes("INVALID_OTP")) {
              message = "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu mã OTP mới.";
            } else if (errorCode.includes("USER_NOT_FOUND")) {
              message = "Email không tồn tại trong hệ thống.";
            } else {
              message = errorCode;
            }
          }
        } catch {}
        throw new Error(message);
      }

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce-slow">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              Đặt lại mật khẩu
            </h2>
            <p className="text-xl text-blue-300 animate-slide-up-delay">
              Nhập email, mã OTP và mật khẩu mới
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-slide-up-delay-2">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Đặt lại mật khẩu thành công!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Mật khẩu của bạn đã được thay đổi thành công.
                  </p>
                  <p className="text-sm text-gray-500">
                    Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  Đi đến đăng nhập ngay
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập email của bạn"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Email bạn đã dùng để yêu cầu đặt lại mật khẩu
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    Mã OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="otp"
                      type="text"
                      required
                      maxLength={6}
                      pattern="[0-9]*"
                      className="w-full pl-10 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      value={formData.otp}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Nhập mã OTP 6 chữ số đã được gửi đến email của bạn
                  </p>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Chưa nhận được mã? Gửi lại mã OTP
                  </Link>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu mới"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập lại mật khẩu mới"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
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
                  className="w-full py-4 px-4 rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;

