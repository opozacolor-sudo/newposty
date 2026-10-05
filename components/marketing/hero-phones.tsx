export function HeroPhones() {
  return (
    <div className="flex h-full min-h-0 w-full items-end justify-center gap-2 sm:gap-3" aria-hidden>
      <PhoneFront />
      <PhoneEdge color="#1E4B7B" highlight="#4A7DB3" />
      <PhoneEdge color="#E36B2C" highlight="#F4A574" />
      <PhoneEdge color="#D8D4CC" highlight="#F4F1EA" />
      <PhoneEdge color="#1A1A1C" highlight="#4A4A4E" />
    </div>
  );
}

function PhoneFront() {
  return (
    <div className="relative h-[min(36vh,19rem)] aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-neutral-950 shadow-[0_18px_40px_rgba(0,0,0,0.22)] ring-1 ring-black/20">
      <div className="absolute inset-[5px] overflow-hidden rounded-[1.3rem] bg-[#111]">
        <div className="absolute left-1/2 top-1.5 h-3.5 w-16 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex h-full flex-col bg-gradient-to-b from-[#1a1a1a] to-[#0c0c0c] px-2.5 pb-3 pt-6">
          <p className="text-center text-[8px] font-semibold tracking-tight text-[#E4EEF0]">posty.now</p>
          <div className="mt-2 rounded-xl bg-[#FF5B04] px-2 py-2">
            <p className="text-[7px] font-medium uppercase tracking-wide text-white/80">Instagram · TikTok</p>
            <p className="mt-0.5 text-[9px] font-semibold leading-3 text-white">Carousel · 18:00</p>
          </div>
          <div className="mt-2 min-h-0 flex-1 rounded-xl bg-[#2a2a2a]" />
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function PhoneEdge({ color, highlight }: { color: string; highlight: string }) {
  return (
    <div
      className="relative h-[min(36vh,19rem)] w-[13px] overflow-hidden rounded-full shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:w-[15px]"
      style={{
        background: `linear-gradient(90deg, #0a0a0a 0%, ${color} 22%, ${highlight} 50%, ${color} 78%, #0a0a0a 100%)`,
      }}
    >
      <span className="absolute left-1/2 top-[18%] h-8 w-[7px] -translate-x-1/2 rounded-full bg-black/35" />
      <span className="absolute left-0 top-[38%] h-6 w-[2px] rounded-r-full bg-black/40" />
    </div>
  );
}
