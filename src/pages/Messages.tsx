import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useConversation, useSendMessage } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function Messages() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { data: messages, isLoading } = useConversation(userId!);
  const sendMessage = useSendMessage();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !userId) return;

    sendMessage.mutate(
      {
        receiver_id: parseInt(userId),
        content: newMessage.trim(),
      },
      {
        onSuccess: () => {
          setNewMessage('');
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUserName = messages?.[0]?.sender_id === user?.id
    ? messages?.[0]?.receiver?.name
    : messages?.[0]?.sender?.name;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <div className="page-container max-w-4xl flex-1 flex flex-col py-4">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-border mb-4">
            <Link to="/messages" className="p-2 hover:bg-muted rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {otherUserName?.charAt(0) || '?'}
              </div>
              <h2 className="font-semibold">{otherUserName || 'Loading...'}</h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Yüklənir...</p>
            ) : messages && messages.length > 0 ? (
              <>
                {messages.map((msg: any) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                          }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                        >
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No messages yet. Start the conversation!
              </p>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="input-field flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || sendMessage.isPending}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}