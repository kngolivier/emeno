// FILE: src/utils/pricing/computeDiscount.js

export const computeDiscount = (price, promo) => {
  if (!promo) return { price, oldPrice: null, percent: 0 };

  if (promo.discountType === "PERCENT") {
    const discount = price * promo.discountValue / 100;

    return {
      price: price - discount,
      oldPrice: price,
      percent: promo.discountValue
    };
  }

  if (promo.discountType === "FIXED") {
    return {
      price: price - promo.discountValue,
      oldPrice: price,
      percent: Math.round((promo.discountValue / price) * 100)
    };
  }

  return { price, oldPrice: null, percent: 0 };
};