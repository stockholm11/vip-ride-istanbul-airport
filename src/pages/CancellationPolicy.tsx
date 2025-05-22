import { useTranslation } from "react-i18next";

export default function CancellationPolicy() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {t('footer.cancellationPolicy')}
      </h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">
          VIP Ride Istanbul Airport iptal politikası, rezervasyonlarınızı iptal etme koşullarını ve iade şartlarını belirler.
        </p>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İptal Koşulları</h2>
        <p className="text-gray-600 mb-4">
          Rezervasyon iptalleri için aşağıdaki koşullar geçerlidir:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>24 saat öncesine kadar yapılan iptallerde tam iade</li>
          <li>12-24 saat arası yapılan iptallerde %50 iade</li>
          <li>12 saatten kısa sürede yapılan iptallerde iade yapılmaz</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İade İşlemleri</h2>
        <p className="text-gray-600 mb-4">
          İade işlemleri şu şekilde gerçekleştirilir:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>İadeler orijinal ödeme yöntemine yapılır</li>
          <li>İade işlemi 5-7 iş günü içinde tamamlanır</li>
          <li>Banka işlem ücretleri iade tutarından düşülür</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Özel Durumlar</h2>
        <p className="text-gray-600 mb-4">
          Aşağıdaki durumlarda farklı iptal koşulları uygulanabilir:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Doğal afetler ve olağanüstü durumlar</li>
          <li>Havalimanı uçuş iptalleri</li>
          <li>Sağlık sorunları (doktor raporu ile)</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İptal Talebi</h2>
        <p className="text-gray-600 mb-4">
          İptal taleplerinizi aşağıdaki yöntemlerle iletebilirsiniz:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Telefon ile: +90 543 156 8648</li>
          <li>E-posta ile: info@viprideistanbulairport.com</li>
          <li>WhatsApp ile: +90 543 156 8648</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary mt-8 mb-4">İletişim</h2>
        <p className="text-gray-600 mb-4">
          İptal politikası hakkında sorularınız için:
        </p>
        <p className="text-gray-600">
          E-posta: info@viprideistanbulairport.com<br />
          Telefon: +90 543 156 8648
        </p>
      </div>
    </div>
  );
} 