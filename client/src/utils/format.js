export const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const discountPercent = (product) => {
  if (!product?.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
};

export const classNames = (...values) => values.filter(Boolean).join(' ');
