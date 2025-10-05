import React, { useEffect, useState } from 'react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeeChat = () => {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fakeApi.getChatContacts();
      setContacts(res.data);
      if (res.data.length) {
        setSelected(res.data[0]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMsgs = async () => {
      if (!selected) return;
      const res = await fakeApi.getChatMessages(selected.id);
      setMessages(res.data);
    };
    loadMsgs();
  }, [selected]);

  const send = async () => {
    if (!input.trim() || !selected) return;
    const res = await fakeApi.sendMessage({ receiverId: selected.id, senderId: 'me', message: input });
    setMessages((m) => [...m, res.data]);
    setInput('');
  };

  return (
    <EmployeeLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 font-semibold">Liên hệ</div>
          <div className="max-h-[70vh] overflow-y-auto">
            {contacts.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 ${selected?.id===c.id?'bg-gray-50':''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">{c.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div>
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.lastMessage}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 font-semibold">{selected? selected.name : 'Chọn liên hệ'}</div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[70%] rounded-xl px-4 py-2 ${m.senderId==='me'?'ml-auto bg-purple-600 text-white':'bg-gray-100 text-gray-900'}`}>{m.message}</div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
            <button onClick={send} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Gửi</button>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeChat;


