/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SellerbottomHeader from "@/components/SellerBottomHeader";
import TopHeader from "@/components/TopHeader";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CAMPAIGN, SEND_CAMPAIGN } from "../../../../graphql/mutations";
import { GET_CAMPAIGNS } from "../../../../graphql/queries";
import LoadingPage from "@/components/LoadingPage";

export default function Newsletter() {
  const [active, setActive] = useState("Store newsletter");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // GraphQL operations
  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });
  
  const [sendCampaign] = useMutation(SEND_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });
  
  const { data, loading, error } = useQuery(GET_CAMPAIGNS);
  
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "Promotional",
    subject: "",
    content: "",
    recipients: "All followers",
    schedule: "Immediately",
    scheduledDate: "",
    scheduledTime: ""
  });

  const sidebarItems = [
    "Edit store",
    "Store categories",
    "Store traffic",
    "Store newsletter",
    "Promote your store",
    "Social",
    "Manage subscription",
  ];

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleCreateCampaign = async () => {
    try {
      // Format the schedule
      let scheduleValue = newCampaign.schedule;
      if (newCampaign.schedule === "Scheduled" && newCampaign.scheduledDate && newCampaign.scheduledTime) {
        scheduleValue = `${newCampaign.scheduledDate}T${newCampaign.scheduledTime}`;
      }
      
      await createCampaign({
        variables: {
          name: newCampaign.name || `${newCampaign.type} Campaign`,
          type: newCampaign.type,
          subject: newCampaign.subject,
          content: newCampaign.content,
          schedule: scheduleValue,
        },
      });
      
      setShowCreateModal(false);
      setNewCampaign({
        name: "",
        type: "Promotional",
        subject: "",
        content: "",
        recipients: "All followers",
        schedule: "Immediately",
        scheduledDate: "",
        scheduledTime: ""
      });
      
      showNotification("Campaign created successfully!", "success");
    } catch (error) {
      console.error("Error creating campaign:", error);
      showNotification("Failed to create campaign. Please try again.", "error");
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await sendCampaign({
        variables: {
          campaignId,
        },
      });
      
      showNotification("Campaign sent successfully!", "success");
    } catch (error) {
      console.error("Error sending campaign:", error);
      showNotification("Failed to send campaign. Please try again.", "error");
    }
  };

  // Format campaigns from API response
  const formatCampaigns = (campaigns: any[]) => {
    return campaigns.map(campaign => ({
      id: campaign.id,
      action: "Edit",
      type: campaign.type,
      subject: campaign.subject,
      status: campaign.status,
      recipients: Array.isArray(campaign.recipients) 
        ? `${campaign.recipients.length} recipients` 
        : campaign.recipients || "All followers",
      created: new Date(campaign.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: '2-digit' 
      }),
      lastSent: campaign.lastSent 
        ? new Date(campaign.lastSent).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: '2-digit' 
          })
        : "-",
      schedule: campaign.schedule
    }));
  };

  const campaigns = data?.getCampaigns ? formatCampaigns(data.getCampaigns) : [];

  if (loading) return <div> <LoadingPage/></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>;

  return (
    <>
      <TopHeader />
      <SearchBar
        onSellerSearch={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <SellerbottomHeader />

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="flex min-h-screen mt-8">
        {/* Mobile Sidebar Toggle Button */}
        {/* <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="md:hidden fixed top-24 left-4 z-50 bg-black text-white p-2 rounded-md"
        >
          {showMobileSidebar ? 'Hide Menu' : 'Show Menu'}
        </button> */}

        {/* Sidebar */}
        <aside className={`w-64 bg-gray-50 p-6 fixed md:static inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto overflow-y-auto`}>
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <li
                key={item}
                onClick={() => {
                  setActive(item);
                  setShowMobileSidebar(false);
                }}
                className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-gray-200 ${
                  active === item ? "bg-black text-white" : "text-gray-700"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10">Store newsletter</h1>

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mb-8 md:mb-12">
            <div className="rounded-xl border bg-white p-5 md:p-7 shadow-sm">
              <h2 className="font-semibold text-base md:text-lg mb-3">Campaigns nurture conversion</h2>
              <p className="text-xs md:text-sm text-gray-600">
                Shorten sales cycle and drive new sales to your listings
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 md:p-7 shadow-sm">
              <h2 className="font-semibold text-base md:text-lg mb-3">Loyalty brings repeat purchases</h2>
              <p className="text-xs md:text-sm text-gray-600">
                Buyer loyalty increases incrementally with every touchpoint
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 md:p-7 shadow-sm">
              <h2 className="font-semibold text-base md:text-lg mb-3">Customer relationships are key</h2>
              <p className="text-xs md:text-sm text-gray-600">
                Build a community of loyal customers by adding a human touch
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Your summary</h2>
            <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8">
              May 14, 2025 – Aug 12, 2025
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
              <div className="rounded-xl border bg-white p-5 md:p-7 text-center shadow-sm">
                <p className="text-2xl md:text-3xl font-bold mb-3">1,967</p>
                <p className="text-xs md:text-sm text-gray-600">Total reach</p>
              </div>
              <div className="rounded-xl border bg-white p-5 md:p-7 text-center shadow-sm">
                <p className="text-2xl md:text-3xl font-bold mb-3">34.93%</p>
                <p className="text-xs md:text-sm text-gray-600">Open rate</p>
              </div>
              <div className="rounded-xl border bg-white p-5 md:p-7 text-center shadow-sm">
                <p className="text-2xl md:text-3xl font-bold mb-3">2.64%</p>
                <p className="text-xs md:text-sm text-gray-600">Click through rate</p>
              </div>
            </div>
          </div>

          {/* Campaigns */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold">Campaigns</h2>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="rounded-lg bg-black px-5 py-2.5 md:px-7 md:py-3.5 text-white hover:bg-gray-800 text-sm font-medium w-full sm:w-auto"
              >
                Create campaign
              </button>
            </div>

            <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 md:p-5">Action</th>
                    <th className="p-3 md:p-5 hidden sm:table-cell">Campaign type</th>
                    <th className="p-3 md:p-5">Subject line</th>
                    <th className="p-3 md:p-5 hidden md:table-cell">Status</th>
                    <th className="p-3 md:p-5 hidden lg:table-cell">Recipients</th>
                    <th className="p-3 md:p-5 hidden xl:table-cell">Date created</th>
                    <th className="p-3 md:p-5 hidden xl:table-cell">Date last sent</th>
                    <th className="p-3 md:p-5 hidden xl:table-cell">Schedule delivery</th>
                    <th className="p-3 md:p-5">Send</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-t">
                      <td className="p-3 md:p-5">
                        <button className="text-blue-600 hover:underline text-xs md:text-sm">
                          {campaign.action}
                        </button>
                      </td>
                      <td className="p-3 md:p-5 hidden sm:table-cell text-xs md:text-sm">{campaign.type}</td>
                      <td className="p-3 md:p-5 text-xs md:text-sm">{campaign.subject}</td>
                      <td className={`p-3 md:p-5 hidden md:table-cell text-xs md:text-sm ${
                        campaign.status === "Sent" ? "text-green-600" : 
                        campaign.status === "Error" ? "text-red-500" : 
                        "text-yellow-600"
                      }`}>
                        {campaign.status}
                      </td>
                      <td className="p-3 md:p-5 hidden lg:table-cell text-xs md:text-sm">{campaign.recipients}</td>
                      <td className="p-3 md:p-5 hidden xl:table-cell text-xs md:text-sm">{campaign.created}</td>
                      <td className="p-3 md:p-5 hidden xl:table-cell text-xs md:text-sm">{campaign.lastSent}</td>
                      <td className="p-3 md:p-5 hidden xl:table-cell text-xs md:text-sm">{campaign.schedule}</td>
                      <td className="p-3 md:p-5">
                        {campaign.status !== "Sent" && (
                          <button 
                            onClick={() => handleSendCampaign(campaign.id)}
                            className="text-blue-600 hover:underline text-xs md:text-sm"
                          >
                            Send
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Create Campaign Modal - eBay Style */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Create a new campaign</h2>
            </div>
            
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              <div>
                <label className="block text-sm font-medium mb-2 md:mb-3 text-gray-700">Campaign Name</label>
                <input 
                  type="text" 
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 md:mb-3 text-gray-700">Campaign Type</label>
                <select 
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Promotional">Promotional</option>
                  <option value="Sale event">Sale event</option>
                  <option value="New arrivals">New arrivals</option>
                  <option value="Order discount">Order discount</option>
                  <option value="Coupon">Coupon</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 md:mb-3 text-gray-700">Subject Line</label>
                <input 
                  type="text" 
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subject line"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 md:mb-3 text-gray-700">Email Content</label>
                <textarea 
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg min-h-[150px] md:min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your email content here..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 md:mb-3 text-gray-700">Schedule</label>
                <select 
                  value={newCampaign.schedule}
                  onChange={(e) => setNewCampaign({...newCampaign, schedule: e.target.value})}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg mb-3 md:mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Immediately">Send immediately</option>
                  <option value="Scheduled">Schedule for later</option>
                </select>
                
                {newCampaign.schedule === "Scheduled" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-600">Date</label>
                      <input 
                        type="date" 
                        value={newCampaign.scheduledDate}
                        onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-600">Time</label>
                      <input 
                        type="time" 
                        value={newCampaign.scheduledTime}
                        onChange={(e) => setNewCampaign({...newCampaign, scheduledTime: e.target.value})}
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateCampaign}
                className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium order-1 sm:order-2"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}