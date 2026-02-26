import React from 'react';
import { Card } from '../components/Card';

export default function AGB() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <Card className="p-6 md:p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 1 Geltungsbereich</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der Duale 
                Süßigkeiten GmbH (nachfolgend "Verkäufer") gelten für alle Verträge über die 
                Lieferung von Waren, die ein Verbraucher oder Unternehmer (nachfolgend "Kunde") 
                mit dem Verkäufer hinsichtlich der vom Verkäufer in seinem Online-Shop dargestellten 
                Waren abschließt.
              </p>
              <p>
                (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein 
                Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch 
                ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.
              </p>
              <p>
                (3) Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person 
                oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts 
                in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 2 Vertragsschluss</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Die im Online-Shop des Verkäufers enthaltenen Produktbeschreibungen stellen 
                keine verbindlichen Angebote seitens des Verkäufers dar, sondern dienen zur Abgabe 
                eines verbindlichen Angebots durch den Kunden.
              </p>
              <p>
                (2) Der Kunde kann das Angebot über das in den Online-Shop des Verkäufers integrierte 
                Online-Bestellformular abgeben. Dabei gibt der Kunde, nachdem er die ausgewählten 
                Waren in den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess 
                durchlaufen hat, durch Klicken des den Bestellvorgang abschließenden Buttons ein 
                rechtlich verbindliches Vertragsangebot in Bezug auf die im Warenkorb enthaltenen 
                Waren ab.
              </p>
              <p>
                (3) Der Verkäufer kann das Angebot des Kunden innerhalb von fünf Tagen annehmen, 
                indem er dem Kunden eine schriftliche Auftragsbestätigung oder eine Auftragsbestätigung 
                in Textform (E-Mail) übermittelt, wobei insoweit der Zugang der Auftragsbestätigung 
                beim Kunden maßgeblich ist, oder indem er dem Kunden die bestellte Ware liefert, 
                wobei insoweit der Zugang der Ware beim Kunden maßgeblich ist.
              </p>
              <p>
                (4) Vor verbindlicher Abgabe der Bestellung über das Online-Bestellformular kann 
                der Kunde mögliche Eingabefehler durch aufmerksames Lesen der auf dem Bildschirm 
                dargestellten Informationen erkennen. Die Bestellung kann jederzeit vor Absenden 
                korrigiert werden.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 3 Preise und Zahlungsbedingungen</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Alle Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer. 
                Zusätzlich zu den angegebenen Preisen berechnet der Verkäufer für die Lieferung 
                Versandkosten. Die Versandkosten werden dem Kunden auf einer gesonderten Seite 
                und in der Bestellübersicht deutlich mitgeteilt.
              </p>
              <p>
                (2) Die Zahlungsmöglichkeiten werden dem Kunden im Online-Shop des Verkäufers 
                mitgeteilt. Folgende Zahlungsmethoden stehen zur Verfügung:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Rechnung (Kauf auf Rechnung)</li>
                <li>PayPal</li>
                <li>Kreditkarte (Visa, Mastercard)</li>
              </ul>
              <p>
                (3) Bei Zahlung auf Rechnung ist der Rechnungsbetrag innerhalb von 14 Tagen nach 
                Erhalt der Ware ohne Abzug zu zahlen.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 4 Lieferung und Versand</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Die Lieferung von Waren erfolgt auf dem Versandweg an die vom Kunden angegebene 
                Lieferanschrift. Die Lieferzeit beträgt 2-3 Werktage nach Versand der Bestellung.
              </p>
              <p>
                (2) Sollte die Zustellung der Ware durch Verschulden des Kunden scheitern, trägt 
                der Kunde die dem Verkäufer hierdurch entstehenden angemessenen Kosten.
              </p>
              <p>
                (3) Bei Selbstabholung informiert der Verkäufer den Kunden zunächst per E-Mail 
                darüber, dass die von ihm bestellte Ware zur Abholung bereit steht. Nach Erhalt 
                dieser E-Mail kann der Kunde die Ware nach Absprache mit dem Verkäufer abholen.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 5 Eigentumsvorbehalt</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Der Verkäufer behält sich das Eigentum an der gelieferten Ware bis zur 
                vollständigen Zahlung des Kaufpreises vor.
              </p>
              <p>
                (2) Ist der Kunde Unternehmer, behält sich der Verkäufer das Eigentum an der Ware 
                bis zum vollständigen Ausgleich aller Forderungen aus der laufenden Geschäftsbeziehung 
                vor.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 6 Gewährleistung</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Es gelten die gesetzlichen Gewährleistungsrechte.
              </p>
              <p>
                (2) Der Kunde wird gebeten, angelieferte Waren mit offensichtlichen Transportschäden 
                bei dem Zusteller zu reklamieren und den Verkäufer hiervon in Kenntnis zu setzen. 
                Kommt der Kunde dem nicht nach, hat dies keinerlei Auswirkungen auf seine gesetzlichen 
                oder vertraglichen Gewährleistungsansprüche.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 7 Haftung</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Für Ansprüche aufgrund von Schäden, die durch den Verkäufer, seine gesetzlichen 
                Vertreter oder Erfüllungsgehilfen verursacht wurden, haftet der Verkäufer stets 
                unbeschränkt bei Verletzung von Leben, Körper und Gesundheit, bei vorsätzlicher oder 
                grob fahrlässiger Pflichtverletzung, bei Garantieversprechen, soweit vereinbart, oder 
                soweit der Anwendungsbereich des Produkthaftungsgesetzes eröffnet ist.
              </p>
              <p>
                (2) Bei Verletzung wesentlicher Vertragspflichten, deren Erfüllung die ordnungsgemäße 
                Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der 
                Vertragspartner regelmäßig vertrauen darf (Kardinalpflichten), durch leichte 
                Fahrlässigkeit seitens des Verkäufers, seiner gesetzlichen Vertreter oder 
                Erfüllungsgehilfen, ist die Haftung der Höhe nach auf den bei Vertragsschluss 
                vorhersehbaren Schaden begrenzt, mit dessen Entstehung typischerweise gerechnet 
                werden muss.
              </p>
              <p>
                (3) Im Übrigen ist eine Haftung des Verkäufers ausgeschlossen.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 8 Streitbeilegung</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Die EU-Kommission stellt im Internet unter folgendem Link eine Plattform zur 
                Online-Streitbeilegung bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#EB1A2B] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                (2) Der Verkäufer ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 9 Schlussbestimmungen</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des 
                UN-Kaufrechts.
              </p>
              <p>
                (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder 
                öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für 
                alle Streitigkeiten aus Vertragsverhältnissen zwischen dem Kunden und dem Verkäufer 
                der Sitz des Verkäufers.
              </p>
              <p>
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die 
                Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
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
