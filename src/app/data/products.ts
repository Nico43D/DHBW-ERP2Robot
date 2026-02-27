import knoppersImage from '../../assets/68f4ec064ed64bc480406df6e3ad02a9ebbd4d0f.png';
import nougatImage from '../../assets/31aacc9ed16cf6be5e1b4c113dbf2e7fb9c99a51.png';
import ferreroImage from '../../assets/2e6b40bc4a8297c5674fc256b1158b0f12bdd5fb.png';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  details: string[];
  fullDescription: string;
  ingredients: string[];
  allergens: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Knoppers',
    description: 'Knusprige Waffel mit Haselnuss und Milchcreme',
    price: 2.99,
    image: knoppersImage,
    details: [
      'Knusprige Waffel-Schichten',
      'Cremige Haselnussfüllung',
      'Mit frischer Milch',
      'Einzeln verpackt für unterwegs',
      'Perfekt zum Kaffee'
    ],
    fullDescription: 'Knoppers ist die knusprige Pause für zwischendurch! Die beliebte Waffelschnitte kombiniert fünf köstliche Schichten: zwei knusprige Waffelschichten umhüllen eine cremige Haselnussfüllung und eine Milchcreme, gekrönt von einer feinen Schicht Kakaocreme. Perfekt für den kleinen Hunger am Vormittag oder einfach als leckerer Snack für unterwegs.',
    ingredients: [
      'Zucker',
      'Pflanzliche Fette (Palm, Shea)',
      'Weizenmehl',
      'Haselnüsse (10%)',
      'Süßmolkenpulver',
      'Magermilchpulver',
      'Kakaopulver',
      'Emulgator Sojalecithin',
      'Kakaomasse',
      'Feuchthaltemittel (Sorbit)',
      'Glukosesirup',
      'Speisesalz',
      'Backtriebmittel (Natriumhydrogencarbonat)',
      'Vollmilchpulver',
      'Aroma',
      'Kakaobutter'
    ],
    allergens: [
      'Enthält Gluten, Milch, Haselnüsse und Soja',
      'Kann Spuren von anderen Schalenfrüchten und Erdnüssen enthalten'
    ]
  },
  {
    id: '2',
    name: 'Nougat Happen',
    description: 'Zartschmelzende Nougat-Pralinen mit feiner Schokolade',
    price: 4.49,
    image: nougatImage,
    details: [
      'Zartschmelzender Nougat-Kern',
      'Umhüllt von edler Vollmilchschokolade',
      'Ideal für Genussmomente',
      'Perfekt zum Verschenken',
      'Premium Qualität'
    ],
    fullDescription: 'Nougat Happen sind kleine Kostbarkeiten für echte Genießer. Jede Praline besteht aus einem zartschmelzenden Nougat-Kern, der von feiner Vollmilchschokolade umhüllt ist. Die perfekte Balance zwischen süß und nussig macht diese Pralinen zu einem unwiderstehlichen Genuss. Ob als kleine Belohnung für zwischendurch oder als besonderes Geschenk – Nougat Happen begeistern jeden Schokoladenliebhaber.',
    ingredients: [
      'Zucker',
      'Pflanzliche Fette (Palm, Shea, Sal)',
      'Kakaobutter',
      'Haselnüsse (8%)',
      'Kakaomasse',
      'Süßmolkenpulver',
      'Vollmilchpulver',
      'Emulgator Sojalecithin',
      'Glukosesirup',
      'Feuchthaltemittel (Glycerin)',
      'Aroma',
      'Speisesalz'
    ],
    allergens: [
      'Enthält Milch, Haselnüsse und Soja',
      'Kann Spuren von Gluten, Erdnüssen und anderen Schalenfrüchten enthalten'
    ]
  },
  {
    id: '3',
    name: 'Ferrero Küsschen',
    description: 'Verführerische Pralinen mit Haselnuss und Schokolade',
    price: 5.99,
    image: ferreroImage,
    details: [
      'Ganze Haselnuss im Kern',
      'Cremige Nougatfüllung',
      'Knusprige Waffel-Hülle',
      'Edle Schokoladen-Glasur',
      'Das Original seit Jahren'
    ],
    fullDescription: 'Ferrero Küsschen sind die Verkörperung purer Genussmomente. Im Herzen jeder goldenen Praline verbirgt sich eine ganze Haselnuss, umhüllt von einer zartschmelzenden Nougatcreme und einer hauchzarten, knusprigen Waffel. Die feine Milchschokolade und die knusprigen Haselnussstückchen bilden die perfekte Vollendung. Ein zeitloser Klassiker, der zu jedem Anlass passt und immer für Freude sorgt.',
    ingredients: [
      'Milchschokolade 30% (Zucker, Kakaobutter, Kakaomasse, Magermilchpulver, Butterreinfett, Emulgator Sojalecithin, Vanillin)',
      'Haselnüsse (28,5%)',
      'Zucker',
      'Palmöl',
      'Weizenmehl',
      'Molkenpulver',
      'Fettarmer Kakao',
      'Emulgator Sojalecithin',
      'Backpulver (Natriumhydrogencarbonat, Ammoniumhydrogencarbonat)',
      'Speisesalz',
      'Aroma'
    ],
    allergens: [
      'Enthält Gluten, Milch, Haselnüsse und Soja',
      'Kann Spuren von anderen Schalenfrüchten und Erdnüssen enthalten'
    ]
  }
];