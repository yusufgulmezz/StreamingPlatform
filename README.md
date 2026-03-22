# 🎬 Streaming Platform Architecture Demo

Bu proje, temel bir CRUD uygulamasından ziyade **Nesne Yönelimli Programlama (OOP)** prensiplerinin ve tasarım desenlerinin (**Design Patterns**) uygulanışını gösteren tam yığın (full-stack) bir web uygulamasıdır.

Proje, Java Spring Boot ile yazılmış RESTful bir arka plan (backend) ve bu arka planın mimarisini görselleştiren React + TypeScript + Vite tabanlı modern bir ön yüz (frontend) kontrol panelinden (dashboard) oluşmaktadır.

---

## 🏛️ Mimari ve Tasarım Desenleri

Projede kullanılan temel yazılım prensipleri ve hangi senaryolarda kullanıldıkları aşağıda özetlenmiştir:

### 1. OOP Prensipleri: Kalıtım (Inheritance) ve Polimorfizm (Polymorphism)
Sistemde temel bir `Content` adında soyut (abstract) sınıf bulunur. Bu sınıftan türetilen dört farklı içerik tipi vardır:
- **`Movie`** (Film)
- **`Series`** (Dizi)
- **`Documentary`** (Belgesel)
- **`Podcast`**

Bu sınıflar **`Playable`** (Oynatılabilir) ve **`Downloadable`** (İndirilebilir) interfacelerini (arayüz) implement ederler. Örneğin; filmler sadece izlenebilirken, podcastler hem izlenebilir (dinlenebilir) hem de çevrimdışı kullanım için indirilebilir.

### 2. Strategy Pattern (Strateji Deseni)
Kullanıcıların **Abonelik Tiplerini (Basic, Standard, Premium)** yönetmek için kullanılmıştır. 
Abonelik kuralları (maksimum çözünürlük, aylık ücret vb.) kod içerisinde if-else bloklarına sıkıştırılmak yerine her biri farklı bir Strateji Sınıfına ayrılmıştır (`BasicSubscription`, `StandardSubscription`, `PremiumSubscription`). Yeni bir abonelik planı eklenmek istendiğinde (Örn: Öğrenci Planı) sadece yeni bir sınıf oluşturmak yeterlidir. Bu, Open/Closed (Açık/Kapalı) prensibinin güzel bir uygulamasıdır.

### 3. Proxy Pattern (Vekil Deseni)
İçeriklerin oynatılması sırasında **Yaş Kısıtlaması (Age Restriction)** kontrolü yapmak için kullanılmıştır.
İstemci doğrudan içeriği oynatmak yerine aracı bir sınıfa (`ContentPlayProxy`) istek atar. Bu vekil sınıf, kullanıcının yaşının içeriğin minimum yaş sınırını karşılayıp karşılamadığını kontrol eder. Uygun değilse erişimi engeller, uygunsa isteği asıl `Playable` nesnesine iletir. 

### 4. Iterator Pattern (Yineleyici Deseni)
Kullanıcıların **İzleme Listesinde (Watchlist)** gezinmek için kullanılmıştır.
Liste bellekte nasıl tutulursa tutulsun (Array, List, Set vs.), kullanıcının `hasNext()` ve `next()` metotlarıyla bu içerikler arasında her zaman ardışık ve güvenli bir şekilde dolaşabilmesini sağlar. Veri yapısı dış dünyadan soyutlanmıştır.

---

## 🛠️ Teknolojiler

### Backend
- **Java 17+**
- **Spring Boot 3** (Spring Web, Spring Data JPA)
- **H2 in-memory Database** (Test ve geliştirme kolaylığı için)
- **Lombok**
- **Springdoc OpenAPI (Swagger UI)**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **React Router v6**
- **Vanilla CSS (Dark Streaming Theme)**

---

## 🚀 Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz:

### 1. Backend'i Başlatma (Spring Boot)
Proje kök dizininde (`StreamingPlatform` klasöründe) terminal açın ve aşağıdaki Maven komutunu girin:
```bash
# Windows
mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```
*Backend `http://localhost:8080` portunda ayağa kalkacaktır. Swagger dokümantasyonuna ulaşmak için: `http://localhost:8080/swagger-ui.html` adresine gidebilirsiniz.*

### 2. Frontend'i Başlatma (React/Vite)
Kök dizin içerisindeki `frontend` klasörüne girin, bağımlılıkları yükleyin ve sunucuyu başlatın:
```bash
cd frontend
npm install
npm run dev
```
*Frontend genellikle `http://localhost:5173` adresinde çalışacaktır. Tarayıcınızdan bu adresi açarak interaktif Dashboard'u incelemeye başlayabilirsiniz.*

---

## 🎨 Arayüz (Dashboard) Hakkında

Frontend arayüzü 4 ana bölüme ayrılmıştır:
1. **🎬 Oynatıcı (Katalog):** OOP sınıf kalıtımlarını ve `Playable`/`Downloadable` rozetlerini gösterir.
2. **👤 Kullanıcılar & Abonelik:** Strategy Pattern'ı kullanarak abonelik türlerinin anlık olarak nasıl davrandığını ve değiştiğini görselleştirir.
3. **▶️ İçerik Oynatıcı:** Proxy Pattern üzerinden Yaş Kısıtlaması testini interaktif bir şekilde deneyimleme sunar.
4. **📋 İzleme Listesi:** Iterator Pattern üzerinden liste öğelerinin nasıl numaralandırılıp gezildiğini gösterir.

Tüm bu sayfalar, her desenin ne işe yaradığını açıklayan dinamik bilgi panellerine sahiptir.
