import { useState } from "react";
import { Menu, X, Plus, MessageSquare, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RecentChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: "Understanding AI concepts" },
    { id: 2, title: "Project brainstorming" },
    { id: 3, title: "Code review help" }
  ]);

  return (
    <div className="relative h-full">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden absolute top-4 left-4 text-gray-600 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white text-gray-800 flex flex-col transition-transform transform md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:flex h-full border-r border-gray-200`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200">
          <Button className="w-full gap-2">
            <Plus size={16} />
            New Chat
          </Button>
        </div>

        {/* Recent Chats List */}
        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="px-2 py-2 text-sm font-medium text-gray-500">Recent Chats</h3>
          <ul className="space-y-1">
            {chats.map(chat => (
              <li key={chat.id}>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="truncate">{chat.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings size={16} />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HelpCircle size={16} />
            Help & FAQ
          </Button>

          <Link to="/" className="block mt-4">
            <Button variant="outline" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentChat;