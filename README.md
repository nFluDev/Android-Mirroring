# Android Mirroring

## Proje Hakkında

Android Mirroring, Electron framework'ü ve popüler açık kaynaklı araç `scrcpy`'yi kullanarak Android cihazınızın ekranını masaüstünüze yansıtan bir masaüstü uygulamasıdır. Bu uygulama, özellikle sunumlar, demo'lar veya sadece telefonunuzu bilgisayarınızdan rahatça yönetmek için basit ve etkili bir çözüm sunar.

`scrcpy` ve `adb` süreçlerini arka planda otomatik olarak yönetir, böylece kurulum ve kullanım süreci olabildiğince kolaydır.

## Özellikler

- **Basit Kullanım:** Tek tıkla Android ekranınızı anında yansıtın.
- **Otomatik Süreç Yönetimi:** `scrcpy` ve `adb` sunucularını uygulama başlangıcında otomatik olarak başlatır ve kapanışta temiz bir şekilde sonlandırır.
- **Güvenilir Bağlantı:** Uygulama açıldığında `adb` sunucusunu yeniden başlatarak kararlı bir bağlantı sağlar.
- **Yüksek Performans:** Özel olarak ayarlanmış `scrcpy` parametreleri sayesinde yüksek kare hızı ve akıcı video akışı sunar.
- **Profesyonel Geliştirme:** `Electron-builder` ile dağıtıma hazır paketler oluşturabilir.

## Ön Gereksinimler

Bu projeyi kullanmak veya geliştirmek için aşağıdaki araçlara ihtiyacınız vardır:

* **Node.js ve npm:** Uygulamanın bağımlılıklarını yönetmek ve çalıştırmak için gereklidir.
* **Android Cihaz:** USB hata ayıklama (USB debugging) modu etkinleştirilmiş bir Android cihaz.
* **scrcpy ve adb Binaries:** `scrcpy` ve `adb` çalıştırılabilir dosyalarını projenizin `scrcpy-bin/` klasörüne yerleştirmeniz gerekmektedir. Bu dosyaları [scrcpy'nin GitHub sayfasından](https://github.com/Genymobile/scrcpy/releases) indirebilirsiniz.

## Kurulum ve Kullanım

1.  **Depoyu Klonlama:**
    ```bash
    git clone [Proje_URL'niz]
    cd Android-Mirroring
    ```

2.  **Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```
3.  **Binaries'i Yerleştirme:**
    * `scrcpy-bin` klasörüne, indirdiğiniz `scrcpy` ve `adb` dosyalarını kopyalayın.

4.  **Geliştirme Modunda Çalıştırma:**
    ```bash
    npm start
    ```

## Üretim İçin Derleme (macOS)

Uygulamanızı Mac kullanıcıları için bir `.dmg` dosyası olarak paketlemek isterseniz, aşağıdaki adımları izleyin:

1.  **Icon Oluşturma:**
    * `Assets/icon.png` dosyasını `Assets/icon.icns` formatına dönüştürün.

2.  **Derleme Komutu:**
    * Sadece Intel Mac'ler için derlemek üzere aşağıdaki komutu çalıştırın:
    ```bash
    npm run dist
    ```
    * Oluşturulan `.dmg` dosyasını `dist` klasöründe bulabilirsiniz.

## Sorun Giderme

-   **"ADB çalıştırılamıyor" Hatası:** `scrcpy-bin/` klasörünüzdeki `adb` dosyasının varlığını ve çalıştırılabilir izinlerinin olup olmadığını kontrol edin.
-   **Bağlantı Sorunları:** USB kablonuzun sağlam olduğundan ve Android cihazınızda "USB Hata Ayıklama" ayarının etkin olduğundan emin olun.
-   **Performans Sorunları:** Uygulama kapanışında `adb` sunucusu yeniden başlatıldığı için performans sorunlarının çözülmesi beklenir. Eğer sorun devam ederse, arka planda çalışan diğer uygulamaları kontrol edin.

## Krediler

-   [**scrcpy**](https://github.com/Genymobile/scrcpy): Bu uygulamanın temelini oluşturan harika açık kaynaklı araç.
-   [**Electron**](https://www.electronjs.org/): Uygulamanın masaüstü platformu olarak kullanılan framework.
-   [**electron-builder**](https://www.electron.build/): Uygulamanın kolayca paketlenmesini sağlayan araç.

---

_Bu README, projenin en güncel durumuna göre hazırlanmıştır._