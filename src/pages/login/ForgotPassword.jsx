import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Users, Shield } from "lucide-react";
import { http, JAVA_API } from "../../services/config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await http(`${JAVA_API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let message = "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại!";
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {}
        throw new Error(message);
      }

      setSuccess(true);
    } catch (err) {
      console.error("Forgot password error:", err);
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
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              Quên mật khẩu?
            </h2>
            <p className="text-xl text-blue-300 animate-slide-up-delay">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-slide-up-delay-2">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email đã được gửi!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn trong email.
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Nếu bạn đã có link reset password từ email, bạn có thể{" "}
                    <Link to="/reset-password" className="text-purple-600 hover:text-purple-700 font-medium underline">
                      click vào đây để đặt lại mật khẩu
                    </Link>
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                      Đang gửi...
                    </div>
                  ) : (
                    "Gửi link đặt lại mật khẩu"
                  )}
                </button>

                <div className="text-center space-y-3">
                  <div>
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại đăng nhập
                    </Link>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Đã có link reset password từ email?{" "}
                    <Link to="/reset-password" className="text-purple-600 hover:text-purple-700 font-medium underline">
                      Đặt lại mật khẩu ngay
                    </Link>
                  </div>
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

export default ForgotPassword;

