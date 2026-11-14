const ACCEPTED = ['image/jpeg', 'image/png'];

export class ImageFileError extends Error {}

const readDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImageFileError('Datoteku nije moguće pročitati.'));
    reader.readAsDataURL(file);
  });

const imageSize = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new ImageFileError('Datoteka nije ispravna slika.'));
    image.src = url;
  });

export async function readImage(file: File, minWidth: number, minHeight: number) {
  if (!ACCEPTED.includes(file.type)) throw new ImageFileError('Slika mora biti JPG ili PNG.');
  const url = await readDataUrl(file);
  const { width, height } = await imageSize(url);
  if (width < minWidth || height < minHeight)
    throw new ImageFileError(`Slika mora biti najmanje ${minWidth} × ${minHeight} px.`);
  return url;
}

export const IMAGE_ACCEPT = ACCEPTED.join(',');
