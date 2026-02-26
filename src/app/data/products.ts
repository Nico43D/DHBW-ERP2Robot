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
    ]
  }
];
