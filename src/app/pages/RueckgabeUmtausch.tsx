import React from 'react';
import { Card } from '../components/Card';
import { RotateCcw, CheckCircle, Clock } from 'lucide-react';

export default function RueckgabeUmtausch() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Rückgabe & Umtausch
        </h1>

        {/* Return Policy Overview */}
        <Card className="p-6 md:p-8 mb-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                14 Tage Widerrufsrecht
              </h2>
              <p className="text-gray-700">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen 
                Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, 
                an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, 
                die Waren in Besitz genommen haben bzw. hat.
              </p>
            </div>
          </div>
        </Card>

        {/* Return Conditions */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Voraussetzungen für Rücksendungen</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#EB1A2B] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Originalverpackung:</strong> Die Artikel müssen unbenutzt und in 
                  der Originalverpackung zurückgeschickt werden.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#EB1A2B] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Versiegelte Produkte:</strong> Aus hygienischen Gründen müssen 
                  Lebensmittel ungeöffnet und originalversiegelt sein.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#EB1A2B] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Vollständigkeit:</strong> Bitte senden Sie alle Bestandteile der 
                  Lieferung zurück, einschließlich aller Verpackungsmaterialien und Beilagen.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#EB1A2B] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Frist:</strong> Die Rücksendung muss innerhalb von 14 Tagen nach 
                  Widerruf erfolgen.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Wichtig:</strong> Beschädigte oder unvollständige Rücksendungen können 
              leider nicht akzeptiert werden. Bitte verpacken Sie die Ware sorgfältig für den 
              Rückversand.
            </p>
          </div>
        </Card>

        {/* Return Process */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">So funktioniert die Rücksendung</h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Widerruf erklären</h3>
                <p className="text-gray-700 mb-2">
                  Informieren Sie uns über Ihren Widerruf per E-Mail an:
                </p>
                <a 
                  href="mailto:retoure@duale-suessigkeiten.de" 
                  className="text-[#EB1A2B] hover:underline font-medium"
                >
                  retoure@duale-suessigkeiten.de
                </a>
                <p className="text-gray-700 mt-2">
                  Geben Sie dabei Ihre Bestellnummer und die Artikel an, die Sie 
                  zurücksenden möchten.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ware verpacken</h3>
                <p className="text-gray-700">
                  Verpacken Sie die Artikel sicher in der Originalverpackung. Legen Sie 
                  eine Kopie der Rechnung oder einen Hinweis mit Ihrer Bestellnummer bei.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Paket versenden</h3>
                <p className="text-gray-700 mb-2">Senden Sie das Paket an folgende Adresse:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Duale Süßigkeiten GmbH</p>
                  <p className="text-gray-700">Retouren-Abteilung</p>
                  <p className="text-gray-700">Musterstraße 123</p>
                  <p className="text-gray-700">10115 Berlin</p>
                  <p className="text-gray-700">Deutschland</p>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Hinweis:</strong> Die Kosten der Rücksendung trägt der Kunde, 
                  es sei denn, die Ware ist fehlerhaft oder es wurde ein falscher Artikel geliefert.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Erstattung erhalten</h3>
                <p className="text-gray-700">
                  Nach Eingang und Prüfung Ihrer Rücksendung erstatten wir den Kaufpreis 
                  innerhalb von 14 Tagen auf das ursprüngliche Zahlungsmittel.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Exchange Policy */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Umtausch</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Wenn Sie einen Artikel gegen einen anderen austauschen möchten, gehen Sie bitte 
            wie folgt vor:
          </p>

          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            <li>Senden Sie den ursprünglichen Artikel wie oben beschrieben zurück</li>
            <li>Bestellen Sie den gewünschten Artikel neu in unserem Shop</li>
            <li>Nach Eingang der Rücksendung erfolgt die Erstattung</li>
          </ol>

          <p className="text-gray-700 mt-4">
            Dies stellt sicher, dass Sie Ihren Wunschartikel schnellstmöglich erhalten.
          </p>
        </Card>

        {/* Defective Items */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Fehlerhafte oder beschädigte Ware</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Sollten Sie fehlerhafte oder beschädigte Ware erhalten haben, kontaktieren Sie 
            uns bitte umgehend unter:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 mb-2">
              <strong>E-Mail:</strong>{' '}
              <a href="mailto:reklamation@duale-suessigkeiten.de" className="text-[#EB1A2B] hover:underline">
                reklamation@duale-suessigkeiten.de
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Telefon:</strong>{' '}
              <a href="tel:+4930123456789" className="text-[#EB1A2B] hover:underline">
                +49 30 12345678-9
              </a>
            </p>
          </div>

          <p className="text-gray-700">
            In diesem Fall übernehmen wir selbstverständlich alle Rücksendekosten und senden 
            Ihnen umgehend Ersatz oder erstatten den vollen Kaufpreis.
          </p>
        </Card>
      </div>
    </div>
  );
}
