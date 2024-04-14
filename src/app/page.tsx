import Sidebar from "@/components/ui/Sidebar";
import Chats from "@/components/chat/Chats";
import SendMessage from "@/components/chat/SendMessage";

export default function Home() {
  return (
    <>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          {/* sidebar */}
          <Sidebar />
          <div className="flex flex-col flex-auto h-full sm:p-6 p-0">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full sm:p-4 p-2">
              {/* Chats */}
              <Chats />

              {/* Send Message */}
              <SendMessage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
