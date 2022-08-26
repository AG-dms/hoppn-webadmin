type PhotoSize = 'xlg' | 'lg' | 'md' | 'sm' | 'xsm' | null;

function extname(path: string) {
  const tmp = path.replace(/^[\.]+/, '');
  if (/\./.test(tmp)) {
    return tmp.match(/\.[^.]*$/)![0];
  }
  return '';
}

export const getResizedPhotoUrl = ({
  source,
  size,
  isWebp = false,
}: {
  source?: string | null;
  size?: PhotoSize;
  isWebp?: boolean;
}): string | null => {
  if (source === null || source === undefined) {
    return null;
  }

  const extName = extname(source);
  const path = isWebp ? source.replace(extName, '.webp') : source;

  const URL = process.env.API_URL || '';

  return size ? `${URL}/${size}-${path}` : `${URL}/${path}`;
};
