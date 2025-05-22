import { useTranslation } from "react-i18next";

export default function TermsConditions() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {t('footer.termsConditions')}
      </h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">
          Bu kullanım koşulları, VIP Ride Istanbul Airport hizmetlerini kullanırken uymanız gereken kuralları ve şartları belirler.
        </p>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Rezervasyon Koşulları</h2>
        <p className="text-gray-600 mb-4">
          Rezervasyon yaparken aşağıdaki koşullara uymanız gerekmektedir:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Doğru ve güncel bilgiler sağlamak</li>
          <li>Rezervasyon için gerekli ödemeyi zamanında yapmak</li>
          <li>İptal politikamıza uymak</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Hizmet Kullanımı</h2>
        <p className="text-gray-600 mb-4">
          Hizmetlerimizi kullanırken:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Şoförlerimize saygılı davranmanız beklenir</li>
          <li>Araç içi kurallara uymanız gerekir</li>
          <li>Güvenlik önlemlerine uymanız zorunludur</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Ödeme Koşulları</h2>
        <p className="text-gray-600 mb-4">
          Ödemelerle ilgili önemli bilgiler:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Fiyatlarımız vergiler dahildir</li>
          <li>Ödemeler güvenli ödeme sistemleri üzerinden yapılır</li>
          <li>İade politikamız ayrıca belirtilmiştir</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Sorumluluk Sınırları</h2>
        <p className="text-gray-600 mb-4">
          VIP Ride Istanbul Airport, aşağıdaki durumlarda sorumluluk kabul etmez:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Doğal afetler ve olağanüstü durumlar</li>
          <li>Müşteri kaynaklı gecikmeler</li>
          <li>Yanlış bilgi verilmesi durumunda</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İletişim</h2>
        <p className="text-gray-600 mb-4">
          Kullanım koşulları hakkında sorularınız için:
        </p>
        <p className="text-gray-600">
          E-posta: info@viprideistanbulairport.com<br />
          Telefon: +90 543 156 8648
        </p>
      </div>
    </div>
  );
} 