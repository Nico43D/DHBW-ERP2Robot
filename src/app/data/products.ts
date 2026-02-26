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
    image: 'https://images.unsplash.com/photo-1701261919026-d6ce6cb9be0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB3YWZlciUyMGhhemVsbnV0JTIwc25hY2t8ZW58MXx8fHwxNzcyMDMzNTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1694796446470-71f9874f73ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3VnYXQlMjBjaG9jb2xhdGUlMjBwcmFsaW5lcyUyMHN3ZWV0c3xlbnwxfHx8fDE3NzIwMzM0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1768986965066-9665b329e9e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJyZXJvJTIwY2hvY29sYXRlJTIwa2lzc2VzJTIwY2FuZHl8ZW58MXx8fHwxNzcyMDMzNDk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    details: [
      'Ganze Haselnuss im Kern',
      'Cremige Nougatfüllung',
      'Knusprige Waffel-Hülle',
      'Edle Schokoladen-Glasur',
      'Das Original seit Jahren'
    ]
  }
];
