import React from 'react';
import { Card } from '../components/Card';
import { Shield } from 'lucide-react';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Datenschutzerklärung
          </h1>
        </div>

        <Card className="p-6 md:p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Allgemeine Hinweise</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Verantwortliche Stelle</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Duale Süßigkeiten GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail:</strong> datenschutz@duale-suessigkeiten.de<br />
                  <strong>Telefon:</strong> +49 30 12345678-9
                </p>
              </div>
              <p>
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von 
                personenbezogenen Daten entscheidet.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem 
                Endgerät gespeichert werden und die Ihr Browser speichert. Sie richten keinen 
                Schaden an.
              </p>
              <p>
                Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. 
                Sie ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
              </p>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies 
                informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies 
                für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der 
                Cookies beim Schließen des Browsers aktivieren.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Server-Log-Dateien</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in 
                so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. 
                Dies sind:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p>
                Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung 
                dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der 
                Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien 
                Darstellung und der Optimierung seiner Website.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Kontaktformular</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>
              <p>
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser 
                Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit 
                der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
                Maßnahmen erforderlich ist.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Registrierung und Kundenkonto</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Zur Nutzung unseres Online-Shops ist die Registrierung eines Kundenkontos 
                erforderlich. Bei der Registrierung erheben wir folgende personenbezogene Daten:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Vor- und Nachname</li>
                <li>E-Mail-Adresse</li>
                <li>Rechnungsadresse (Straße, PLZ, Ort, Land)</li>
                <li>Optional: Lieferadresse</li>
                <li>Telefonnummer</li>
                <li>Bei Firmenkunden: Firmenname, Umsatzsteuer-ID</li>
              </ul>
              <p>
                Diese Daten werden zur Vertragsabwicklung und zur Erfüllung unserer vertraglichen 
                Pflichten benötigt. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
              </p>
              <p>
                Sie können Ihr Kundenkonto jederzeit löschen. Kontaktieren Sie uns hierzu per 
                E-Mail an datenschutz@duale-suessigkeiten.de.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Bestellabwicklung</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Zur Abwicklung Ihrer Bestellung arbeiten wir mit folgenden Dienstleistern zusammen:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Versanddienstleister</h3>
              <p>
                Wir geben Ihre personenbezogenen Daten im Rahmen der Vertragsabwicklung an das mit 
                der Lieferung beauftragte Transportunternehmen (DHL) weiter, soweit dies zur 
                Lieferung der Ware erforderlich ist. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b 
                DSGVO.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Zahlungsdienstleister</h3>
              <p>
                Bei Zahlung per Kreditkarte oder PayPal geben wir Ihre Zahlungsdaten an den 
                jeweiligen Zahlungsdienstleister weiter. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. 
                b DSGVO.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ihre Rechte</h2>
            <div className="space-y-3 text-gray-700">
              <p>Sie haben folgende Rechte:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Recht auf Auskunft:</strong> Sie haben das Recht, Auskunft über Ihre von 
                  uns verarbeiteten personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Berichtigung:</strong> Sie haben das Recht, unverzüglich die 
                  Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten 
                  personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Löschung:</strong> Sie haben das Recht, die Löschung Ihrer bei 
                  uns gespeicherten personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Einschränkung:</strong> Sie haben das Recht, die Einschränkung 
                  der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Ihre Daten 
                  in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.
                </li>
                <li>
                  <strong>Widerspruchsrecht:</strong> Sie haben das Recht, jederzeit gegen die 
                  Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen.
                </li>
                <li>
                  <strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei einer 
                  Aufsichtsbehörde zu beschweren.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Datensicherheit</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren 
                (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, 
                die von Ihrem Browser unterstützt wird.
              </p>
              <p>
                Darüber hinaus sichern wir unsere Website und sonstigen Systeme durch technische 
                und organisatorische Maßnahmen gegen Verlust, Zerstörung, Zugriff, Veränderung oder 
                Verbreitung Ihrer Daten durch unbefugte Personen ab.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Speicherdauer</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die 
                Erfüllung der Zwecke erforderlich ist oder soweit dies durch gesetzliche 
                Aufbewahrungsfristen vorgeschrieben ist.
              </p>
              <p>
                Nach Vertragsabwicklung werden Ihre Daten für die weitere Verarbeitung eingeschränkt 
                und nach Ablauf steuer- und handelsrechtlicher Aufbewahrungsfristen (in der Regel 10 
                Jahre) gelöscht, sofern Sie nicht ausdrücklich in eine weitere Nutzung Ihrer Daten 
                eingewilligt haben.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600">
              Stand: Februar 2026<br />
              Duale Süßigkeiten GmbH<br />
              Musterstraße 123, 10115 Berlin
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
