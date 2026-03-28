"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: "Nasıl başlarım?",
    answer: "Size uygun paketi seçtikten sonra kayıt formunu doldurmanız yeterli. Koçunuz en kısa sürede sizinle iletişime geçecek ve kişisel programınızı hazırlayacaktır.",
  },
  {
    question: "Programlar ne kadar sürer?",
    answer: "Program süreleri paketlere göre değişmekle birlikte, genellikle 4 ila 24 hafta arasında planlanır. Hedeflerinize ve mevcut durumunuza göre koçunuz en uygun süreyi belirleyecektir.",
  },
  {
    question: "Online mı yoksa yüz yüze mi?",
    answer: "Tüm programlarımız online olarak yürütülmektedir. Uygulama üzerinden antrenman programınızı, beslenme planınızı ve ilerlemenizi takip edebilirsiniz. Koçunuzla mesajlaşma ile iletişim kurarsınız.",
  },
  {
    question: "Check-in nedir ve nasıl yapılır?",
    answer: "Check-in, haftalık ilerleme raporunuzdur. Ölçümlerinizi, fotoğraflarınızı ve genel durumunuzu paylaşırsınız. Koçunuz bu verilere göre programınızı günceller ve geri bildirim verir.",
  },
  {
    question: "Beslenme planı dahil mi?",
    answer: "Beslenme planı paketinize bağlıdır. Bazı paketlerde makro bazlı beslenme planı dahilken, bazılarında ek olarak sunulmaktadır. Detaylar için paket içeriklerini inceleyebilirsiniz.",
  },
  {
    question: "Programımı iptal edebilir miyim?",
    answer: "Evet, programınızı istediğiniz zaman iptal edebilirsiniz. İptal koşulları ve iade politikası hakkında detaylı bilgi almak için koçunuzla iletişime geçmenizi öneririz.",
  },
];

interface FAQAccordionProps {
  items?: FAQItem[];
  // Stil varyasyonları
  variant?: 1 | 2;
  // Tema renkleri
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  bgColor?: string;
  hoverBg?: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  accentColor,
  textColor,
  mutedColor,
  borderColor,
  hoverBg,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  hoverBg: string;
}) {
  return (
    <div className={`border-b ${borderColor}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-6 px-2 text-left transition-colors ${hoverBg} group`}
      >
        <span className={`text-base md:text-lg font-semibold ${textColor} pr-4`}>
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${accentColor} ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p className={`px-2 text-sm md:text-base leading-relaxed ${mutedColor}`}>
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQAccordion({
  items = DEFAULT_FAQ_ITEMS,
  variant = 1,
  accentColor = "text-blue-500",
  textColor = "text-white",
  mutedColor = "text-gray-400",
  borderColor = "border-white/10",
  hoverBg = "hover:bg-white/5",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (variant === 2) {
    // İki sütun layout
    const mid = Math.ceil(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
        <div>
          {left.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              accentColor={accentColor}
              textColor={textColor}
              mutedColor={mutedColor}
              borderColor={borderColor}
              hoverBg={hoverBg}
            />
          ))}
        </div>
        <div>
          {right.map((item, i) => (
            <AccordionItem
              key={i + mid}
              item={item}
              isOpen={openIndex === i + mid}
              onToggle={() => toggle(i + mid)}
              accentColor={accentColor}
              textColor={textColor}
              mutedColor={mutedColor}
              borderColor={borderColor}
              hoverBg={hoverBg}
            />
          ))}
        </div>
      </div>
    );
  }

  // Variant 1: Tek sütun accordion
  return (
    <div className="max-w-3xl mx-auto">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
          accentColor={accentColor}
          textColor={textColor}
          mutedColor={mutedColor}
          borderColor={borderColor}
          hoverBg={hoverBg}
        />
      ))}
    </div>
  );
}
