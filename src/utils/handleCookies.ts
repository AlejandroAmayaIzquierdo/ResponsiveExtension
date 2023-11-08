export function setCookie(
  cname: string,
  cvalue: string,
  exdays: number,
  samesite: boolean = false,
) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie =
    cname +
    '=' +
    cvalue +
    ';' +
    expires +
    ';path=/' +
    (samesite ? ';SameSite=Strict;' : 'SameSite=none; Secure;');
}

export function getCookie(cname: string) {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  console.log(decodedCookie);
  const ca = decodedCookie.split(';');
  for (const element of ca) {
    let c = element;
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function checkCookie(cname: string) {
  const cookie = getCookie(cname);
  let found = false;
  if (cookie !== '') {
    found = true;
  }
  return found;
}

export function deleteCookie(cname: string) {
  document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
