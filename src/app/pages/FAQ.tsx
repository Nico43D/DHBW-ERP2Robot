import React, { useState } from 'react';
import { Card } from '../components/Card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

function FAQAccordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#EB1A2B] flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const faqData: FAQCategory[] = [
    {
      category: 'Bestellung & Zahlung',
      items: [
        {
          question: 'Wie kann ich eine Bestellung aufgeben?',
          answer: 'Wählen Sie die gewünschten Produkte aus und legen Sie diese in den Warenkorb. Klicken Sie anschließend auf "Zur Kasse" und folgen Sie den Anweisungen. Sie müssen ein Kundenkonto erstellen oder sich einloggen, um eine Bestellung abzuschließen.',
        },
        {
          question: 'Welche Zahlungsmethoden werden akzeptiert?',
          answer: 'Wir akzeptieren folgende Zahlungsmethoden:\n\n• Rechnung (Kauf auf Rechnung)\n• PayPal\n• Kreditkarte (Visa, Mastercard)\n\nAlle Zahlungen werden sicher und verschlüsselt verarbeitet.',
        },
        {
          question: 'Kann ich meine Bestellung nachträglich ändern oder stornieren?',
          answer: 'Kontaktieren Sie uns bitte umgehend per E-Mail an info@duale-suessigkeiten.de oder telefonisch. Wenn Ihre Bestellung noch nicht versendet wurde, können wir Änderungen vornehmen oder die Bestellung stornieren. Nach dem Versand ist dies leider nicht mehr möglich.',
        },
        {
          question: 'Erhalte ich eine Rechnung?',
          answer: 'Ja, eine Rechnung wird Ihrer Lieferung beigelegt. Zusätzlich erhalten Sie eine digitale Rechnung per E-Mail nach Versand Ihrer Bestellung.',
        },
      ],
    },
    {
      category: 'Versand & Lieferung',
      items: [
        {
          question: 'Wie lange dauert die Lieferung?',
          answer: 'Die Standardlieferzeit beträgt 2-3 Werktage nach Versand innerhalb Deutschlands. Bestellungen vor 14:00 Uhr werden in der Regel noch am selben Werktag versendet.',
        },
        {
          question: 'Was kostet der Versand?',
          answer: 'Der Standardversand kostet €4,99. Ab einem Bestellwert von €50,00 liefern wir versandkostenfrei innerhalb Deutschlands.',
        },
        {
          question: 'Kann ich mein Paket verfolgen?',
          answer: 'Ja, sobald Ihre Bestellung versendet wurde, erhalten Sie eine E-Mail mit einer Tracking-Nummer. Mit dieser können Sie den Status Ihrer Lieferung jederzeit bei DHL verfolgen.',
        },
        {
          question: 'Was passiert, wenn ich nicht zu Hause bin?',
          answer: 'DHL hinterlässt eine Benachrichtigungskarte, wenn Sie nicht angetroffen werden. Sie können Ihr Paket dann in der nächsten DHL-Filiale oder Packstation abholen. Alternativ können Sie mit DHL einen neuen Zustelltermin vereinbaren.',
        },
        {
          question: 'Liefern Sie auch ins Ausland?',
          answer: 'Derzeit liefern wir ausschließlich innerhalb Deutschlands. Wir arbeiten daran, unseren Versandservice zukünftig zu erweitern.',
        },
      ],
    },
    {
      category: 'Rückgabe & Umtausch',
      items: [
        {
          question: 'Wie kann ich einen Artikel zurücksenden?',
          answer: 'Sie haben ein 14-tägiges Widerrufsrecht. Kontaktieren Sie uns per E-Mail an retoure@duale-suessigkeiten.de mit Ihrer Bestellnummer. Senden Sie die Ware ungeöffnet und in der Originalverpackung zurück. Detaillierte Informationen finden Sie auf unserer Seite "Rückgabe & Umtausch".',
        },
        {
          question: 'Wer trägt die Kosten für die Rücksendung?',
          answer: 'Die Kosten der Rücksendung trägt grundsätzlich der Kunde, es sei denn, die Ware ist fehlerhaft oder es wurde ein falscher Artikel geliefert. In diesen Fällen übernehmen wir die Rücksendekosten.',
        },
        {
          question: 'Wann erhalte ich mein Geld zurück?',
          answer: 'Nach Eingang und Prüfung Ihrer Rücksendung erstatten wir den Kaufpreis innerhalb von 14 Tagen auf das ursprüngliche Zahlungsmittel.',
        },
        {
          question: 'Kann ich Artikel umtauschen?',
          answer: 'Ja, für einen Umtausch senden Sie bitte den ursprünglichen Artikel zurück und bestellen den gewünschten Artikel neu. So erhalten Sie Ihren Wunschartikel schnellstmöglich.',
        },
      ],
    },
    {
      category: 'Produkte & Qualität',
      items: [
        {
          question: 'Sind die Produkte originalverpackt?',
          answer: 'Ja, alle unsere Produkte sind originalverpackt und versiegelt. Wir beziehen unsere Waren direkt von autorisierten Händlern und Herstellern.',
        },
        {
          question: 'Wie werden die Produkte gelagert?',
          answer: 'Unsere Produkte werden unter optimalen Bedingungen gelagert – kühl, trocken und lichtgeschützt. So garantieren wir beste Qualität und Frische.',
        },
        {
          question: 'Was passiert bei hohen Temperaturen im Sommer?',
          answer: 'Bei sehr hohen Außentemperaturen (über 25°C) kann es vorkommen, dass Schokoladenprodukte weich werden. Dies beeinträchtigt nicht die Qualität. Lagern Sie die Produkte nach Erhalt kühl, damit sie wieder fest werden.',
        },
        {
          question: 'Wie lange sind die Produkte haltbar?',
          answer: 'Alle Produkte haben eine ausreichend lange Mindesthaltbarkeit. In der Regel beträgt diese mindestens 3-6 Monate ab Lieferdatum. Das genaue Mindesthaltbarkeitsdatum finden Sie auf der Produktverpackung.',
        },
      ],
    },
    {
      category: 'Kundenkonto',
      items: [
        {
          question: 'Muss ich ein Kundenkonto erstellen?',
          answer: 'Ja, für Bestellungen in unserem Shop ist die Erstellung eines Kundenkontos erforderlich. Dies ermöglicht es Ihnen, Ihre Bestellungen zu verwalten, Ihre Lieferadressen zu speichern und Ihren Bestellverlauf einzusehen.',
        },
        {
          question: 'Ist die Registrierung kostenlos?',
          answer: 'Ja, die Registrierung und Nutzung eines Kundenkontos ist völlig kostenlos und unverbindlich.',
        },
        {
          question: 'Wie ändere ich meine Adresse?',
          answer: 'Loggen Sie sich in Ihr Kundenkonto ein und navigieren Sie zu "Adressen verwalten". Dort können Sie Ihre Rechnungs- und Lieferadressen bearbeiten.',
        },
        {
          question: 'Ich habe mein Passwort vergessen. Was kann ich tun?',
          answer: 'Klicken Sie auf der Login-Seite auf "Passwort vergessen" und geben Sie Ihre E-Mail-Adresse ein. Sie erhalten dann einen Link zum Zurücksetzen Ihres Passworts per E-Mail.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EB1A2B] rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Häufig gestellte Fragen (FAQ)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Shop und unseren Services.
          </p>
        </div>

        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#EB1A2B] rounded"></div>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <FAQAccordion key={itemIndex} question={item.question} answer={item.answer} />
                ))}
              </div>
            </Card>
          </div>
        ))}

        {/* Contact Info */}
        <Card className="p-6 md:p-8 bg-blue-50 border-2 border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ihre Frage wurde nicht beantwortet?
          </h2>
          <p className="text-gray-700 mb-4">
            Kein Problem! Unser Kundenservice hilft Ihnen gerne weiter.
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>E-Mail:</strong>{' '}
              <a href="mailto:info@duale-suessigkeiten.de" className="text-[#EB1A2B] hover:underline">
                info@duale-suessigkeiten.de
              </a>
            </p>
            <p>
              <strong>Telefon:</strong>{' '}
              <a href="tel:+4930123456789" className="text-[#EB1A2B] hover:underline">
                +49 30 12345678-9
              </a>
            </p>
            <p className="text-sm text-gray-600">Mo-Fr: 9:00 - 17:00 Uhr</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
