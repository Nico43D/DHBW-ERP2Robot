import React from 'react';
import { Card } from '../components/Card';
import { Building } from 'lucide-react';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Impressum
          </h1>
        </div>

        <Card className="p-6 md:p-8 space-y-8">
          {/* Company Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold text-gray-900 text-lg">Duale Süßigkeiten GmbH</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Commercial Register */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Handelsregister</h2>
            <div className="space-y-1 text-gray-700">
              <p>Eintragung im Handelsregister</p>
              <p><strong>Registergericht:</strong> Amtsgericht Berlin-Charlottenburg</p>
              <p><strong>Registernummer:</strong> HRB 123456 B</p>
            </div>
          </section>

          {/* Representatives */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertreten durch</h2>
            <div className="space-y-1 text-gray-700">
              <p><strong>Geschäftsführer:</strong></p>
              <p>Max Mustermann</p>
              <p>Erika Musterfrau</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <div className="space-y-1 text-gray-700">
              <p>
                <strong>Telefon:</strong>{' '}
                <a href="tel:+4930123456789" className="text-[#EB1A2B] hover:underline">
                  +49 30 12345678-9
                </a>
              </p>
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:info@duale-suessigkeiten.de" className="text-[#EB1A2B] hover:underline">
                  info@duale-suessigkeiten.de
                </a>
              </p>
            </div>
          </section>

          {/* VAT ID */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Umsatzsteuer-ID</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              </p>
              <p><strong>DE123456789</strong></p>
            </div>
          </section>

          {/* Responsible for content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <div className="space-y-1 text-gray-700">
              <p>Max Mustermann</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
            </div>
          </section>

          {/* EU Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              EU-Streitschlichtung
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) 
                bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#EB1A2B] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </div>
          </section>

          {/* Consumer Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Liability for content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen 
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir 
                als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist 
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. 
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte 
                umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Liability for links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir 
                keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine 
                Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
                Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche 
                Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung 
                nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist 
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei 
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen 
                Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt 
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte 
                Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden 
                Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte 
                umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Image Sources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bildnachweise</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                Die auf dieser Website verwendeten Produktbilder sind Eigentum der jeweiligen 
                Hersteller oder wurden mit deren Genehmigung verwendet:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Knoppers - Storck KG</li>
                <li>Ferrero Küsschen - Ferrero Deutschland GmbH</li>
                <li>Nougat Happen - Lizenzierte Produktfotografie</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600">
              Stand: Februar 2026
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
