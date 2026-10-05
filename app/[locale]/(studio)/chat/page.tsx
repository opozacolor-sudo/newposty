import { getTranslations } from "next-intl/server";
import ChatStudio from "@/components/chat-studio";

export default async function ChatPage() {
  const t = await getTranslations("Nav");

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-hidden bg-white px-4 pb-3 pt-7 sm:pt-9">
      <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#0071e3] text-[11px] font-semibold tracking-tight text-white sm:h-20 sm:w-20 sm:text-[12px]">
        posty.now
      </div>
      <h1 className="mt-4 max-w-xl text-center text-[clamp(1.55rem,3.6vw,2.4rem)] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:mt-5">
        {t("yourAssistant")}
      </h1>
      <div className="mt-6 flex min-h-0 w-full max-w-[46rem] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-[#f5f5f7] sm:mt-8">
        <ChatStudio />
      </div>
    </div>
  );
}
