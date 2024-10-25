interface Product {
  sku: string;
  name: string;
  price: number;
}

interface PricingRule {
  apply: (items: Product[]) => number;
}

const products: Product[] = [
  { sku: 'ipd', name: 'Super iPad', price: 549.99 },
  { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
  { sku: 'atv', name: 'Apple TV', price: 109.50 },
  { sku: 'vga', name: 'VGA adapter', price: 30.00 }
];

const pricingRules: PricingRule[] = [
  {
    apply: (items: Product[]) => {
      let atvCount = items.filter(item => item.sku === 'atv').length;
      const discount = Math.floor(atvCount / 3) * products.find(p => p.sku === 'atv')!.price;
      return discount;
    }
  },
  {
    apply: (items: Product[]) => {
      let ipdCount = items.filter(item => item.sku === 'ipd').length;
      if (ipdCount > 4) {
        const discount = ipdCount * (products.find(p => p.sku === 'ipd')!.price - 499.99);
        return discount;
      }
      return 0;
    }
  }
];

class Checkout {
  private items: Product[] = [];

  constructor(private pricingRules: PricingRule[]) {}

  scan(sku: string): void {
    const product = products.find(p => p.sku === sku);
    if (product) {
      this.items.push(product);
    } else {
      throw new Error(`Product with SKU ${sku} not found.`);
    }
  }

  total(): string {
    let total = this.items.reduce((acc, item) => acc + item.price, 0.00);
    
    const totalDiscount = this.pricingRules.reduce((acc, rule) => acc + rule.apply(this.items), 0.00);

    return (total - totalDiscount).toFixed(2);
  }
}


const order1 = new Checkout(pricingRules);
order1.scan('atv');
order1.scan('atv');
order1.scan('atv');
order1.scan('vga');
console.log('Total order1 expected:', order1.total());

const order2 = new Checkout(pricingRules);
order2.scan('atv');
order2.scan('ipd');
order2.scan('ipd');
order2.scan('atv');
order2.scan('ipd');
order2.scan('ipd');
order2.scan('ipd');
console.log('Total order2 expected:', order2.total());
