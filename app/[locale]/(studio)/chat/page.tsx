import ChatStudio from "@/components/chat-studio";

export default function ChatPage() {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 pb-1 pt-1 sm:px-5 sm:pb-2 sm:pt-2">
      <div className="posty-clay-card-wrap mx-auto flex min-h-0 w-full max-w-[min(52rem,100%)] flex-1 flex-col">
        <div className="posty-clay-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
          <div className="relative z-[3] flex min-h-0 flex-1 flex-col">
            <ChatStudio />
          </div>
        </div>
      </div>
    </div>
  );
}
