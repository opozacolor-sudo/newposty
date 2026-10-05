import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ChatStudio from "@/components/chat-studio";

export default async function ChatPage() {
  const t = await getTranslations("Nav");

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-hidden bg-white px-4 pb-2 pt-4 sm:pt-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3] sm:h-14 sm:w-14">
        <Mail size={22} strokeWidth={1.75} className="text-white" aria-hidden />
        <span className="sr-only">posty.now</span>
      </div>
      <h1 className="mt-2 text-center text-[15px] font-medium tracking-tight text-[#1d1d1f] sm:text-[17px]">
        {t("yourAssistant")}
      </h1>
      <div className="mt-3 flex min-h-0 w-full max-w-[54rem] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-[#f5f5f7] sm:mt-4">
        <ChatStudio />
      </div>
    </div>
  );
}
