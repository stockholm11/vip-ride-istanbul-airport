import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {t('footer.privacyPolicy')}
      </h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">
          Bu gizlilik politikası, VIP Ride Istanbul Airport'un kişisel verilerinizi nasıl topladığını, kullandığını ve koruduğunu açıklar.
        </p>
        
        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Toplanan Bilgiler</h2>
        <p className="text-gray-600 mb-4">
          Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Ad, soyad ve iletişim bilgileri</li>
          <li>Rezervasyon detayları</li>
          <li>Ödeme bilgileri</li>
          <li>İletişim geçmişi</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Bilgilerin Kullanımı</h2>
        <p className="text-gray-600 mb-4">
          Topladığımız bilgileri şu amaçlarla kullanırız:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Rezervasyonlarınızı işlemek ve yönetmek</li>
          <li>Hizmetlerimizi geliştirmek</li>
          <li>Size daha iyi hizmet sunmak</li>
          <li>Yasal yükümlülüklerimizi yerine getirmek</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Bilgi Güvenliği</h2>
        <p className="text-gray-600 mb-4">
          Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için uygun teknik ve organizasyonel önlemleri alırız.
        </p>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İletişim</h2>
        <p className="text-gray-600 mb-4">
          Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
        </p>
        <p className="text-gray-600">
          E-posta: info@viprideistanbulairport.com<br />
          Telefon: +90 543 156 8648
        </p>
      </div>
    </div>
  );
} 