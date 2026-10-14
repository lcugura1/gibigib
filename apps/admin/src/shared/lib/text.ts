export const toAscii = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

export const slugify = (text: string) =>
  toAscii(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
