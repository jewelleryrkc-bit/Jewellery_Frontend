// app/buyer/messages/page.tsx
"use client";

import Footer from "@/components/Footer";
import BottomHeader from "@/components/BottomHeader";
import MiddleHeader from "@/components/MiddleHeader";
import TopHeader from "@/components/TopHeader";
import { SEND_MESSAGE } from "@/graphql/mutations";
import { GET_USER_CONVO, GET_CONVERSATION, WE_QUERY } from "@/graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useRef, useEffect, useState } from "react";
import { Search, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  message: string;
  senderType: string;
  receiverType: string;
  senderUser?: { id: string; name: string };
  senderCompany?: { id: string; name: string; cname?: string };
  receiverUser?: { id: string; name: string };
  receiverCompany?: { id: string; name: string; cname?: string };
  createdAt: string;
}

interface Conversation {
  id: string;
  user: { id: string; username: string; name?: string };
  company: { id: string; cname: string; name?: string };
  createdAt: string;
  messages: Message[];
}

export default function BuyerMessages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const [buyerId, setBuyerId] = useState<string | null>(null);

  // Get buyer info
  const { data: weData, loading: meLoading, error: meError } = useQuery(WE_QUERY);
  
  // Get all conversations for the buyer
  const { data: conversationsData, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useQuery(GET_USER_CONVO, {
    variables: { userId: buyerId },
    skip: !buyerId,
    fetchPolicy: "network-only",
  });

  // Get messages for selected conversation
  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(GET_CONVERSATION, {
    variables: { conversationId: selectedConversation },
    skip: !selectedConversation,
    fetchPolicy: "network-only",
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);

  // Set buyer ID when meData is available
  useEffect(() => {
    if (weData?.we?.id) {
      setBuyerId(weData.we.id);
    }
  }, [weData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation || !buyerId) return;
    
    try {
      // Find the selected conversation to get company ID
      const conversation = conversationsData?.getAllConversationsForUser.find(
        (conv: Conversation) => conv.id === selectedConversation
      );
      
      if (!conversation) return;

      await sendMessage({
        variables: {
          input: {
            message: newMessage,
            senderId: buyerId,
            senderType: "USER",
            receiverId: conversation.company.id,
            receiverType: "COMPANY",
          },
        },
      });
      setNewMessage("");
      await refetchMessages();
      await refetchConversations();
    } catch (err) {
      console.error("sendMessage error", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getLastMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return { message: "No messages yet", createdAt: conversation.createdAt };
    }
    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedMessages[0];
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  // Filter conversations based on search query
  const filteredConversations = conversationsData?.getAllConversationsForUser?.filter((conversation: Conversation) => {
    if (!searchQuery.trim()) return true;
    
    const sellerName = conversation.company.cname || "";
    return sellerName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  // const conversations = conversationsData?.getAllConversationsForUser || [];
  const selectedConversationData = messagesData?.getConversation;
  const messages = selectedConversationData?.messages || [];

  if (meLoading || conversationsLoading) {
    return (
      <>
        <TopHeader />
        <MiddleHeader />
        <BottomHeader />
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading messages...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (meError) {
    return (
      <>
        <TopHeader />
        <MiddleHeader />
        <BottomHeader />
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-red-500">Error loading your account information</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopHeader />
      <MiddleHeader />
      <BottomHeader />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Messages</h1>
        
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
          {/* Conversation List */}
          <div className="w-full md:w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold mb-3">Your Conversations</h2>
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by seller name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {conversationsError ? (
                <div className="p-4 text-red-500">
                  Error loading conversations
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? (
                    <div>
                      <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p>No sellers found matching &quot;{searchQuery}&quot;</p>
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="text-blue-500 hover:text-blue-600 mt-2 text-sm"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div>
                      <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p>No conversations yet.</p>
                      <p className="text-sm">Start a conversation with a seller!</p>
                    </div>
                  )}
                </div>
              ) : (
                filteredConversations.map((conversation: Conversation) => {
                  const lastMessage = getLastMessage(conversation);
                  return (
                    <div 
                      key={conversation.id}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">
                            {conversation.company.cname?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.company.cname || "Seller"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(lastMessage.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Message View */}
          <div className="w-full md:w-2/3 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            ) : messagesLoading ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messagesError ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-red-500">Error loading messages</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-medium">
                      {selectedConversationData?.company?.cname?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <h2 className="font-semibold">
                    {selectedConversationData?.company?.cname || "Seller"}
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: '50vh' }}>
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message: Message) => {
                      const isBuyer = message.senderType === 'USER';
                      return (
                        <div 
                          key={message.id} 
                          className={`mb-4 flex ${isBuyer ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                              isBuyer
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <p>{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              isBuyer ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={conversationEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSend();
                      }}
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}