import React from 'react';
import { Card } from '../components/Card';
import { Package, Truck, Clock, Euro } from 'lucide-react';

export default function VersandLieferung() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Versand & Lieferung
        </h1>

        {/* Shipping Costs */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <Euro className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Versandkosten</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Standardversand (DHL)</span>
                <span className="text-xl font-bold text-[#EB1A2B]">€4,99</span>
              </div>
              <p className="text-sm text-gray-600">Lieferzeit: 2-3 Werktage</p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Versandkostenfrei</span>
                <span className="text-xl font-bold text-green-700">€0,00</span>
              </div>
              <p className="text-sm text-gray-700">Ab einem Bestellwert von €50,00</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Hinweis:</strong> Die Versandkosten werden automatisch beim Checkout berechnet 
              und sind im Gesamtpreis enthalten, bevor Sie Ihre Bestellung abschließen.
            </p>
          </div>
        </Card>

        {/* Delivery Times */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lieferzeiten</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Deutschland</h3>
              <p className="text-gray-700 mb-2">
                Standardlieferung: <strong>2-3 Werktage</strong> nach Versand
              </p>
              <p className="text-sm text-gray-600">
                Bestellungen, die vor 14:00 Uhr eingehen, werden in der Regel noch am selben 
                Werktag versendet.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Feiertage und Wochenenden</h3>
              <p className="text-gray-700">
                Bitte beachten Sie, dass an Samstagen, Sonntagen und gesetzlichen Feiertagen 
                keine Lieferung erfolgt. Diese Tage werden nicht als Werktage gezählt.
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Process */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Versandablauf</h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Bestellbestätigung</h3>
                <p className="text-gray-700">
                  Nach Abschluss Ihrer Bestellung erhalten Sie eine Bestellbestätigung per E-Mail 
                  mit allen Details zu Ihrer Bestellung.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Bearbeitung</h3>
                <p className="text-gray-700">
                  Ihre Bestellung wird sorgfältig verpackt und für den Versand vorbereitet. 
                  Dies erfolgt in der Regel innerhalb von 24 Stunden an Werktagen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Versandbenachrichtigung</h3>
                <p className="text-gray-700">
                  Sobald Ihr Paket versandt wurde, erhalten Sie eine Versandbestätigung mit 
                  einer Tracking-Nummer per E-Mail. Mit dieser können Sie den Status Ihrer 
                  Lieferung jederzeit verfolgen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#EB1A2B] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Zustellung</h3>
                <p className="text-gray-700">
                  Ihr Paket wird von DHL zugestellt. Bei Abwesenheit wird eine 
                  Benachrichtigungskarte hinterlassen, und Sie können Ihr Paket in der nächsten 
                  Filiale oder Packstation abholen.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Packaging Info */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB1A2B] rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verpackung</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              Wir legen großen Wert auf die sichere Verpackung Ihrer Bestellung. Alle Produkte 
              werden sorgfältig und stoßfest verpackt, um sicherzustellen, dass Ihre Süßigkeiten 
              in einwandfreiem Zustand bei Ihnen ankommen.
            </p>
            <p>
              Unsere Verpackungsmaterialien sind umweltfreundlich und recycelbar. Wir verwenden 
              keine unnötigen Plastikverpackungen und setzen auf nachhaltige Alternativen, wo 
              immer möglich.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Wichtig bei warmen Temperaturen:</strong> Bei hohen Außentemperaturen 
                (über 25°C) kann es vorkommen, dass Schokoladenprodukte weich werden. Dies 
                beeinträchtigt nicht die Qualität. Lagern Sie die Produkte nach Erhalt kühl, 
                damit sie wieder fest werden.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
