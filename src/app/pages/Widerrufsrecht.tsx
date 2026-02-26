import React from 'react';
import { Card } from '../components/Card';
import { FileText } from 'lucide-react';

export default function Widerrufsrecht() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Widerrufsrecht & Widerrufsformular
          </h1>
        </div>

        {/* Widerrufsbelehrung */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Widerrufsbelehrung</h2>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Widerrufsrecht</h3>
              <p>
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag 
                zu widerrufen.
              </p>
            </div>

            <div>
              <p>
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen 
                benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben 
                bzw. hat.
              </p>
            </div>

            <div>
              <p>
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
              </p>
              <div className="bg-gray-50 p-4 rounded-lg my-3">
                <p className="font-semibold text-gray-900">Duale Süßigkeiten GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail:</strong> widerruf@duale-suessigkeiten.de<br />
                  <strong>Telefon:</strong> +49 30 12345678-9
                </p>
              </div>
              <p>
                mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder 
                E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
            </div>

            <div>
              <p>
                Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht 
                vorgeschrieben ist.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Zur Wahrung der Widerrufsfrist reicht es aus,</strong> dass Sie die 
                Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist 
                absenden.
              </p>
            </div>
          </div>
        </Card>

        {/* Folgen des Widerrufs */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Folgen des Widerrufs</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen 
              erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, 
              die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns 
              angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens 
              binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren 
              Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>

            <p>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der 
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich 
              etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte 
              berechnet.
            </p>

            <p>
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben 
              oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je 
              nachdem, welches der frühere Zeitpunkt ist.
            </p>

            <p>
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab 
              dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns 
              zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf 
              der Frist von vierzehn Tagen absenden.
            </p>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</strong>
              </p>
            </div>

            <p>
              Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser 
              Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise 
              der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
            </p>
          </div>
        </Card>

        {/* Ausschluss des Widerrufsrechts */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht 
              vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung 
              durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen 
              Bedürfnisse des Verbrauchers zugeschnitten sind.
            </p>

            <p>
              Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung versiegelter Waren, 
              die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet 
              sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde.
            </p>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Wichtig für Lebensmittel:</strong> Aus hygienischen Gründen ist das 
                Widerrufsrecht ausgeschlossen, sobald die Originalversiegelung der Produkte geöffnet 
                wurde.
              </p>
            </div>
          </div>
        </Card>

        {/* Widerrufsformular */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Muster-Widerrufsformular</h2>
          
          <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-lg">
            <p className="text-sm text-gray-600 mb-4 italic">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus 
              und senden Sie es zurück.)
            </p>

            <div className="space-y-4 text-gray-700">
              <p>An:</p>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Duale Süßigkeiten GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-2">E-Mail: widerruf@duale-suessigkeiten.de</p>
              </div>

              <div className="border-t border-gray-300 pt-4 mt-6">
                <p className="mb-3">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über 
                  den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </p>

                <div className="space-y-3 ml-4">
                  <p>_________________________________________________________________</p>
                  <p>_________________________________________________________________</p>
                  
                  <p className="mt-4">Bestellt am (*) / erhalten am (*)</p>
                  <p>_________________________________________________________________</p>
                  
                  <p className="mt-4">Name des/der Verbraucher(s)</p>
                  <p>_________________________________________________________________</p>
                  
                  <p className="mt-4">Anschrift des/der Verbraucher(s)</p>
                  <p>_________________________________________________________________</p>
                  <p>_________________________________________________________________</p>
                  
                  <p className="mt-4">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
                  <p>_________________________________________________________________</p>
                  
                  <p className="mt-4">Datum</p>
                  <p>_________________________________________________________________</p>
                </div>

                <p className="text-sm text-gray-600 mt-6 italic">
                  (*) Unzutreffendes streichen.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Hinweis:</strong> Sie können dieses Formular auch als E-Mail an 
              widerruf@duale-suessigkeiten.de senden oder uns telefonisch kontaktieren. 
              Eine formlose Mitteilung ist ebenfalls ausreichend.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
