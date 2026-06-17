# ChemLab AI — Yeni Session Görev Listesi

## Proje Hakkında

**Repo:** `alia8065/kimya-projesi` (GitHub)  
**Branch:** `claude/ai-chemistry-lab-platform-k98mwi` (ve `main`)  
**Stack:** Next.js 15, TypeScript, Tailwind CSS, Zustand, Anthropic Claude API  
**Dil:** Tüm uygulama Fransızca  
**Çalışma dizini:** `/home/user/Kimya-Projesi`

Uygulama iki moddan oluşuyor:
- **Laboratoire libre** (`/free-lab`) — Serbest deney ortamı
- **Programme** (`/curriculum`) — Sınıf bazlı müfredat (Prépa + 9–12. sınıf)

---

## 1. Vercel Deploy Sorunu — ACİL

Vercel'e deploy edilemiyor. Repo bağlı (`alia8065/kimya-projesin`) ama ilk deployment hiç başlatılmamış.

**Yapılacak:**
- Vercel'de `alia8065/kimya-projesi` projesine git
- İlk deployment'ı manuel olarak tetikle
- Environment variable ekle: `ANTHROPIC_API_KEY = <kullanıcının API key'i>`
- Production branch: `main`

**Alternatif:** Vercel CLI kullanarak deploy et:
```bash
npm i -g vercel
vercel --prod
```

---

## 2. Free Lab (`/free-lab`) — Ekipman Hâlâ Çalışmıyor

Kullanıcı "ekipmanlar kullanılamıyor" diyor. Şu an yapılanlar:
- Bunsen brülörü / Hot plate → Isıtma toggle butonu var
- Manyetik karıştırıcı → Karıştırma toggle var
- pH metre / termometre / iletkenlik ölçer / terazi → Instrument readings bar gösteriyor
- Büret → Titration modu açılıyor

**Sorun:** Ekipmanı seçince kullanıcı ne yapacağını bilmiyor — görsel geri bildirim yok, yönlendirme eksik.

**İstenen:**
- Ekipman seçilince lab'de o ekipmanın SVG/görseli belirsin
- Her ekipman için kısa kullanım talimatı gösterilsin
- Ekipman seçimi → lab alanında direkt etki görülsün (örn. hot plate seçince ateş animasyonu başlasın, karıştırıcı seçince çubuk dönsün — otomatik olarak, toggle'a gerek kalmadan)

---

## 3. Titrasyon Deneyi

Titrasyon modu eklendi (`/free-lab` → büret ekle → "Titrage" modu seç). Ancak:

**Sorunlar / İyileştirmeler:**
- Kullanıcı hangi maddenin analyt, hangisinin titrant olduğunu anlamıyor
- "Ajouter l'indicateur" adımı açıkça yönlendirilmiyor
- Eşdeğerlik noktasına ulaşılınca daha dramatik bir kutlama / sonuç ekranı isteniyor
- Titrasyon eğrisi grafiği (pH vs hacim) gösterilsin — gerçek zamanlı güncellensin

---

## 4. Miktar Kontrolü (mmol)

`/free-lab`'de her kimyasal için mmol girişi yapılabiliyor (0.1–50 mmol).  
Flask dolum seviyesi mmol'e göre değişiyor.

**İstenen iyileştirmeler:**
- Miktar değişince reaksiyon sonucu da değişsin (şu an `simulateReaction` miktarı yok sayıyor)
- Sınırlayıcı reaktif (limiting reagent) hesaplanıp gösterilsin
- Stoekyometri tablosu: mol oranları, fazla/eksik olan reaktif

---

## 5. Curriculum Deneyleri (`/curriculum/[grade]/[topic]`)

Her konunun "Expérience" (Deney) sekmesinde adım adım prosedür + sağda canlı simülasyon var.

**Sorunlar:**
- Simülasyon adımlarla senkronize değil — adıma tıklayınca simülasyonda bir şey olmuyor
- Adımlar tamamlanınca simülasyondaki değişiklik çok küçük
- Titrasyon deneyi olan konularda (örn. Grade 9 asit-baz) gerçek titrasyon simülasyonu yok

**İstenen:**
- Her adım tıklandığında simülasyonda belirgin animasyon olsun
- Titrasyon konularında `/free-lab`'deki titrasyon UI'ı curriculum'a da entegre edilsin

---

## 6. Genel UI/UX İyileştirmeleri

- **Mobil:** Bazı kartlar ekrandan taşıyor, özellikle mmol kontrol kartları
- **Tablet:** İki panel yan yana görünüyor ama sağ panel (AI Tuteur) çok dar
- **Fransızca düzeltmeler:** Bazı yerlerde hâlâ İngilizce kelimeler kalabilir, kontrol edilmeli
- **AI Tuteur:** Fransızca cevap vermiyor (system prompt Fransızcaya güncellenmeli)

---

## 7. Eksik Özellikler (İstenen ama yapılmamış)

- **Reaksiyon geçmişi:** Daha önce yapılan reaksiyonların listesi
- **Sonuç raporu:** Deney bitince PDF/özet indirme
- **Karanlık/Aydınlık mod** toggle
- **Ses efektleri:** Reaksiyon sırasında köpürme, kaynama sesleri (isteğe bağlı)

---

## Teknik Notlar

```
Dosya yapısı:
app/
  page.tsx                          # Ana sayfa
  free-lab/page.tsx                 # Serbest lab
  curriculum/page.tsx               # Sınıf seçimi
  curriculum/[grade]/page.tsx       # Konu listesi
  curriculum/[grade]/[topic]/page.tsx  # Deney sayfası

lib/
  chemicals.ts    # 24 kimyasal (Fransızca)
  equipment.ts    # 27 ekipman (Fransızca)
  curriculum.ts   # 5 sınıf, 11 konu (Fransızca)
  reactions.ts    # 25 reaksiyon (Fransızca)

components/lab/
  AIAssistant.tsx     # AI sohbet paneli
  ReactionVessel.tsx  # Flask simülasyonu (mmol'e göre dolum)

store/labStore.ts     # Zustand state management
```

**Önemli:** `CLAUDE.md` → `AGENTS.md` dosyasını oku. Next.js'in bu sürümünde breaking change'ler var, `node_modules/next/dist/docs/` klasörünü kontrol et.

**API key:** `ANTHROPIC_API_KEY` environment variable olarak ayarlanmalı (`.env.local` veya Vercel dashboard).

---

## Öncelik Sırası

1. 🔴 Vercel deploy çalıştır
2. 🔴 Ekipman görsel geri bildirimi
3. 🟡 Titrasyon eğrisi grafiği
4. 🟡 Limiting reagent hesabı
5. 🟢 Curriculum simülasyon senkronizasyonu
6. 🟢 AI Tuteur Fransızca yanıt
