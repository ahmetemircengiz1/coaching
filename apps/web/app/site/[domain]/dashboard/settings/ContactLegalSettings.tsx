"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachSettings } from "../actions";
import { notifyPreviewRefresh } from "@/src/lib/preview-bus";

const LEGAL_PAGES = [
  { slug: "gizlilik", label: "Gizlilik Politikası", placeholder: "Müşteri verilerini nasıl topladığınız, sakladığınız ve kullandığınız hakkında bilgi..." },
  { slug: "kvkk", label: "KVKK Aydınlatma Metni", placeholder: "KVKK kapsamında veri işleme amaç ve hukuki sebepleri..." },
  { slug: "kullanim", label: "Kullanım Koşulları", placeholder: "Site ve hizmet kullanım koşulları..." },
  { slug: "mesafeli", label: "Mesafeli Satış Sözleşmesi", placeholder: "Online satış sözleşmesi metni..." },
  { slug: "iade", label: "İade ve İptal Politikası", placeholder: "İade koşulları, süresi, iptal politikası..." },
  { slug: "cerez", label: "Çerez Politikası", placeholder: "Çerez kullanım açıklaması..." },
];

interface ContactLegalSettingsProps {
  domain: string;
  initial: {
    contactPhone: string | null;
    businessAddress: string | null;
    legalFullName: string | null;
    taxId: string | null;
    legalTexts: Record<string, string> | null;
  };
  /**
   * Aşama 3: Hangi bölümler render edilsin?
   *  - "contact": yalnız iletişim & resmi bilgiler kartı (İletişim & Sosyal grubu için)
   *  - "legal":   yalnız yasal sayfa metinleri kartı (Yasal Sayfalar grubu için)
   *  - undefined: ikisi birlikte (geriye dönük uyumluluk)
   */
  section?: "contact" | "legal";
}

export function ContactLegalSettings({ domain, initial, section }: ContactLegalSettingsProps) {
  const [contactPhone, setContactPhone] = useState(initial.contactPhone || "");
  const [businessAddress, setBusinessAddress] = useState(initial.businessAddress || "");
  const [legalFullName, setLegalFullName] = useState(initial.legalFullName || "");
  const [taxId, setTaxId] = useState(initial.taxId || "");
  const [legalTexts, setLegalTexts] = useState<Record<string, string>>(initial.legalTexts || {});
  const [savingContact, setSavingContact] = useState(false);
  const [savingLegal, setSavingLegal] = useState<string | null>(null);

  const handleSaveContact = async () => {
    setSavingContact(true);
    const result = await updateCoachSettings(domain, {
      contactPhone: contactPhone.trim() || null,
      businessAddress: businessAddress.trim() || null,
      legalFullName: legalFullName.trim() || null,
      taxId: taxId.trim() || null,
    });
    setSavingContact(false);
    if (result?.success === false) {
      toast.error("İletişim bilgileri kaydedilemedi.");
    } else {
      toast.success("İletişim bilgileri kaydedildi.");
      notifyPreviewRefresh();
    }
  };

  const handleSaveLegal = async (slug: string) => {
    setSavingLegal(slug);
    const next: Record<string, string> = { ...legalTexts };
    const value = (next[slug] || "").trim();
    if (value) {
      next[slug] = value;
    } else {
      delete next[slug];
    }
    const result = await updateCoachSettings(domain, {
      legalTexts: Object.keys(next).length === 0 ? null : next,
    });
    setSavingLegal(null);
    if (result?.success === false) {
      toast.error("Yasal metin kaydedilemedi.");
    } else {
      toast.success("Yasal metin kaydedildi.");
      setLegalTexts(next);
      notifyPreviewRefresh();
    }
  };

  const showContact = section === undefined || section === "contact";
  const showLegal = section === undefined || section === "legal";

  return (
    <div className="space-y-6">
      {/* İletişim & Resmi Bilgiler */}
      {showContact && <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg">İletişim & Resmi Bilgiler</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bu bilgiler footer'da ve yasal sayfaların altında görünür.
            Tüm alanlar <strong>opsiyoneldir</strong> — sadece doldurduğun alanlar gösterilir.
            Vergi No yalnız fatura kesen şahıs firması / şirketler için gereklidir; bireysel
            çalışan koçların bu alanı doldurması zorunlu değildir.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefon (opsiyonel)" placeholder="+90 5xx xxx xx xx" value={contactPhone} onChange={setContactPhone} />
            <Field
              label="Vergi No (yalnız firma için, opsiyonel)"
              placeholder="Boş bırakılabilir"
              value={taxId}
              onChange={setTaxId}
            />
            <div className="sm:col-span-2">
              <Field label="Resmi Unvan / Şahıs Firması Adı (opsiyonel)" placeholder="Örn: Ahmet Yılmaz Spor Hizmetleri" value={legalFullName} onChange={setLegalFullName} />
            </div>
            <div className="sm:col-span-2">
              <Label>Adres</Label>
              <textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-md text-sm"
                placeholder="Mahalle, sokak, bina, daire, ilçe, il, posta kodu"
                style={{
                  backgroundColor: "var(--dashboard-main-bg)",
                  color: "var(--dashboard-main-text)",
                  border: "1px solid var(--dashboard-card-border)",
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleSaveContact}
            disabled={savingContact}
            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
            className="font-semibold hover:opacity-90"
          >
            {savingContact ? "Kaydediliyor..." : "İletişim Bilgilerini Kaydet"}
          </Button>
        </CardContent>
      </Card>}

      {/* Yasal Sayfa Metinleri */}
      {showLegal && <Card style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)", color: "var(--dashboard-main-text)" }}>
        <CardHeader>
          <CardTitle className="text-lg">Yasal Sayfa Metinleri</CardTitle>
          <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>
            Bu metinler <code className="text-xs">/site/{domain}/legal/[slug]</code> sayfalarında yayınlanır ve
            footer'a eklenir. Boş bırakırsan sayfa "metin hazırlanmadı" uyarısı gösterir.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {LEGAL_PAGES.map((page) => {
            const value = legalTexts[page.slug] || "";
            return (
              <div key={page.slug} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{page.label}</Label>
                  <a
                    href={`/site/${domain}/legal/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hover:underline"
                    style={{ color: "var(--dashboard-accent)" }}
                  >
                    Sayfayı Görüntüle ↗
                  </a>
                </div>
                <textarea
                  value={value}
                  onChange={(e) => setLegalTexts((prev) => ({ ...prev, [page.slug]: e.target.value }))}
                  rows={6}
                  placeholder={page.placeholder}
                  className="w-full px-3 py-2 rounded-md text-sm font-mono"
                  style={{
                    backgroundColor: "var(--dashboard-main-bg)",
                    color: "var(--dashboard-main-text)",
                    border: "1px solid var(--dashboard-card-border)",
                  }}
                />
                <Button
                  onClick={() => handleSaveLegal(page.slug)}
                  disabled={savingLegal === page.slug}
                  size="sm"
                  variant="outline"
                  className="font-medium"
                >
                  {savingLegal === page.slug ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>}
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          backgroundColor: "var(--dashboard-main-bg)",
          color: "var(--dashboard-main-text)",
          border: "1px solid var(--dashboard-card-border)",
        }}
      />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium block mb-1" style={{ color: "var(--dashboard-main-text-muted)" }}>
      {children}
    </label>
  );
}
