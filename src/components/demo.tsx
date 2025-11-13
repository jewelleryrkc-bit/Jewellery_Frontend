// // app/seller/messages/page.tsx
// "use client";

// import Footer from "@/components/Footer";
// import SearchBar from "@/components/SearchBar";
// import SellerBottomHeader from "@/components/SellerBottomHeader";
// import TopHeader from "@/components/TopHeader";
// import { SEND_MESSAGE, DELETE_SELLER_MESSAGES } from "@/graphql/mutations";
// import { GET_SELLER_CONVO, GET_CONVERSATION, ME_QUERY } from "@/graphql/queries";
// import { useQuery, useMutation } from "@apollo/client";
// import { useRef, useEffect, useState } from "react";

// interface Message {
//   id: string;
//   message: string;
//   senderType: string;
//   receiverType: string;
//   senderUser?: { id: string; name: string };
//   senderCompany?: { id: string; name: string };
//   receiverUser?: { id: string; name: string };
//   receiverCompany?: { id: string; name: string };
//   createdAt: string;
// }

// interface Conversation {
//   id: string;
//   user: { id: string; username: string };
//   company: { id: string; cname: string };
//   createdAt: string;
//   messages: Message[];
// }

// export default function SellerMessagesInbox() {
//   const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const conversationEndRef = useRef<HTMLDivElement | null>(null);
//   const [sellerId, setSellerId] = useState<string | null>(null);
//   const [activeFilter, setActiveFilter] = useState("inbox");
//   const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

//   // Get seller info
//   const { data: meData, loading: meLoading, error: meError } = useQuery(ME_QUERY);
  
//   // Get all conversations for the seller
//   const { data: conversationsData, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useQuery(GET_SELLER_CONVO, {
//     variables: { companyId: sellerId },
//     skip: !sellerId,
//     fetchPolicy: "network-only",
//   });

//   // Get messages for selected conversation
//   const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(GET_CONVERSATION, {
//     variables: { conversationId: selectedConversation },
//     skip: !selectedConversation,
//     fetchPolicy: "network-only",
//   });

//   const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);
//   const [deleteMessage, {}] = useMutation(DELETE_SELLER_MESSAGES);

//   // Set seller ID when meData is available
//   useEffect(() => {
//     if (meData?.me?.id) {
//       setSellerId(meData.me.id);
//     }
//   }, [meData]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesData]);


//   const handleSend = async () => {
//     if (!newMessage.trim() || !selectedConversation || !sellerId) return;
    
//     try {
//       // Find the selected conversation to get user ID
//       const conversation = conversationsData?.getAllConversationsForSeller.find(
//         (conv: Conversation) => conv.id === selectedConversation
//       );
      
//       if (!conversation) return;

//       await sendMessage({
//         variables: {
//           input: {
//             message: newMessage,
//             senderId: sellerId,
//             senderType: "COMPANY",
//             receiverId: conversation.user.id,
//             receiverType: "USER",
//           },
//         },
//       });
//       setNewMessage("");
//       await refetchMessages();
//       await refetchConversations();
//     } catch (err) {
//       console.error("sendMessage error", err);
//       alert("Failed to send message. Please try again.");
//     }
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   const getLastMessage = (conversation: Conversation) => {
//     if (!conversation.messages || conversation.messages.length === 0) {
//       return { message: "No messages yet", createdAt: conversation.createdAt };
//     }
//     const sortedMessages = [...conversation.messages].sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//     return sortedMessages[0];
//   };

//   const handleSelectConversation = (conversationId: string) => {
//     setSelectedConversation(conversationId);
//   };

//   const toggleConversationSelection = (conversationId: string) => {
//     if (selectedConversations.includes(conversationId)) {
//       setSelectedConversations(selectedConversations.filter(id => id !== conversationId));
//     } else {
//       setSelectedConversations([...selectedConversations, conversationId]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectedConversations.length === conversations.length) {
//       setSelectedConversations([]);
//     } else {
//       setSelectedConversations(conversations.map((conv: Conversation) => conv.id));
//     }
//   };

//   const conversations = conversationsData?.getAllConversationsForSeller || [];
  
//   // FIX: messagesData?.getConversation is a single conversation object, not an array
//   const selectedConversationData = messagesData?.getConversation;
//   const messages = selectedConversationData?.messages || [];

//   if (meLoading || conversationsLoading) {
//     return (
//       <>
//         <TopHeader />
//         <SearchBar onSellerSearch={() => {}} />
//         <SellerBottomHeader />
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Loading...</div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (meError) {
//     return (
//       <>
//         <TopHeader />
//         <SearchBar onSellerSearch={() => {}} />
//         <SellerBottomHeader />
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-red-500">Error loading your account information</div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <TopHeader />
//       <SearchBar onSellerSearch={() => {}} />
//       <SellerBottomHeader />
      
//       <div className="container mx-auto px-4 py-6">
//         <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
//         <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Sidebar with filters - Reduced padding to shift left */}
//           <div className="w-full md:w-1/4 border-r border-gray-200 bg-gray-50">
//             <div className="p-3 border-b border-gray-200">
//               <h2 className="font-semibold">Filters</h2>
//             </div>
//             <div className="p-2">
//               <ul className="space-y-1">
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "inbox" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("inbox")}
//                   >
//                     Inbox
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "buyers" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("buyers")}
//                   >
//                     Buyers
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "unread" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("unread")}
//                   >
//                     Unread
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "sent" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("sent")}
//                   >
//                     Sent
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "deleted" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("deleted")}
//                   >
//                     Deleted
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "archived" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("archived")}
//                   >
//                     Archived
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className={`w-full text-left px-2 py-2 rounded-md ${
//                       activeFilter === "jewelryworld" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
//                     }`}
//                     onClick={() => setActiveFilter("jewelryworld")}
//                   >
//                     From JewelryWorld
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
          
//           {/* Conversation List */}
//           <div className="w-full md:w-1/3 border-r border-gray-200">
//             <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//               <h2 className="font-semibold">All Conversations</h2>
//               {conversations.length > 0 && (
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedConversations.length === conversations.length}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 text-blue-600 rounded"
//                   />
//                   <span className="ml-2 text-sm text-gray-600">Select all</span>
//                 </div>
//               )}
//             </div>
//             <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
//               {conversationsError ? (
//                 <div className="p-4 text-red-500">
//                   Error loading conversations
//                 </div>
//               ) : conversations.length === 0 ? (
//                 <div className="p-4 text-gray-500">
//                   No conversations yet
//                 </div>
//               ) : (
//                 conversations.map((conversation: Conversation) => {
//                   const lastMessage = getLastMessage(conversation);
//                   return (
//                     <div 
//                       key={conversation.id}
//                       className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
//                         selectedConversation === conversation.id ? 'bg-blue-50' : ''
//                       }`}
//                       onClick={() => handleSelectConversation(conversation.id)}
//                     >
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedConversations.includes(conversation.id)}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             toggleConversationSelection(conversation.id);
//                           }}
//                           className="h-4 w-4 text-blue-600 rounded mr-3"
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                         <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
//                           <span className="text-gray-600">
//                             {conversation.user.username.charAt(0)}
//                           </span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-center">
//                             <p className="text-sm font-medium text-gray-900 truncate">
//                               {conversation.user.username}
//                             </p>
//                             <span className="text-xs text-gray-500">
//                               {formatDate(lastMessage.createdAt)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center mt-1">
//                             <p className="text-sm text-gray-500 truncate">
//                               {lastMessage.message}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
            
//             {/* Bulk actions for selected conversations */}
//             {selectedConversations.length > 0 && (
//               <div className="p-4 border-t border-gray-200 bg-gray-50">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">
//                     {selectedConversations.length} selected
//                   </span>
//                   <button className="text-sm text-blue-600 hover:text-blue-800">
//                     Archive
//                   </button>
//                   <button className="text-sm text-blue-600 hover:text-blue-800">
//                     Mark as read
//                   </button>
//                   <button className="text-sm text-red-600 hover:text-red-800">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Message View */}
//           <div className="w-full md:w-2/3 flex flex-col">
//             {!selectedConversation ? (
//               <div className="flex-1 flex items-center justify-center bg-gray-50">
//                 <p className="text-gray-500">Select a conversation to start messaging</p>
//               </div>
//             ) : messagesLoading ? (
//               <div className="flex-1 flex items-center justify-center bg-gray-50">
//                 <p className="text-gray-500">Loading messages...</p>
//               </div>
//             ) : messagesError ? (
//               <div className="flex-1 flex items-center justify-center bg-gray-50">
//                 <p className="text-red-500">Error loading messages</p>
//               </div>
//             ) : (
//               <>
//                 <div className="p-4 border-b border-gray-200">
//                   <h2 className="font-semibold">
//                     {selectedConversationData?.user?.username || "Unknown User"}
//                   </h2>
//                 </div>
                
//                 <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: '50vh' }}>
//                   {messages.length === 0 ? (
//                     <div className="flex items-center justify-center h-full">
//                       <p className="text-gray-500">No messages yet</p>
//                     </div>
//                   ) : (
//                     messages.map((message: Message) => {
//                       const isSeller = message.senderType === 'COMPANY';
//                       return (
//                         <div 
//                           key={message.id} 
//                           className={`mb-4 flex ${isSeller ? 'justify-end' : 'justify-start'}`}
//                         >
//                           <div 
//                             className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
//                               isSeller
//                                 ? 'bg-blue-500 text-white' 
//                                 : 'bg-white border border-gray-200'
//                             }`}
//                           >
//                             <p>{message.message}</p>
//                             <p className={`text-xs mt-1 ${
//                               isSeller ? 'text-blue-100' : 'text-gray-500'
//                             }`}>
//                               {formatTime(message.createdAt)}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                   <div ref={conversationEndRef} />
//                 </div>
                
//                 <div className="p-4 border-t border-gray-200">
//                   <div className="flex">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder="Type your message..."
//                       className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') handleSend();
//                       }}
//                       disabled={sending}
//                     />
//                     <button
//                       onClick={handleSend}
//                       className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
//                       disabled={sending || !newMessage.trim()}
//                     >
//                       {sending ? "Sending..." : "Send"}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }