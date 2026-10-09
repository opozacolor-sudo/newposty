import ChatStudio from "@/components/chat-studio";

export default function ChatPage() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#b7b6b3] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:py-3">
      <div className="posty-clay-card-wrap mx-auto flex min-h-0 w-full max-w-[54rem] flex-1 flex-col">
        <div className="posty-clay-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
          <div className="relative z-[3] flex min-h-0 flex-1 flex-col">
            <ChatStudio />
          </div>
        </div>
      </div>
    </div>
  );
}
