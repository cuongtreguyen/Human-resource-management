// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./styles/index.css";

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(<App />);

import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/index.css";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Cấu hình React Query với caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data "fresh" trong 5 phút
      gcTime: 10 * 60 * 1000, // Cache giữ trong 10 phút
      refetchOnWindowFocus: true, // Refetch khi quay lại tab
      retry: 2, // Retry 2 lần nếu lỗi
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

// QUAN TRỌNG: ToastContainer phải nằm trong root.render và ở cuối cùng
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Đây là cái quyết định toast có hiện hay không */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  </React.StrictMode>
);