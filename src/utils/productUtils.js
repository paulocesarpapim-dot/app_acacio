export function isKgProduct(product) {
  return true;
}

export function formatQty(product, qty) {
  if (isKgProduct(product)) {
    const grams = Math.round(qty * 1000);
    return grams >= 1000 ? `${(grams / 1000).toFixed(1).replace('.0', '')} kg` : `${grams}g`;
  }
  return `${qty}`;
}

export function qtyStep(product) {
  return isKgProduct(product) ? 0.1 : 1;
}

export function minQty(product) {
  return isKgProduct(product) ? 0.1 : 1;
}

export function calcPrice(product, qty) {
  return product.price * qty;
}
