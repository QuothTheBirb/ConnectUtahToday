import qs from 'qs';

export function parseURLQuery<T>(url: string): T {
  const queryString = url.split('?')[1] || '';

  return qs.parse(queryString, {
    depth: 5,
    parameterLimit: 100,
    arrayLimit: 100
  }) as T;
}
