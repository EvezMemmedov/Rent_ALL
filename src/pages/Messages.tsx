import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const API = "http://127.0.0.1:5000/api";

export default function Messages() {
  const { userId } = useParams();
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    const res = await fetch(`${API}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
    if (data.length > 0) {
      const other = data[0].sender_id === user.id ? data[0].receiver : data[0].sender;
      setReceiverName(other?.name || "User");
    }
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
      body: JSON.stringify({ receiver_id: parseInt(userId), content: newMessage }),
    });
    setNewMessage("");
    fetchMessages();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b pb-3">
        <Button variant="ghost" onClick={() => navigate(-1)}>←</Button>
        <h2 className="text-xl font-semibold">{receiverName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                msg.sender_id === user?.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Mesaj yaz..."
        />
        <Button onClick={sendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}