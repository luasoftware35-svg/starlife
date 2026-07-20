import { COMPANY as DEFAULT_COMPANY } from '../mock/mock';

export function getKvkkSections(company = DEFAULT_COMPANY) {
  return [
    {
      title: '1. Veri Sorumlusu',
      paragraphs: [
        `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla ${company.name} ("Şirket") kişisel verilerinizin güvenliğini sağlamayı, mevzuata uygun şekilde işlemeyi ve korunmasını sağlamayı taahhüt eder.`,
        `Veri Sorumlusu: ${company.name}`,
        `Adres: ${company.address}`,
        `Telefon (Sabit Hat): ${company.phone}`,
        `Telefon (Özel Projeler): ${company.phoneProjects}`,
        `E-posta: ${company.email}`,
      ],
    },
    {
      title: '2. İşlenen Kişisel Veri Kategorileri',
      paragraphs: [
        'Web sitemiz, iletişim formları, insan kaynakları başvuruları ve kurumsal iletişim kanalları aracılığıyla aşağıdaki kişisel veri kategorileri işlenebilir:',
      ],
      list: [
        'Kimlik bilgileri (ad, soyad)',
        'İletişim bilgileri (telefon, e-posta, adres)',
        'Mesleki deneyim ve başvuru bilgileri (özgeçmiş özeti, pozisyon tercihi)',
        'Talep ve şikâyet içerikleri',
        'İşlem güvenliği verileri (IP adresi, tarayıcı bilgisi, oturum kayıtları)',
        'Pazarlama ve tercih bilgileri (açık rıza verilmesi halinde)',
      ],
    },
    {
      title: '3. Kişisel Verilerin İşlenme Amaçları',
      paragraphs: [
        'Kişisel verileriniz aşağıdaki amaçlarla sınırlı olarak işlenmektedir:',
      ],
      list: [
        'İletişim taleplerinin alınması, değerlendirilmesi ve yanıtlanması',
        'Konut, taahhüt ve yatırım projeleri hakkında bilgilendirme yapılması',
        'İnsan kaynakları başvurularının değerlendirilmesi',
        'Sözleşme süreçlerinin yürütülmesi ve müşteri ilişkileri yönetimi',
        'Hukuki yükümlülüklerin yerine getirilmesi',
        'Bilgi güvenliği süreçlerinin yürütülmesi',
        'Web sitesi performansının ölçülmesi ve kullanıcı deneyiminin iyileştirilmesi (açık rıza ile)',
      ],
    },
    {
      title: '4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi',
      paragraphs: [
        'Kişisel verileriniz; web sitesi formları, e-posta, telefon, fiziki başvurular ve çerezler aracılığıyla otomatik veya otomatik olmayan yollarla toplanabilir.',
        'Verileriniz KVKK\'nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanılarak işlenir: açık rızanız, sözleşmenin kurulması veya ifası, hukuki yükümlülük, meşru menfaat ve kanunlarda açıkça öngörülmesi.',
      ],
    },
    {
      title: '5. Kişisel Verilerin Aktarılması',
      paragraphs: [
        'Kişisel verileriniz; yalnızca belirtilen amaçlarla sınırlı olmak kaydıyla iş ortaklarımıza, tedarikçilerimize, hukuken yetkili kamu kurum ve kuruluşlarına ve gerektiğinde avukat/danışman gibi hizmet sağlayıcılara aktarılabilir.',
        'Google Maps gibi üçüncü taraf hizmetler yalnızca çerez tercihlerinize uygun şekilde yüklenir. Üçüncü taraf sağlayıcıların kendi gizlilik politikaları geçerlidir.',
      ],
    },
    {
      title: '6. Kişisel Verilerin Saklama Süresi',
      paragraphs: [
        'Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri dikkate alınarak saklanır. Süre sonunda veriler silinir, yok edilir veya anonim hale getirilir.',
      ],
    },
    {
      title: '7. KVKK Kapsamındaki Haklarınız',
      paragraphs: [
        'KVKK\'nın 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:',
      ],
      list: [
        'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
        'İşlenmişse buna ilişkin bilgi talep etme',
        'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
        'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
        'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
        'KVKK\'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
        'Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
        'Münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
        'Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
      ],
    },
    {
      title: '8. Başvuru Yöntemi',
      paragraphs: [
        `Haklarınıza ilişkin taleplerinizi ${company.email} e-posta adresine veya ${company.address} adresine yazılı olarak iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.`,
        'Başvurularınızda kimliğinizi doğrulayıcı bilgiler bulunmalıdır. Talebiniz reddedilirse gerekçesi yazılı olarak bildirilir.',
      ],
    },
    {
      title: '9. Güncellemeler',
      paragraphs: [
        'Bu aydınlatma metni, mevzuat veya iş süreçlerindeki değişiklikler doğrultusunda güncellenebilir. Güncel metin her zaman web sitemizde yayımlanır.',
        `Son güncelleme: ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      ],
    },
  ];
}

export function getCookiePolicySections(company = DEFAULT_COMPANY) {
  return [
    {
      title: '1. Çerez Nedir?',
      paragraphs: [
        'Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Site işlevselliğini sağlamak, tercihlerinizi hatırlamak ve kullanım deneyimini iyileştirmek için kullanılabilir.',
      ],
    },
    {
      title: '2. Kullandığımız Çerez Türleri',
      paragraphs: [
        'Starlife İnşaat web sitesinde aşağıdaki çerez kategorileri kullanılmaktadır:',
      ],
      list: [
        'Zorunlu çerezler: Oturum yönetimi, güvenlik ve temel site işlevleri için gereklidir.',
        'Tercih çerezleri: Çerez onay tercihlerinizi hatırlamak için kullanılır.',
        'İşlevsel / üçüncü taraf çerezleri: Google Maps harita embed içeriği yalnızca onay vermeniz halinde yüklenir.',
      ],
    },
    {
      title: '3. Üçüncü Taraf Hizmetler',
      paragraphs: [
        'İletişim sayfalarında kullanılan Google Maps hizmeti Google LLC tarafından sunulmaktadır. Harita görüntülenmesi sırasında Google tarafından çerez ve benzeri teknolojiler kullanılabilir.',
        'Google gizlilik politikası: https://policies.google.com/privacy',
      ],
    },
    {
      title: '4. Çerez Tercihlerinizi Yönetme',
      paragraphs: [
        'Siteye ilk girişinizde çerez bildirim bandı aracılığıyla tercihlerinizi belirleyebilirsiniz. "Kabul Et" seçeneği işlevsel çerezlerin (Google Maps dahil) yüklenmesine izin verir. "Yalnızca Zorunlu" seçeneği harita gibi üçüncü taraf içeriklerin yüklenmesini engeller.',
        'Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; bu durumda sitenin bazı bölümleri düzgün çalışmayabilir.',
      ],
    },
    {
      title: '5. Kişisel Veriler ve İletişim',
      paragraphs: [
        'Çerezler aracılığıyla elde edilen veriler KVKK kapsamında kişisel veri niteliğinde olabilir. Detaylı bilgi için KVKK Aydınlatma Metnimizi inceleyebilirsiniz.',
        `Sorularınız için ${company.email} adresine, ${company.phone} (sabit hat) veya ${company.phoneProjects} (özel projeler) numaralarına ulaşabilirsiniz.`,
      ],
    },
  ];
}
