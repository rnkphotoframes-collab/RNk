import { Product, ProductSize, ReturnGiftCombo } from '../types/index.js';

export const BUSINESS_PHONE = '+918681917433';
export const BUSINESS_PHONE_DISPLAY = '+91 8681917433';
export const BUSINESS_WHATSAPP_NUM = '918681917433';

export function getProductWhatsAppUrl(
  product: Product,
  selectedSize?: ProductSize | null,
  lang: 'en' | 'ta' = 'en'
): string {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : '';
  const price = selectedSize
    ? selectedSize.offer_price || selectedSize.original_price
    : product.offer_price || product.original_price;

  let message = '';
  if (lang === 'ta') {
    message = `வணக்கம் RNK போட்டோ ஃப்ரேம்ஸ், நான் இந்த ஃப்ரேமைப் பற்றி அறிய விரும்புகிறேன்:\n\n` +
      `*பொருள்:* ${product.name_ta || product.name_en}\n` +
      (selectedSize ? `*அளவு:* ${selectedSize.size_label_ta || selectedSize.size_label_en}\n` : '') +
      (price ? `*விலை:* ₹${price}\n` : '') +
      (currentUrl ? `*இணைப்பு:* ${currentUrl}\n\n` : '\n') +
      `இதன் தயாரிப்பு காலம் மற்றும் ஆர்டர் விவரங்களை தெரிவிக்க முடியுமா?`;
  } else {
    message = `Hello RNK Photo Frames, I am interested in inquiring about this frame:\n\n` +
      `*Product:* ${product.name_en}\n` +
      (selectedSize ? `*Size:* ${selectedSize.size_label_en}\n` : '') +
      (price ? `*Price:* ₹${price}\n` : '') +
      (currentUrl ? `*Link:* ${currentUrl}\n\n` : '\n') +
      `Could you please share details regarding order placement and delivery to my location?`;
  }

  return `https://wa.me/${BUSINESS_WHATSAPP_NUM}?text=${encodeURIComponent(message)}`;
}

export function getComboWhatsAppUrl(combo: ReturnGiftCombo, lang: 'en' | 'ta' = 'en'): string {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/combos/${combo.slug}` : '';
  const price = combo.offer_price || combo.original_price;

  let message = '';
  if (lang === 'ta') {
    message = `வணக்கம் RNK போட்டோ ஃப்ரேம்ஸ், விசேஷத்திற்கான ரிட்டர்ன் கிஃப்ட் காம்போ பற்றி அறிய விரும்புகிறேன்:\n\n` +
      `*காம்போ:* ${combo.name_ta || combo.name_en}\n` +
      `*விலை:* ₹${price} (ஒரு தொகுப்பு)\n` +
      (currentUrl ? `*இணைப்பு:* ${currentUrl}\n\n` : '\n') +
      `எங்களுக்கு மொத்தமாக தேவைப்படுகிறது. குறைந்தபட்ச அளவு மற்றும் டெலிவரி நாட்களை கூறவும்.`;
  } else {
    message = `Hello RNK Photo Frames, I am inquiring about this Return Gift Combo for a celebration/event:\n\n` +
      `*Combo:* ${combo.name_en}\n` +
      `*Price:* ₹${price} (per set)\n` +
      (currentUrl ? `*Link:* ${currentUrl}\n\n` : '\n') +
      `We have a bulk requirement. Could you please let us know the delivery time and best pricing?`;
  }

  return `https://wa.me/${BUSINESS_WHATSAPP_NUM}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppUrl(subject?: string, lang: 'en' | 'ta' = 'en'): string {
  let message = '';
  if (lang === 'ta') {
    message = `வணக்கம் RNK போட்டோ ஃப்ரேம்ஸ், நான் புதிய போட்டோ ஃப்ரேம் அல்லது பரிசுப் பொருட்கள் தொடர்பாக பேச விரும்புகிறேன்.`;
  } else {
    message = `Hello RNK Photo Frames, I would like to inquire about customized photo frames and gift solutions in PodaturPet / Tiruttani.`;
  }
  if (subject) {
    message += ` (${subject})`;
  }

  return `https://wa.me/${BUSINESS_WHATSAPP_NUM}?text=${encodeURIComponent(message)}`;
}

export function getCallDirectUrl(): string {
  return `tel:${BUSINESS_PHONE}`;
}
