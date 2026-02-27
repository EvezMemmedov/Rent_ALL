import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, Send, Trash2 } from "lucide-react";

const API = "http://127.0.0.1:5000/api";

export default function Messages() {
  const { userId } = useParams();
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverName, setReceiverName] = useState("Chat");
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        if (data.length > 0) {
          const other = data[0].sender_id === user?.id ? data[0].receiver : data[0].sender;
          setReceiverName(other?.name || "User");
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await fetch(`${API}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver_id: parseInt(userId!), content: newMessage }),
    });
    setNewMessage("");
    fetchMessages();
  };

  const deleteMessage = async (msgId: number) => {
    await fetch(`${API}/messages/${msgId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("az-AZ", { day: "numeric", month: "long" });
  };

  const groupedMessages = messages.reduce((acc: any, msg: any) => {
    const date = formatDate(msg.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
          {receiverName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{receiverName}</p>
          <p className="text-xs text-emerald-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {groupedMessages[date].map((msg: any) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                      {msg.sender?.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className={`group relative max-w-xs lg:max-w-md`}>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isMine
                          ? "bg-emerald-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
                      {isMine && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition p-0.5 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 mt-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Send className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-medium">Hələ mesaj yoxdur</p>
            <p className="text-sm">İlk mesajı sən göndər!</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Mesaj yaz..."
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-emerald-400 transition"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 transition flex items-center justify-center"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}