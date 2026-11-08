import React, { useEffect, useState } from "react";

const initialData = {
  services: [
    { id: "s1", title: "Bireysel Psikoterapi", description: "Ergen ve yetişkinlerle; Bilişsel Davranışçı Terapi (BDT) ve EMDR yaklaşımlarını içeren bireysel çalışmalar.", price: "50 dakika · Yüz yüze / online", icon: "○" },
    { id: "s2", title: "Sanat Terapisi", description: "Sanat terapisi temelli grup çalışmalarıyla kendinizi yaratıcı yollarla keşfedebileceğiniz bir alan.", price: "Grup çalışmaları", icon: "⌁" },
    { id: "s3", title: "Yaratıcı Atölyeler", description: "Duygulara, ilişkilere ve kendini keşfetmeye alan açan yaratıcı atölyeler.", price: "Atölye çalışmaları", icon: "✳" },
  ],
  posts: [
    { id: "p1", title: "Kendine şefkat göstermeyi öğrenmek", category: "İYİ OLMA HALİ", date: "12 MAYIS 2025", excerpt: "Kendimizle kurduğumuz ilişki, hayatımızdaki her ilişkiye eşlik eder. Peki bu ilişkiyi nasıl yumuşatabiliriz?" },
    { id: "p2", title: "Kaygı ile kalabilmek", category: "DUYGULAR", date: "28 NİSAN 2025", excerpt: "Kaygıyı susturmaya çalışmak yerine onu duymaya başladığımızda, bize anlatmak istediği şeyleri keşfedebiliriz." },
    { id: "p3", title: "Sınırlar, yakınlık ve kendimiz", category: "İLİŞKİLER", date: "04 NİSAN 2025", excerpt: "Sınır koymak uzaklaşmak değil; ilişkide kendimize de bir yer açabilmektir." },
  ],
  appointments: [],
  settings: {
    email: "psk.busecoskun@gmail.com",
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
          saved[field] === previousDefaults.settings[field] ? value : (saved[field] ?? value),
        ])),
      };
    }
    if (key === "services" && Array.isArray(saved)) {
      return saved.map(service => {
        const previous = previousDefaults.services.find(item => item.id === service.id);
        const current = initialData.services.find(item => item.id === service.id);
        if (!previous || !current) return service;
        return {
          ...service,
          ...Object.fromEntries(Object.entries(current).map(([field, value]) => [
            field,
            service[field] === previous[field] ? value : (service[field] ?? value),
          ])),
        };
      });
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
          <a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
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
        <h1><Reveal direction="down">İçine</Reveal><Reveal>bak.</Reveal><Reveal direction="down">Yer aç.</Reveal></h1>
        <Reveal direction="down"><p>Kendinle yeniden tanışmaya, hissettiklerine alan açmaya ve kendi yolunu bulmaya davetlisin.</p></Reveal>
        <Reveal className="hero-actions"><a className="pill dark" href="#contact">Bir adım at <span className="arrow">↗</span></a><a className="text-link" href="#about">Buse kimdir?</a></Reveal>
        <Reveal direction="down" className="hero-note">Burada, senin hızında.</Reveal>
      </div>
      <div className="hero-image reveal" role="img" aria-label="Uzman Klinik Psikolog Buse Coşkun portresi">
        <div className="hero-stamp">Kendine<br />dönmek<br />mümkün ✳</div>
        <div className="image-caption">Buse Coşkun &nbsp; / &nbsp; Uzman Klinik Psikolog</div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="intro">
      <div className="wrap intro-grid">
        <Reveal direction="down"><Eyebrow>01 &nbsp; / &nbsp; Yaklaşım</Eyebrow></Reveal>
        <div className="intro-copy">
          <Reveal><h2>Kendine dönmek, her şeyi <em>değiştirebilir.</em></h2></Reveal>
          <div className="intro-bottom">
            <Reveal direction="down"><p>Terapi; hazır cevaplar değil, kendini duyabileceğin bir alan. Yargısızca, birlikte ve senin hızında ilerleyen bir yolculuk.</p></Reveal>
            <Reveal direction="down"><a className="pill" href="#about">Nasıl çalışıyorum? <span className="arrow">↗</span></a></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ services }) {
  return (
    <section className="section wrap" id="services">
      <div className="section-head">
        <div><Reveal direction="down"><Eyebrow>02 &nbsp; / &nbsp; Yan yana</Eyebrow></Reveal><Reveal><h2 className="section-title">Birlikte<br />çalışalım.</h2></Reveal></div>
        <Reveal direction="down"><p className="section-subtitle">İhtiyacına ve yaşam ritmine göre, sana özel bir alan.</p></Reveal>
      </div>
      <div className="services">
        {services.map((service, index) => (
          <article className={`service-card reveal reveal-${index % 2 ? "down" : "up"}`} key={service.id}>
            <div className="service-top"><span className="service-index">0{index + 1} &nbsp; / &nbsp; 0{services.length}</span><span className="service-icon">{service.icon || "○"}</span></div>
            <div><h3>{service.title}</h3><p>{service.description}</p><div className="service-bottom"><span>{service.price}</span><a href="#contact" aria-label="Randevu al">↗</a></div></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FocusAreas() {
  const areas = [
    "Travmatik yaşantılar ve travma sonrası stres",
    "Anksiyete ve kaygı bozuklukları",
    "Depresyon ve duygu durum güçlükleri",
    "Panik bozukluk ve panik atak",
    "Duygu düzenleme güçlükleri",
    "Kişilik örüntüleri ve kişilik bozuklukları",
    "Ergenlik dönemine uyum ve kimlik gelişimi",
    "Sınav kaygısı ve akademik stres",
    "Akran ilişkileri ve sosyal uyum sorunları",
    "Aile içi iletişim ve çatışmalar",
    "Özsaygı ve benlik algısı",
    "İlişki ve kişilerarası iletişim sorunları",
  ];

  return (
    <section className="focus-section" id="focus">
      <div className="wrap focus-grid">
        <div className="focus-intro">
          <Eyebrow>Çalışma alanlarım</Eyebrow>
          <h2>Farklı yaşam deneyimlerine <em>birlikte</em> bakalım.</h2>
          <p>Ergen ve yetişkinlerle, kişinin ihtiyaçlarına ve kendi hikâyesine duyarlı bir yaklaşımla çalışıyorum.</p>
        </div>
        <ul className="focus-list">{areas.map(area => <li key={area}>{area}</li>)}</ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section wrap" id="about">
      <div className="about-grid">
        <Reveal direction="down" className="about-photo" role="img" aria-label="Uzman Klinik Psikolog Buse Coşkun portresi" />
        <div className="about-copy">
          <Reveal direction="down"><Eyebrow>03 &nbsp; / &nbsp; Merhaba, ben Buse</Eyebrow></Reveal>
          <Reveal direction="down"><h2>Uzman Klinik Psikolog <em>Buse Coşkun.</em></h2></Reveal>
          <Reveal><p>Üsküdar Üniversitesi Psikoloji Bölümü’nden mezun olduktan sonra aynı üniversitede Klinik Psikoloji yüksek lisans eğitimimi tamamladım. Mesleki çalışmalarımı Bilişsel Davranışçı Terapi (BDT), EMDR ve Sanat Terapisi alanlarında sürdürerek farklı terapi yaklaşımlarını mesleki pratiğime dahil ediyorum.</p></Reveal>
          <Reveal><p>Ergen ve yetişkinlerle bireysel psikoterapi çalışmalarının yanı sıra sanat terapisi temelli grup çalışmaları ve yaratıcı atölyeler gerçekleştiriyorum.</p></Reveal>
          <Reveal><p>Terapi sürecini, bireyin kendisini tanımasına, yaşantılarına farklı bir perspektiften bakabilmesine ve kendi içsel kaynaklarını keşfedebilmesine alan açan bir yolculuk olarak görüyorum. Her bireyin kendine özgü hikâyesine saygı duymayı, bilimsel ve etik ilkeler doğrultusunda güvene dayalı bir ilişki kurmayı önemsiyorum.</p></Reveal>
          <Reveal className="credentials"><div className="credential"><strong>Üsküdar Üniversitesi</strong>Psikoloji lisans</div><div className="credential"><strong>Klinik Psikoloji</strong>Yüksek lisans</div></Reveal>
          <Reveal className="approach-values">
            <strong>Çalışma ilkelerim</strong>
            <ul>{["Gizlilik ve mahremiyet", "Yargısız ve güvenli alan", "Bilimsel ve etik yaklaşım", "Bireysel farklılıklara saygı", "Güven temelli terapi ilişkisi"].map(value => <li key={value}>{value}</li>)}</ul>
          </Reveal>
          <Reveal><a className="text-link" href="#contact">Birlikte çalışalım ↗</a></Reveal>
        </div>
      </div>
    </section>
  );
}

function Journal({ posts }) {
  return (
    <section className="section journal" id="journal">
      <div className="wrap">
        <div className="section-head">
          <div><Reveal direction="down"><Eyebrow>04 &nbsp; / &nbsp; Düşünceler</Eyebrow></Reveal><Reveal><h2 className="section-title">Aklımdan<br />geçenler.</h2></Reveal></div>
          <Reveal direction="down"><p className="section-subtitle">Kendimize, duygularımıza ve ilişkilerimize dair küçük notlar.</p></Reveal>
        </div>
        <div className="journal-grid">{posts.map(post => (
          <article className="article reveal" key={post.id}>
            <div className="article-image" role="img" aria-label="Doğadan bir manzara" />
            <div className="article-meta"><span>{post.category}</span><span>{post.date}</span></div>
            <h3>{post.title}</h3><p>{post.excerpt}</p><a href="#contact">Yazıyı keşfet ↗</a>
          </article>
        ))}</div>
      </div>
    </section>
  );
}

function Booking({ services, settings, onSubmit }) {
  const phoneDigits = settings.phone.replace(/\D/g, "");
  const whatsappPhone = phoneDigits.startsWith("0") ? `90${phoneDigits.slice(1)}` : phoneDigits;
  const instagramHandle = settings.instagram.replace(/^@/, "");

  return (
    <section className="booking" id="contact">
      <div className="wrap booking-grid">
        <div className="booking-copy">
          <Reveal direction="down"><Eyebrow>05 &nbsp; / &nbsp; İlk adım</Eyebrow></Reveal>
          <Reveal><h2>Biraz<br />kendine<br /><em>yaklaş.</em></h2></Reveal>
          <Reveal><p>Tanışmak ve ihtiyaçlarınız üzerine konuşmak için iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağım.</p></Reveal>
          <Reveal className="booking-detail"><strong>Seans süresi</strong>Ortalama 50 dakika</Reveal>
          <Reveal className="booking-detail"><strong>Çalışma saatleri</strong>{settings.hours}</Reveal>
          <Reveal className="booking-detail"><strong>Konum</strong>{settings.address}</Reveal>
          <Reveal className="booking-contact">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>Telefon <strong>{settings.phone}</strong></a>
            <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer">WhatsApp üzerinden yazın <span aria-hidden="true">↗</span></a>
            <a href={`mailto:${settings.email}`}>E-posta <strong>{settings.email}</strong></a>
            <a href={`https://www.instagram.com/${instagramHandle}/`} target="_blank" rel="noreferrer">Instagram <strong>@{instagramHandle}</strong></a>
          </Reveal>
        </div>
        <form id="booking-form" className="booking-form reveal" onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field"><label htmlFor="name">Adınız soyadınız</label><input id="name" name="name" required autoComplete="name" placeholder="Adınız Soyadınız" /></div>
            <div className="field"><label htmlFor="email">E-posta adresiniz</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="ornek@email.com" /></div>
            <div className="field"><label htmlFor="phone">Telefon numaranız</label><input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+90 5XX XXX XX XX" /></div>
            <div className="field"><label htmlFor="service">Görüşme tercihiniz</label><select id="service" name="service" required defaultValue=""><option value="" disabled>Bir seçenek belirleyin</option>{services.map(service => <option key={service.id} value={service.title}>{service.title}</option>)}</select></div>
            <div className="field full"><label htmlFor="message">Paylaşmak istedikleriniz <span style={{ letterSpacing: 0, textTransform: "none" }}>(isteğe bağlı)</span></label><textarea id="message" name="message" placeholder="Kısaca not bırakabilirsiniz..." /></div>
          </div>
          <button className="pill dark" type="submit">Görüşme talep et <span className="arrow">↗</span></button>
          <p className="form-note">Bilgileriniz yalnızca size geri dönüş yapmak için kullanılır.</p>
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
          <div><Eyebrow>Keşfet</Eyebrow><a href="#about">Hakkımda</a><a href="#services">Çalışma alanlarım</a><a href="#journal">Journal</a></div>
          <div><Eyebrow>İletişim</Eyebrow><a href={`mailto:${settings.email}`}>{settings.email}</a><a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a><a href={`https://www.instagram.com/${instagramHandle}/`} target="_blank" rel="noreferrer">@{instagramHandle}</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Buse Coşkun. Tüm hakları saklıdır.</span><a href="#admin">Yönetici girişi ↗</a></div>
    </div></footer>
  );
}

function Site({ data, setAppointments, notify }) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(element => {
      observer.observe(element);
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) element.classList.add("is-visible");
    });
    return () => observer.disconnect();
  }, [data.services, data.posts]);

  function submitAppointment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const appointment = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name: fields.get("name").trim(),
      email: fields.get("email").trim(),
      phone: fields.get("phone").trim(),
      service: fields.get("service"),
      message: fields.get("message").trim(),
      date: new Date().toLocaleDateString("tr-TR"),
      status: "Beklemede",
    };
    setAppointments(previous => [appointment, ...previous]);
    form.reset();
    notify("Talebiniz ulaştı. En kısa sürede sizinle iletişime geçeceğim.");
  }

  return (
    <>
      <Header />
      <main>
        <Hero /><Marquee /><Intro />
        <Services services={data.services} /><FocusAreas />
        <section className="quote-band"><div className="wrap quote-inner reveal"><div className="quote-mark">“</div><blockquote>Her şey, kendine<br />kulak vermekle başlar.</blockquote><cite>Kendinle kurduğun ilişki, her şeyin başlangıcı.</cite></div></section>
        <About /><Journal posts={data.posts} /><Booking services={data.services} settings={data.settings} onSubmit={submitAppointment} />
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
    {isAdmin ? loggedIn ? <Dashboard data={data} setData={setData} onLogout={logout} notify={setToast} /> : <AdminLogin onLogin={login} notify={setToast} /> : <Site data={data} setAppointments={setAppointments} notify={setToast} />}
    {toast && <div className={isAdmin ? "admin-toast" : "toast show"} role="status" aria-live="polite">{toast}</div>}
  </>;
}
