import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Mail, Phone, User, Search, Plus, Paperclip, Smile } from 'lucide-react';

const CommunicationHub = ({ candidates }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');

  // Mock conversation data
  const [conversations, setConversations] = useState([
    {
      candidateId: 1,
      candidateName: 'Nguyen Van A',
      lastMessage: 'Thank you for the interview opportunity. I look forward to hearing from you.',
      timestamp: '2025-01-24T10:30:00Z',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'candidate',
          content: 'Hello, I would like to inquire about the Senior Frontend Developer position.',
          timestamp: '2025-01-24T09:00:00Z'
        },
        {
          id: 2,
          sender: 'recruiter',
          content: 'Hi Nguyen, thank you for your interest! We would love to schedule an interview with you.',
          timestamp: '2025-01-24T09:15:00Z'
        },
        {
          id: 3,
          sender: 'candidate',
          content: 'Thank you for the interview opportunity. I look forward to hearing from you.',
          timestamp: '2025-01-24T10:30:00Z'
        }
      ]
    },
    {
      candidateId: 2,
      candidateName: 'Tran Thi B',
      lastMessage: 'Could we reschedule the interview to next week?',
      timestamp: '2025-01-24T14:20:00Z',
      unread: 1,
      messages: [
        {
          id: 1,
          sender: 'candidate',
          content: 'Hello, I received the interview invitation. Could we reschedule the interview to next week?',
          timestamp: '2025-01-24T14:20:00Z'
        }
      ]
    },
    {
      candidateId: 3,
      candidateName: 'Le Van C',
      lastMessage: 'I have completed the technical assessment.',
      timestamp: '2025-01-23T16:45:00Z',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'recruiter',
          content: 'Hi Le, please complete the technical assessment by tomorrow.',
          timestamp: '2025-01-23T14:00:00Z'
        },
        {
          id: 2,
          sender: 'candidate',
          content: 'I have completed the technical assessment.',
          timestamp: '2025-01-23T16:45:00Z'
        }
      ]
    }
  ]);

  // Message templates
  const templates = [
    {
      id: 1,
      name: 'Interview Invitation',
      subject: 'Interview Invitation - [Position]',
      content: 'Dear [Candidate Name],\n\nWe are pleased to invite you for an interview for the position of [Position]. The interview is scheduled for [Date] at [Time].\n\nPlease confirm your availability.\n\nBest regards,\nHR Team'
    },
    {
      id: 2,
      name: 'Application Acknowledgment',
      subject: 'Thank you for your application',
      content: 'Dear [Candidate Name],\n\nThank you for your interest in the [Position] role at our company. We have received your application and will review it carefully.\n\nWe will contact you within 5-7 business days.\n\nBest regards,\nRecruitment Team'
    },
    {
      id: 3,
      name: 'Rejection - Polite',
      subject: 'Update on your application',
      content: 'Dear [Candidate Name],\n\nThank you for your interest in joining our team. After careful consideration, we have decided to move forward with other candidates for this position.\n\nWe encourage you to apply for future openings that match your qualifications.\n\nBest regards,\nHR Team'
    }
  ];

  const filteredConversations = conversations?.filter(conv =>
    conv?.candidateName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date?.toLocaleDateString();
    }
  };

  const sendMessage = () => {
    if (!message?.trim() || !selectedCandidate) return;

    const newMessage = {
      id: Date.now(),
      sender: 'recruiter',
      content: message,
      timestamp: new Date()?.toISOString()
    };

    setConversations(prev => prev?.map(conv => {
      if (conv?.candidateId === selectedCandidate?.candidateId) {
        return {
          ...conv,
          messages: [...conv?.messages, newMessage],
          lastMessage: message,
          timestamp: newMessage?.timestamp
        };
      }
      return conv;
    }));

    setMessage('');
  };

  const useTemplate = (template) => {
    const candidate = candidates?.find(c => c?.id === selectedCandidate?.candidateId);
    if (candidate) {
      const filledTemplate = template?.content?.replace(/\[Candidate Name\]/g, candidate?.name)?.replace(/\[Position\]/g, candidate?.position)?.replace(/\[Date\]/g, 'TBD')?.replace(/\[Time\]/g, 'TBD');
      
      setMessage(filledTemplate);
      setMessageTemplate('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversation List */}
      <div className="bg-white rounded-lg shadow-sm border flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations?.map((conv) => (
            <motion.div
              key={conv?.candidateId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedCandidate?.candidateId === conv?.candidateId ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCandidate(conv)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conv?.candidateName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(conv?.timestamp)}
                      </span>
                      {conv?.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv?.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conv?.lastMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border flex flex-col">
        {selectedCandidate ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedCandidate?.candidateName}</h3>
                  <p className="text-sm text-gray-600">
                    {candidates?.find(c => c?.id === selectedCandidate?.candidateId)?.position}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedCandidate?.messages?.map((msg) => (
                <div
                  key={msg?.id}
                  className={`flex ${msg?.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg?.sender === 'recruiter' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg?.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg?.sender === 'recruiter' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg?.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Templates */}
            {messageTemplate && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Quick Templates</h4>
                  <button 
                    onClick={() => setMessageTemplate('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {templates?.map(template => (
                    <button
                      key={template?.id}
                      onClick={() => useTemplate(template)}
                      className="text-left p-2 text-sm bg-white rounded border hover:bg-gray-50"
                    >
                      {template?.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => setMessageTemplate(messageTemplate ? '' : 'show')}
                  className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                  title="Templates"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:bg-gray-100 p-1 rounded" title="Attach file">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:bg-gray-100 p-1 rounded" title="Emoji">
                  <Smile className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e?.target?.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  onKeyPress={(e) => {
                    if (e?.key === 'Enter' && !e?.shiftKey) {
                      e?.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message?.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a candidate to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;

