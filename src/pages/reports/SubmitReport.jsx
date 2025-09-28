import React, { useState } from "react";
import Icon from "../../components/AppIcon";

export default function SubmitReport() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("📩 Báo cáo đã được gửi thành công!");
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Icon name="FilePlus" size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Gửi báo cáo mới</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-soft p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nội dung</label>
          <textarea
            name="description"
            rows="6"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
        >
          Gửi báo cáo
        </button>
      </form>
    </div>
  );
}
