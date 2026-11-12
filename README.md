# Psikolog Buse Coşkun

## Yönetim paneli ve kalıcı JSON verileri

Yönetim paneli `/admin` adresinde bulunur. İçerik ve site ayarları Vercel Blob'da
özel erişimli ayrı JSON dosyaları olarak saklanır:

- `admin/services.json`
- `admin/posts.json`
- `admin/settings.json`
- Her randevu için `admin/appointments/<id>.json`

Genel bakış, randevu ve içerik dosyalarından hesaplanır. Panelden yapılan
değişiklikler kaydedildiği anda canlı site API üzerinden güncel veriyi okur;
bu içerik değişiklikleri için yeniden dağıtım gerekmez.

Vercel projesinde **Storage → Create Storage → Blob** yoluyla **Private** bir
Blob deposu oluşturup projeye bağlayın. Vercel OIDC bağlantısı tercih edilir;
yerel geliştirme için `BLOB_READ_WRITE_TOKEN` değerini Vercel ortam
değişkenlerinden alın. Depoyu Production, Preview ve ihtiyaç varsa Development
ortamlarına bağlayın.

Vercel proje ayarlarında ayrıca şu sunucu ortam değişkenlerini tanımlayın:

- `ADMIN_USERNAME`: yönetici kullanıcı adı
- `ADMIN_PASSWORD`: en az 12 karakterli, güçlü yönetici parolası
- `ADMIN_SESSION_SECRET`: en az 32 karakterli, rastgele oturum imzalama anahtarı

Bu değerleri kaynak koda veya `VITE_` önekli değişkenlere koymayın. Değişkenleri
ekledikten sonra yeni bir Vercel dağıtımı başlatın. Önceki sürümde yalnızca
tarayıcıda bulunan yerel kayıtlar otomatik olarak Blob'a taşınmaz.

## Vercel SMTP kurulumu

Randevu formu talepleri önce Vercel Blob'a kaydedilir. SMTP ayarları
yapılandırılmışsa bildirim e-postası da `info@psikologbusecoskun.com` adresine
gönderilir. Dağıtımdan önce Vercel proje ayarlarında şu ortam değişkenlerini tanımlayın:

- `SMTP_HOST`: SMTP sunucusunun adresi
- `SMTP_PORT`: SMTP sunucu portu; ör. `465` veya `587`
- `SMTP_SECURE`: Doğrudan TLS için `true`, STARTTLS için `false`
- `SMTP_USER`: SMTP hesap kullanıcı adı
- `SMTP_PASSWORD`: SMTP parolası veya uygulama parolası
- `SMTP_FROM_EMAIL` (isteğe bağlı): SMTP sağlayıcısının kabul ettiği gönderici
  adresi; belirtilmezse `SMTP_USER` kullanılır

SMTP bilgilerini kaynak koda eklemeyin veya `VITE_` önekiyle tanımlamayın.
Değişkenleri ekledikten sonra Vercel dağıtımını yeniden başlatın.

Ön yüzü derlemek için `npm run build`, API işleviyle birlikte yerel olarak
çalıştırmak için `vercel dev` kullanın.
