import React, { useEffect, useState } from "react";

const initialData = {
  services: [
    { id: "s1", title: "Bireysel Danışmanlık", description: "Ergen ve yetişkinlerle; kişinin ihtiyaçlarına, kendi hızına ve bireysel farklılıklarına duyarlı görüşmeler.", price: "50 dakika · Yüz yüze / online", icon: "○" },
    { id: "s2", title: "BDT ve EMDR Odaklı Çalışmalar", description: "Bilişsel Davranışçı yaklaşım ve EMDR’yi mesleki çalışmalarıma dahil ederek kişiye uygun bir yol izliyorum.", price: "Bireysel görüşmeler", icon: "⌁" },
    { id: "s3", title: "Ergen Danışmanlığı", description: "Ergenlik dönemine uyum, kimlik gelişimi, sınav kaygısı ve akran ilişkileri üzerine bireysel görüşmeler.", price: "50 dakika · Yüz yüze / online", icon: "◇" },
    { id: "s4", title: "Sanat Temelli Grup Çalışmaları", description: "Sanat yoluyla kendini ifade etmeye ve içsel kaynakları keşfetmeye alan açan grup çalışmaları.", price: "Grup çalışmaları", icon: "⌁" },
    { id: "s5", title: "Yaratıcı Atölyeler", description: "Yaratıcılığı ve kendini keşfetmeyi odağına alan atölye buluşmaları.", price: "Atölye çalışmaları", icon: "✳" },
  ],
  posts: [
    { id: "p1", title: "Kendine şefkat göstermeyi öğrenmek", category: "İYİ OLMA HALİ", date: "12 MAYIS 2025", excerpt: "Kendimizle kurduğumuz ilişki, hayatımızdaki her ilişkiye eşlik eder. Peki bu ilişkiyi nasıl yumuşatabiliriz?" },
    { id: "p2", title: "Kaygı ile kalabilmek", category: "DUYGULAR", date: "28 NİSAN 2025", excerpt: "Kaygıyı susturmaya çalışmak yerine onu duymaya başladığımızda, bize anlatmak istediği şeyleri keşfedebiliriz." },
    { id: "p3", title: "Sınırlar, yakınlık ve kendimiz", category: "İLİŞKİLER", date: "04 NİSAN 2025", excerpt: "Sınır koymak uzaklaşmak değil; ilişkide kendimize de bir yer açabilmektir." },
  ],
  appointments: [],
  settings: {
    email: "info@psikologbusecoskun.com",
    phone: "0530 299 41 64",
    address: "İstanbul / Suadiye · Yüz yüze ve online",
    hours: "Pazar hariç, 11.00 — 21.00",
    instagram: "psk.busecoskun",
  },
};

const previousDefaults = {
  services: [
    { id: "s1", title: "Bireysel Terapi", description: "Kendinizi anlamak, duygularınıza alan açmak ve kendi yolunuzu bulmak için güvenli bir alan.", price: "50 dakika", icon: "○" },
    { id: "s2", title: "Online Terapi", description: "Bulunduğunuz yerden, kendi ritminizde. Görüntülü görüşme ile aynı özenli ve güvenli süreç.", price: "50 dakika", icon: "⌁" },
    { id: "s3", title: "Ön Görüşme", description: "Tanışmak, ihtiyaçlarınızı konuşmak ve birlikte çalışmanın size uygun olup olmadığını keşfetmek için.", price: "Ücretsiz · 20 dakika", icon: "✳" },
  ],
  settings: {
    email: "merhaba@busecoskun.com",
    phone: "+90 532 000 00 00",
    address: "Kadıköy, İstanbul · Online seans imkânı",
    hours: "Pazartesi — Cuma, 10.00 — 18.00",
    instagram: "@psikologbusecoskun",
  },
};

const publishedServiceDefaults = [
  { id: "s1", title: "Bireysel Psikoterapi", description: "Ergen ve yetişkinlerle; Bilişsel Davranışçı Terapi (BDT) ve EMDR yaklaşımlarını içeren bireysel çalışmalar.", price: "50 dakika · Yüz yüze / online", icon: "○" },
  { id: "s2", title: "Sanat Terapisi", description: "Sanat terapisi temelli grup çalışmalarıyla kendinizi yaratıcı yollarla keşfedebileceğiniz bir alan.", price: "Grup çalışmaları", icon: "⌁" },
  { id: "s3", title: "Yaratıcı Atölyeler", description: "Duygulara, ilişkilere ve kendini keşfetmeye alan açan yaratıcı atölyeler.", price: "Atölye çalışmaları", icon: "✳" },
];

function readData(key) {
  try {
    const stored = localStorage.getItem(`buse-${key}`);
    if (!stored) return structuredClone(initialData[key]);

    const saved = JSON.parse(stored);
    if (key === "settings") {
      return {
        ...saved,
        ...Object.fromEntries(Object.entries(initialData.settings).map(([field, value]) => [
          field,
          saved[field] === previousDefaults.settings[field]
            || (field === "email" && saved[field] === "psk.busecoskun@gmail.com")
            ? value
            : (saved[field] ?? value),
        ])),
      };
    }
    if (key === "services" && Array.isArray(saved)) {
      const knownDefaults = [previousDefaults.services, publishedServiceDefaults, initialData.services];
      const matchingDefaults = knownDefaults.find(defaults => defaults.every(defaultService => (
        saved.some(service => service.id === defaultService.id
          && Object.entries(defaultService).every(([field, value]) => service[field] === value))
      )));
      if (matchingDefaults) {
        const customServices = saved.filter(service => !matchingDefaults.some(defaultService => (
          service.id === defaultService.id
          && Object.entries(defaultService).every(([field, value]) => service[field] === value)
        )));
        const defaultServices = structuredClone(initialData.services);
        return [
          ...defaultServices,
          ...customServices.filter(service => !defaultServices.some(defaultService => defaultService.id === service.id)),
        ];
      }
      return saved;
    }
    return saved;
  } catch (error) {
    console.error(`Kayıtlı ${key} verileri okunamadı:`, error);
    return structuredClone(initialData[key]);
  }
}

function useStoredData(key) {
  const [value, setValue] = useState(() => readData(key));
  useEffect(() => {
    try {
      localStorage.setItem(`buse-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`${key} verileri kaydedilemedi:`, error);
    }
  }, [key, value]);
  return [value, setValue];
}

function Brand({ footer = false }) {
  return footer ? (
    <a className="footer-brand" href="#home">Buse <em>Coşkun</em></a>
  ) : (
    <a className="brand" href="#home" aria-label="Buse Coşkun, ana sayfa">
      <span className="brand-mark">b.</span><span className="brand-name">Buse Coşkun</span>
    </a>
  );
}

function Eyebrow({ children, className = "" }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

function Reveal({ children, className = "", direction = "up", ...props }) {
  return <div className={`reveal reveal-${direction} ${className}`} {...props}>{children}</div>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Brand />
        <nav className={`nav-links${menuOpen ? " open" : ""}`} id="nav-links">
          <a href="#about" onClick={() => setMenuOpen(false)}>Hakkımda</a>
          <a href="#focus" onClick={() => setMenuOpen(false)}>Uzmanlık alanlarım</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>İletişim</a>
        </nav>
        <div className="nav-right">
          <a className="pill dark" href="#contact">İlk adımı at <span className="arrow">↗</span></a>
          <button className="menu-toggle" aria-label="Menüyü aç" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
        </div>
      </div>
    </header>
  );
}

function Marquee() {
  const line = <span key="line">Kendine alan aç <i>✳</i> Kendini duymaya başla <i>✳</i> Değişim içeriden başlar <i>✳</i></span>;
  return <div className="marquee" aria-label="Kendine alan aç"><div className="marquee-track">{[0, 1, 2, 3].map(i => <span key={i}>{line.props.children}</span>)}</div></div>;
}

function Hero() {
  return (
    <section className="wrap hero" id="home">
      <div className="hero-copy">
        <Eyebrow className="hero-kicker">Uzman Klinik Psikolog &nbsp;·&nbsp; İstanbul</Eyebrow>
        <h1><Reveal direction="down">Kendinle</Reveal><Reveal>temas kur</Reveal></h1>
        <Reveal direction="down"><p>Uzman Klinik Psikolog Buse Coşkun olarak İstanbul Suadiye’de yüz yüze ve online; ergen ve yetişkinlerle psikolojik danışmanlık görüşmeleri yürütüyorum. Çalışmalarımda BDT, EMDR ve sanat temelli yaklaşımlara yer veriyorum.</p></Reveal>
        <Reveal className="hero-actions"><a className="pill dark" href="#contact">Bir adım at <span className="arrow">↗</span></a><a className="text-link" href="#about">Buse kimdir?</a></Reveal>
        <Reveal direction="down" className="hero-note">İnsana ve yaşantıya dair.</Reveal>
      </div>
      <div className="hero-image reveal" role="img" aria-label="Uzman Klinik Psikolog Buse Coşkun portresi">
        <div className="image-caption">Buse Coşkun &nbsp; / &nbsp; Uzman Klinik Psikolog</div>
      </div>
    </section>
  );
}

function FocusAreas() {
  const areas = [
    {
      icon: "◎",
      title: "Bireysel Danışmanlık",
      tags: ["Ergen", "Yetişkin", "BDT", "EMDR"],
      description: "Ergen ve yetişkinlerle bireysel danışmanlık; kişisel ihtiyaçlara ve kişinin kendi hızına duyarlı çalışma.",
      tone: "sage",
    },
    {
      icon: "✳",
      title: "Travma ve EMDR",
      tags: ["Travmatik yaşantılar ve travma sonrası stres"],
      description: "Travmatik yaşantılar ve sonrasındaki etkiler üzerine destekleyici bireysel danışmanlık çalışmaları.",
      tone: "rose",
    },
    {
      icon: "⌁",
      title: "Kaygı ve Duygu Durumu",
      tags: ["Anksiyete ve kaygı bozuklukları", "Depresyon ve duygu durum güçlükleri", "Panik bozukluk ve panik atak", "Duygu düzenleme güçlükleri"],
      description: "Kaygı, panik, depresif duygu durum ve duyguları düzenlemekte yaşanan güçlükler.",
      tone: "blue",
    },
    {
      icon: "◇",
      title: "Ergen Danışmanlığı",
      tags: ["Ergenlik dönemine uyum ve kimlik gelişimi", "Sınav kaygısı ve akademik stres", "Akran ilişkileri ve sosyal uyum sorunları"],
      description: "Ergenlik dönemine uyum, akademik stres ve sosyal ilişkiler üzerine çalışmalar.",
      tone: "mint",
    },
    {
      icon: "♡",
      title: "İlişkiler ve Benlik",
      tags: ["Kişilik örüntüleri ve kişilik bozuklukları", "Aile içi iletişim ve çatışmalar", "Özsaygı ve benlik algısı", "İlişki ve kişilerarası iletişim sorunları"],
      description: "Aile içi iletişim, kişilerarası ilişkiler ve benlik algısına yönelik bireysel danışmanlık.",
      tone: "lilac",
    },
  ];

  return (
    <section className="focus-section" id="focus">
      <div className="focus-wrap">
        <div className="focus-heading">
          <Reveal direction="down"><Eyebrow>02 &nbsp; / &nbsp; Uzmanlık alanları</Eyebrow></Reveal>
          <Reveal><h2>Size Özel Psikolojik Destek</h2></Reveal>
          <Reveal direction="down"><p>İstanbul Suadiye’de yüz yüze ve online olarak; ergen ve yetişkinlerle kaygı, travmatik yaşantılar, duygu durumu, ilişkiler ve benlik algısı üzerine kişiye özel danışmanlık çalışmaları yürütüyorum.</p></Reveal>
        </div>
        <div className="focus-list">{areas.map(area => (
          <article className={`focus-card focus-card-${area.tone} reveal reveal-up`} key={area.title}>
            <span className="focus-card-icon" aria-hidden="true">{area.icon}</span>
            <h3>{area.title}</h3>
            <ul>{area.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            <p>{area.description}</p>
          </article>
        ))}</div>
      </div>
    </section>
  );
}

function About() {
  const areas = [
    "Travmatik yaşantılar ve travma sonrası stres",
    "Anksiyete ve kaygı bozuklukları",
    "Depresyon ve duygu durum güçlükleri",
    "Panik bozukluk ve panik atak",
    "Duygu düzenleme güçlükleri",
    "Kişilik örüntüleri ve kişilik bozuklukları",
    "Ergenlik dönemi ve kimlik gelişimi",
    "Sınav kaygısı ve akademik stres",
    "Akran ilişkileri ve sosyal uyum",
    "Aile içi iletişim ve çatışmalar",
    "Özsaygı ve benlik algısı",
    "İlişki ve kişilerarası iletişim",
  ];
  const principles = [
    "Gizlilik ve mahremiyet",
    "Yargısız ve güvenli alan",
    "Bilimsel ve etik yaklaşım",
    "Bireysel farklılıklara saygı",
    "Güven temelli ilişki",
  ];

  return (
    <section className="about-section" id="about">
      <div className="wrap about-wrap">
        <header className="about-heading about-heading-centered">
          <Reveal direction="down"><Eyebrow>✳ &nbsp; Hakkımda &amp; mesleki yaklaşım</Eyebrow></Reveal>
          <Reveal><h2>İçsel yolculuğunuzda <em>güvenli</em> bir alan.</h2></Reveal>
          <Reveal><p>Uzman Klinik Psikolog Buse Coşkun olarak, ergen ve yetişkinlerin ihtiyaçlarını bilimsel ve etik ilkeler doğrultusunda ele alıyorum.</p></Reveal>
        </header>
        <div className="about-layout">
          <aside className="about-sidebar">
            <Reveal className="about-summary-card">
              <div className="about-summary-top">
                <div className="about-avatar" role="img" aria-label="Psikolog portre fotoğrafı" />
                <div className="about-summary-name">
                  <span>Uzman Klinik Psikolog</span>
                  <h3>Buse Coşkun</h3>
                  <small>Klinik Psikoloji Yüksek Lisans</small>
                </div>
                <div className="about-badges"><span>İstanbul · Suadiye</span><span>Yüz yüze &amp; Online</span></div>
              </div>
              <div className="about-education">
                <Eyebrow>Eğitim geçmişi</Eyebrow>
                <div className="education-card"><span>01</span><div><strong>Üsküdar Üniversitesi</strong><small>Psikoloji Bölümü · Lisans</small></div></div>
                <div className="education-card"><span>02</span><div><strong>Üsküdar Üniversitesi</strong><small>Klinik Psikoloji · Yüksek lisans</small></div></div>
              </div>
              <div className="about-methods">
                <Eyebrow>Çalışma yaklaşımları</Eyebrow>
                <ul>{["BDT", "EMDR", "Sanat temelli çalışmalar"].map(approach => <li key={approach}>{approach}</li>)}</ul>
              </div>
            </Reveal>
          </aside>
          <Reveal className="about-main-card">
            <div className="about-bio">
              <Eyebrow>Mesleki profil ve klinik yaklaşım</Eyebrow>
              <p>Üsküdar Üniversitesi Psikoloji Bölümü’nden mezun olduktan sonra aynı üniversitede Klinik Psikoloji yüksek lisans eğitimimi tamamladım. Mesleki çalışmalarımı Bilişsel Davranışçı yaklaşım (BDT), EMDR ve sanat temelli çalışmalar alanlarında sürdürüyorum.</p>
              <p>Ergen ve yetişkinlerle bireysel danışmanlığın yanı sıra sanat temelli grup çalışmaları ve yaratıcı atölyeler gerçekleştiriyorum.</p>
              <p>Danışmanlık sürecini; bireyin kendisini tanımasına, yaşantılarına farklı bir perspektiften bakabilmesine ve kendi içsel kaynaklarını keşfedebilmesine alan açan bir yolculuk olarak görüyorum. Her bireyin kendine özgü hikâyesine saygı duymayı, bilimsel ve etik ilkeler doğrultusunda güvene dayalı bir ilişki kurmayı önemsiyorum.</p>
            </div>
            <div className="about-topic-group">
              <Eyebrow>Çalışma alanları</Eyebrow>
              <ul>{areas.map(area => <li key={area}>{area}</li>)}</ul>
            </div>
            <div className="about-principle-group">
              <Eyebrow>Çalışma ilkeleri</Eyebrow>
              <ul>{principles.map(principle => <li key={principle}>{principle}</li>)}</ul>
            </div>
          </Reveal>
        </div>
        <Reveal className="about-cta"><a className="text-link" href="#contact">Birlikte çalışalım <span aria-hidden="true">↗</span></a></Reveal>
      </div>
    </section>
  );
}

function CounselingProcess() {
  const steps = [
    {
      title: "İletişim kurun",
      description: "Telefon, WhatsApp veya randevu formu aracılığıyla ulaşın; yüz yüze ya da online görüşme tercihinizi paylaşın.",
    },
    {
      title: "İhtiyaçlarınızı konuşalım",
      description: "İlk görüşmede sizi buraya getiren konuları, beklentilerinizi ve nasıl bir destek aradığınızı birlikte ele alalım.",
    },
    {
      title: "Size uygun bir yol belirleyelim",
      description: "Bireysel farklılıklarınızı ve ihtiyaçlarınızı gözeterek görüşmelerin odağını ve çalışma yaklaşımını birlikte şekillendirelim.",
    },
    {
      title: "Süreci birlikte değerlendirelim",
      description: "Görüşmeler ortalama 50 dakika sürer. İhtiyaçlarınızı ve sürecin nasıl ilerlediğini görüşmelerde birlikte ele alırız.",
    },
  ];
  const principles = [
    "Gizlilik ve mahremiyet",
    "Yargısız ve güvenli alan",
    "Bilimsel ve etik yaklaşım",
    "Bireysel farklılıklara saygı",
    "Güven temelli danışmanlık ilişkisi",
  ];

  return (
    <section className="process-section" id="process">
      <div className="wrap process-wrap">
        <header className="process-heading">
          <Reveal direction="down"><Eyebrow>04 &nbsp; / &nbsp; Danışmanlık süreci</Eyebrow></Reveal>
          <Reveal><h2>İlk görüşmeden itibaren,<br /><em>size özel</em> bir yol.</h2></Reveal>
          <Reveal><p>Her danışmanlık süreci kendine özgüdür. Görüşmelerin yönünü ihtiyaçlarınızı ve beklentilerinizi birlikte değerlendirerek belirleriz.</p></Reveal>
        </header>
        <ol className="process-steps">
          {steps.map((step, index) => (
            <li className="process-step reveal reveal-up" key={step.title}>
              <span className="process-step-number">0{index + 1}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
            </li>
          ))}
        </ol>
        <div className="process-principles">
          <Reveal className="principles-intro">
            <Eyebrow>Çalışma ilkelerim</Eyebrow>
            <h3>Güven, saygı ve<br /><em>özenle.</em></h3>
          </Reveal>
          <ul>{principles.map((principle, index) => (
            <li className="reveal reveal-up" key={principle}><span>0{index + 1}</span>{principle}</li>
          ))}</ul>
        </div>
      </div>
    </section>
  );
}

function FrequentlyAskedQuestions() {
  const questions = [
    {
      question: "Görüşmeler ne kadar sürüyor?",
      answer: "Görüşmeler ortalama 50 dakika sürmektedir.",
    },
    {
      question: "Yüz yüze ve online görüşme seçenekleri var mı?",
      answer: "Görüşmeler yüz yüze İstanbul / Suadiye’de veya online olarak gerçekleştirilebilir. Size uygun formatı iletişim sırasında belirtebilirsiniz.",
    },
    {
      question: "Kimlerle çalışıyorsunuz?",
      answer: "Ergen ve yetişkinlerle bireysel danışmanlık çalışmaları yürütüyorum. Ayrıca sanat temelli grup çalışmaları ve yaratıcı atölyeler gerçekleştiriyorum.",
    },
    {
      question: "İlk görüşmede neler konuşulur?",
      answer: "İlk görüşmede ihtiyaçlarınızı, sizi görüşmeye getiren konuları ve beklentilerinizi ele alır; nasıl bir yol izlenebileceğini birlikte değerlendiririz.",
    },
    {
      question: "Görüşmelerde paylaştıklarım gizli kalır mı?",
      answer: "Gizlilik ve mahremiyet temel çalışma ilkelerim arasındadır. Gizliliğin kapsamı ve mesleki çerçeve hakkında ilk görüşmede bilgi paylaşılır.",
    },
    {
      question: "Nasıl randevu oluşturabilirim?",
      answer: "İletişim bölümündeki randevu formunu doldurabilir veya telefon ve WhatsApp üzerinden ulaşabilirsiniz.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="wrap faq-wrap">
        <header className="faq-heading">
          <Reveal direction="down"><Eyebrow>05 &nbsp; / &nbsp; Sıkça sorulan sorular</Eyebrow></Reveal>
          <Reveal><h2>Aklınızdaki <em>sorular.</em></h2></Reveal>
          <Reveal><p>Görüşmeler ve danışmanlık süreci hakkında merak ettikleriniz.</p></Reveal>
        </header>
        <div className="faq-list">
          {questions.map((item, index) => (
            <details className="faq-item reveal reveal-up" key={item.question}>
              <summary><span className="faq-number">0{index + 1}</span><span>{item.question}</span><span className="faq-toggle" aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <Reveal className="faq-contact-note">Başka bir sorunuz mu var? <a href="#contact">Bana ulaşın <span aria-hidden="true">↗</span></a></Reveal>
      </div>
    </section>
  );
}

function Booking({ settings, onSubmit, isSubmitting }) {
  const phoneDigits = settings.phone.replace(/\D/g, "");
  const whatsappPhone = phoneDigits.startsWith("0") ? `90${phoneDigits.slice(1)}` : phoneDigits;
  const instagramHandle = settings.instagram.replace(/^@/, "");

  return (
    <section className="booking" id="contact">
      <div className="wrap booking-grid">
        <div className="booking-copy">
          <Reveal direction="down"><Eyebrow>İletişim &nbsp;·&nbsp; Suadiye, İstanbul</Eyebrow></Reveal>
          <Reveal><h2>Birlikte<br />başlayalım.</h2></Reveal>
          <Reveal><p>Danışmanlık süreci ve çalışma biçimim hakkında bilgi almak ya da randevu oluşturmak için bana ulaşabilirsiniz.</p></Reveal>
          <Reveal className="contact-facts">
            <div><span>Seans süresi</span><strong>Ortalama 50 dakika</strong></div>
            <div><span>Görüşme biçimi</span><strong>Yüz yüze · Online</strong></div>
            <div><span>Çalışma saatleri</span><strong>{settings.hours}</strong></div>
            <div><span>Konum</span><strong>{settings.address}</strong></div>
          </Reveal>
          <Reveal className="contact-links">
            <a className="contact-link" href={`tel:${settings.phone.replace(/\s/g, "")}`}><span className="contact-link-icon" aria-hidden="true">↗</span><span><small>Telefon</small><strong>{settings.phone}</strong></span></a>
            <a className="contact-link" href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer"><span className="contact-link-icon" aria-hidden="true">↗</span><span><small>WhatsApp</small><strong>Mesaj gönder</strong></span></a>
            <a className="contact-link" href={`mailto:${settings.email}`}><span className="contact-link-icon" aria-hidden="true">↗</span><span><small>E-posta</small><strong>{settings.email}</strong></span></a>
            <a className="contact-link" href={`https://www.instagram.com/${instagramHandle}/`} target="_blank" rel="noreferrer"><span className="contact-link-icon" aria-hidden="true">↗</span><span><small>Instagram</small><strong>@{instagramHandle}</strong></span></a>
          </Reveal>
        </div>
        <form id="booking-form" className="booking-form contact-form reveal" onSubmit={onSubmit}>
          <div className="contact-form-heading"><Eyebrow>Randevu talebi</Eyebrow><h3>Size geri dönelim.</h3><p>Bilgilerinizi bırakın, en kısa sürede sizinle iletişime geçeyim.</p></div>
          <div className="form-grid">
            <div className="field"><label htmlFor="name">Adınız soyadınız</label><input id="name" name="name" required autoComplete="name" placeholder="Adınız Soyadınız" /></div>
            <div className="field"><label htmlFor="email">E-posta adresiniz</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="ornek@email.com" /></div>
            <div className="field"><label htmlFor="phone">Telefon numaranız</label><input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+90 5XX XXX XX XX" /></div>
            <div className="field full"><label htmlFor="message">Paylaşmak istedikleriniz <span style={{ letterSpacing: 0, textTransform: "none" }}>(isteğe bağlı)</span></label><textarea id="message" name="message" maxLength={2000} placeholder="Kısaca not bırakabilirsiniz..." /></div>
          </div>
          <div className="form-trap" aria-hidden="true"><label htmlFor="website">Web sitesi</label><input id="website" name="website" tabIndex="-1" autoComplete="off" /></div>
          <button className="pill dark" type="submit" disabled={isSubmitting}>{isSubmitting ? "Gönderiliyor..." : "Görüşme talep et"} {!isSubmitting && <span className="arrow">↗</span>}</button>
          <p className="form-note">Bilgileriniz yalnızca size geri dönüş yapmak için kullanılır. Talebiniz güvenli bağlantı üzerinden e-posta ile iletilir.</p>
        </form>
      </div>
    </section>
  );
}

function Footer({ settings }) {
  const instagramHandle = settings.instagram.replace(/^@/, "");

  return (
    <footer className="footer"><div className="wrap">
      <div className="footer-main">
        <Brand footer />
        <div className="footer-nav">
          <div><Eyebrow>Keşfet</Eyebrow><a href="#about">Hakkımda</a><a href="#services">Çalışma alanlarım</a><a href="#focus">Uzmanlık alanlarım</a><a href="#process">Danışmanlık süreci</a><a href="#faq">Sık sorulan sorular</a></div>
          <div><Eyebrow>İletişim</Eyebrow><a href={`mailto:${settings.email}`}>{settings.email}</a><a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a><a href={`https://www.instagram.com/${instagramHandle}/`} target="_blank" rel="noreferrer">@{instagramHandle}</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Buse Coşkun. Tüm hakları saklıdır.</span><a href="#admin">Yönetici girişi ↗</a></div>
    </div></footer>
  );
}

function Site({ data, notify }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollDirection = "down";
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY >= lastScrollY ? "down" : "up";
      lastScrollY = currentScrollY;
    };
    const handleInternalNavigation = event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute("href") === "#") return;

      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
      target.scrollIntoView({ behavior: "smooth" });
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.toggle("reveal-from-bottom", scrollDirection === "down");
          entry.target.classList.toggle("reveal-from-top", scrollDirection === "up");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    document.addEventListener("click", handleInternalNavigation);
    document.querySelectorAll(".reveal").forEach(element => {
      observer.observe(element);
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) element.classList.add("is-visible");
    });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollDirection);
      document.removeEventListener("click", handleInternalNavigation);
    };
  }, [data.services, data.posts]);

  async function submitAppointment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      phone: String(fields.get("phone") || "").trim(),
      message: String(fields.get("message") || "").trim(),
      website: String(fields.get("website") || "").trim(),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      form.reset();
      notify("Talebiniz e-posta ile gönderildi.");
    } catch (error) {
      console.error("Randevu talebi gönderilemedi:", error);
      notify(error instanceof Error ? error.message : "Talep gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <Hero /><Marquee />
        <FocusAreas />
        <section className="quote-band"><div className="wrap quote-inner reveal"><div className="quote-mark">“</div><blockquote>Her şey, kendine<br />kulak vermekle başlar.</blockquote><cite>Kendinle kurduğun ilişki, her şeyin başlangıcı.</cite></div></section>
        <About /><CounselingProcess /><FrequentlyAskedQuestions /><Booking settings={data.settings} onSubmit={submitAppointment} isSubmitting={isSubmitting} />
      </main>
      <Footer settings={data.settings} />
    </>
  );
}

function AdminLogin({ onLogin, notify }) {
  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (fields.get("username") === "admin" && fields.get("password") === "buse2026") onLogin();
    else notify("Kullanıcı adı veya şifre hatalı.");
  }
  return (
    <main className="admin-view admin-login">
      <section className="admin-login-aside">
        <Brand />
        <div><Eyebrow>Yönetim paneli</Eyebrow><h1>Her şey<br />kontrolünüzde.</h1><p>İçeriklerinizi, görüşme taleplerinizi ve site bilgilerinizi tek bir yerden yönetin.</p></div>
        <Eyebrow>© {new Date().getFullYear()} Buse Coşkun</Eyebrow>
      </section>
      <section className="admin-login-main"><form id="login-form" className="login-box" onSubmit={submit}>
        <Brand /><h2>Tekrar merhaba.</h2><p>Devam etmek için yönetici hesabınıza giriş yapın.</p>
        <div className="field"><label htmlFor="admin-user">Kullanıcı adı</label><input id="admin-user" name="username" autoComplete="username" required placeholder="Kullanıcı adınız" /></div>
        <div className="field"><label htmlFor="admin-pass">Şifre</label><input id="admin-pass" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" /></div>
        <button type="submit" className="pill dark">Giriş yap <span className="arrow">↗</span></button>
        <div className="login-hint">Demo giriş bilgileri: <strong>admin</strong> / <strong>buse2026</strong><br />Bu demo kimlik doğrulaması yalnızca tarayıcıda çalışır.</div>
      </form></section>
    </main>
  );
}

function AppointmentsTable({ appointments, onStatus, onDelete }) {
  if (!appointments.length) return <div className="empty">Henüz randevu talebi yok.<br /><small>Yeni talepler burada görünecek.</small></div>;
  return <div className="table-wrap"><table><thead><tr><th>Danışan</th><th>Görüşme</th><th>Tarih</th><th>Durum</th><th /></tr></thead><tbody>
    {appointments.map(item => <tr key={item.id}>
      <td><strong>{item.name}</strong><small>{item.email} · {item.phone}</small>{item.message && <small>Not: {item.message}</small>}</td>
      <td>{item.service}</td><td>{item.date}</td>
      <td><select className="status-select" value={item.status} onChange={event => onStatus(item.id, event.target.value)}><option>Beklemede</option><option>Onaylandı</option><option>Tamamlandı</option></select></td>
      <td><div className="row-actions"><button onClick={() => onDelete(item.id)}>Sil</button></div></td>
    </tr>)}
  </tbody></table></div>;
}

function ContentTable({ items, type, onEdit, onDelete }) {
  if (!items.length) return <div className="empty">Henüz içerik eklenmemiş.</div>;
  return <div className="table-wrap"><table><thead><tr><th>Başlık</th><th>{type === "service" ? "Süre / fiyat" : "Kategori"}</th><th>Açıklama</th><th>İşlem</th></tr></thead><tbody>
    {items.map(item => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{type === "service" ? item.price : item.category}</td><td>{item.description || item.excerpt}</td><td><div className="row-actions"><button onClick={() => onEdit(item)}>Düzenle</button><button onClick={() => onDelete(item.id)}>Sil</button></div></td></tr>)}
  </tbody></table></div>;
}

function ContentEditor({ type, item, onSave, onClose }) {
  const service = type === "service";
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    onSave({ ...item, ...values, id: item?.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}` });
  }
  return (
    <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal"><h2>{item ? "Düzenle: " : "Yeni "}{service ? "çalışma alanı" : "journal yazısı"}</h2>
        <form className="admin-form" onSubmit={submit}>
          {service ? <>
            <div className="field"><label>Başlık</label><input name="title" required defaultValue={item?.title || ""} /></div>
            <div className="field"><label>Süre / fiyat</label><input name="price" required defaultValue={item?.price || ""} placeholder="50 dakika" /></div>
            <div className="field full"><label>Açıklama</label><textarea name="description" required defaultValue={item?.description || ""} /></div>
            <div className="field"><label>İkon (tek karakter)</label><input name="icon" defaultValue={item?.icon || "○"} /></div>
          </> : <>
            <div className="field full"><label>Başlık</label><input name="title" required defaultValue={item?.title || ""} /></div>
            <div className="field"><label>Kategori</label><input name="category" required defaultValue={item?.category || ""} placeholder="İYİ OLMA HALİ" /></div>
            <div className="field"><label>Tarih</label><input name="date" required defaultValue={item?.date || new Date().toLocaleDateString("tr-TR").toUpperCase()} /></div>
            <div className="field full"><label>Kısa açıklama</label><textarea name="excerpt" required defaultValue={item?.excerpt || ""} /></div>
          </>}
          <div className="admin-actions"><button className="admin-btn">Kaydet</button><button type="button" className="admin-btn ghost" onClick={onClose}>Vazgeç</button></div>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ data, setData, onLogout, notify }) {
  const [tab, setTab] = useState("overview");
  const [editor, setEditor] = useState(null);
  const tabs = [["overview", "⌂", "Genel Bakış"], ["appointments", "▤", "Randevu Talepleri"], ["services", "✳", "Çalışma Alanları"], ["posts", "▧", "Journal Yazıları"], ["settings", "⚙", "Site Ayarları"]];
  const pending = data.appointments.filter(item => item.status === "Beklemede").length;
  const remove = (key, itemId) => {
    if (window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) setData(key, items => items.filter(item => item.id !== itemId));
  };
  const saveContent = item => {
    const key = editor.type === "service" ? "services" : "posts";
    setData(key, items => editor.item ? items.map(existing => existing.id === item.id ? item : existing) : [...items, item]);
    setEditor(null);
    notify("İçerik kaydedildi.");
  };
  let content;
  if (tab === "overview") content = <>
    <div className="stat-grid"><div className="stat-card"><span>Toplam randevu</span><strong>{data.appointments.length}</strong></div><div className="stat-card"><span>Yeni talepler</span><strong>{pending}</strong></div><div className="stat-card"><span>Yayındaki içerik</span><strong>{data.services.length + data.posts.length}</strong></div></div>
    <section className="admin-content"><div className="content-head"><h2>Son randevu talepleri</h2><button className="admin-btn ghost" onClick={() => setTab("appointments")}>Tümünü gör ↗</button></div><AppointmentsTable appointments={data.appointments.slice(0, 5)} onStatus={updateStatus} onDelete={itemId => remove("appointments", itemId)} /></section>
  </>;
  if (tab === "appointments") content = <section className="admin-content"><div className="content-head"><h2>Randevu talepleri <span style={{ color: "#88948a", font: "13px var(--sans)" }}>({data.appointments.length})</span></h2></div><AppointmentsTable appointments={data.appointments} onStatus={updateStatus} onDelete={itemId => remove("appointments", itemId)} /></section>;
  if (tab === "services") content = <section className="admin-content"><div className="content-head"><h2>Çalışma alanları</h2><button className="admin-btn" onClick={() => setEditor({ type: "service", item: null })}>+ Yeni alan</button></div><ContentTable items={data.services} type="service" onEdit={item => setEditor({ type: "service", item })} onDelete={itemId => remove("services", itemId)} /></section>;
  if (tab === "posts") content = <section className="admin-content"><div className="content-head"><h2>Journal yazıları</h2><button className="admin-btn" onClick={() => setEditor({ type: "post", item: null })}>+ Yeni yazı</button></div><ContentTable items={data.posts} type="post" onEdit={item => setEditor({ type: "post", item })} onDelete={itemId => remove("posts", itemId)} /></section>;
  if (tab === "settings") content = <section className="admin-content settings-form"><div className="content-head"><h2>İletişim &amp; site bilgileri</h2></div><form className="admin-form" onSubmit={event => { event.preventDefault(); setData("settings", Object.fromEntries(new FormData(event.currentTarget))); notify("Site bilgileri kaydedildi."); }}>
    <div className="field"><label htmlFor="set-email">E-posta</label><input id="set-email" name="email" type="email" required defaultValue={data.settings.email} /></div>
    <div className="field"><label htmlFor="set-phone">Telefon</label><input id="set-phone" name="phone" required defaultValue={data.settings.phone} /></div>
    <div className="field full"><label htmlFor="set-address">Konum / görüşme bilgisi</label><input id="set-address" name="address" required defaultValue={data.settings.address} /></div>
    <div className="field full"><label htmlFor="set-hours">Çalışma saatleri</label><input id="set-hours" name="hours" required defaultValue={data.settings.hours} /></div>
    <div className="field full"><label htmlFor="set-social">Instagram kullanıcı adı</label><input id="set-social" name="instagram" defaultValue={data.settings.instagram} /></div>
    <div className="admin-actions"><button className="admin-btn">Değişiklikleri kaydet</button></div>
  </form></section>;

  function updateStatus(itemId, status) {
    setData("appointments", items => items.map(item => item.id === itemId ? { ...item, status } : item));
  }

  return (
    <main className="admin-view admin-shell">
      <aside className="admin-sidebar"><Brand /><nav className="admin-nav">{tabs.map(([key, icon, title]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}><span>{icon}</span>{title}{key === "appointments" && pending > 0 && <small>{pending}</small>}</button>)}</nav><div className="admin-sidebar-bottom"><span>Yönetici</span><button id="logout" onClick={onLogout}>Çıkış ↗</button></div></aside>
      <section className="admin-main"><header className="admin-top"><div><h1>{tabs.find(item => item[0] === tab)[2]}</h1><p>Merhaba Buse, bugün güzel bir gün.</p></div><div className="admin-top-right">{new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div></header>{content}</section>
      {editor && <ContentEditor type={editor.type} item={editor.item} onSave={saveContent} onClose={() => setEditor(null)} />}
    </main>
  );
}

export default function App() {
  const [services, setServices] = useStoredData("services");
  const [posts, setPosts] = useStoredData("posts");
  const [appointments, setAppointments] = useStoredData("appointments");
  const [settings, setSettings] = useStoredData("settings");
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("buse-admin") === "true");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const route = () => setIsAdmin(window.location.hash === "#admin" || window.location.pathname.replace(/\/+$/, "").endsWith("/admin"));
    route();
    window.addEventListener("hashchange", route);
    window.addEventListener("popstate", route);
    return () => {
      window.removeEventListener("hashchange", route);
      window.removeEventListener("popstate", route);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("site-page", !isAdmin);
    document.body.classList.toggle("admin-page", isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    document.title = isAdmin ? "Yönetim Paneli — Buse Coşkun" : "Uzman Klinik Psikolog Buse Coşkun";
  }, [isAdmin]);

  useEffect(() => {
    if (toast) {
      const timer = window.setTimeout(() => setToast(""), 3300);
      return () => window.clearTimeout(timer);
    }
  }, [toast]);

  function setData(key, updater) {
    const setters = { services: setServices, posts: setPosts, appointments: setAppointments, settings: setSettings };
    setters[key](updater);
  }

  function login() {
    sessionStorage.setItem("buse-admin", "true");
    setLoggedIn(true);
  }

  function logout() {
    sessionStorage.removeItem("buse-admin");
    setLoggedIn(false);
  }

  const data = { services, posts, appointments, settings };
  return <>
    {isAdmin ? loggedIn ? <Dashboard data={data} setData={setData} onLogout={logout} notify={setToast} /> : <AdminLogin onLogin={login} notify={setToast} /> : <Site data={data} notify={setToast} />}
    {toast && <div className={isAdmin ? "admin-toast" : "toast show"} role="status" aria-live="polite">{toast}</div>}
  </>;
}
