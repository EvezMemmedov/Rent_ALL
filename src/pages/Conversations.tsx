import { Link } from 'react-router-dom';
import { MessageCircle, User } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useConversations } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function Conversations() {
  const { data: messages, isLoading } = useConversations();
  const { user } = useAuthStore();

  // Mesajları unique conversation-lara group et
  const conversations = messages?.reduce((acc: any[], msg: any) => {
    const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
    const existing = acc.find((c) => c.otherUserId === otherUserId);

    if (!existing) {
      acc.push({
        otherUserId,
        otherUserName: msg.sender_id === user?.id ? msg.receiver?.name : msg.sender?.name,
        lastMessage: msg.content,
        lastMessageTime: msg.created_at,
        isUnread: msg.receiver_id === user?.id && !msg.is_read,
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="page-container max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-16">Yüklənir...</p>
          ) : conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv: any) => (
                <Link
                  key={conv.otherUserId}
                  to={`/messages/${conv.otherUserId}`}
                  className="block card-static p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {conv.otherUserName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{conv.otherUserName}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conv.isUnread ? 'font-semibold' : 'text-muted-foreground'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.isUnread && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-muted-foreground">Start a conversation from an item page</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}