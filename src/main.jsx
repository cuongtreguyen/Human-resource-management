// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./styles/index.css";

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(<App />);

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container);

// QUAN TRỌNG: ToastContainer phải nằm trong root.render và ở cuối cùng
root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);