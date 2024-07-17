/**
 * The encoding character set
 */
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';


/**
 * Encode the string as UTF-8
 * @param v 
 * @returns
 */
function utf8Encode(v: string): string
{
  let _v = v.replace(/\r\n/g, '\n');
  let ret = '';

  for (let n = 0; n < _v.length; ++n)
  {
    const c = _v.charCodeAt(n);
    if (c < 128)
    {
      ret += String.fromCharCode(c);
    }
    else if ((c > 127) && (c < 2048))
    {
      ret += String.fromCharCode((c >> 6) | 192);
      ret += String.fromCharCode((c & 63) | 128);
    }
    else
    {
      ret += String.fromCharCode((c >> 12) | 224);
      ret += String.fromCharCode(((c >> 6) & 63) | 128);
      ret += String.fromCharCode((c & 63) | 128);
    }
  }

  return ret;
}


/**
 * Decode the string as UTF-8
 * @param v 
 * @returns
 */
function utf8Decode(v: string): string
{
  let ret = '';
  let i = 0;

  while (i < v.length) {
    const c1 = v.charCodeAt(i);
    if (c1 < 128)
    {
      ret += String.fromCharCode(c1);
      i += 1;
    }
    else if ((c1 > 191) && (c1 < 224))
    {
      const c2 = v.charCodeAt(i + 1);
      ret += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    }
    else
    {
      const c2 = v.charCodeAt(i + 1);
      const c3 = v.charCodeAt(i + 2);
      ret += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }

  return ret;
}


export interface UrlBase64EncodeOptions {
  /**
   * If padding is to be applied (default true)
   */
  isPad?: boolean;
}


/**
 * Encode/decode in URL-safe base64 format
 * Based on: http://www.webtoolkit.info/
 */
class XwUrlBase64 {
  /**
   * Encode content and represent in URL-safe base64 string
   * @param v Target
   * @param options Options
   * @returns Encoded string
   */
  encode(v: object|string, options?: UrlBase64EncodeOptions): string {
    // Flatten target into string
    let _v = v;
    if (typeof _v === 'object') {
      _v = JSON.stringify(_v);
    }

    // Always encoded in UTF-8
    _v = utf8Encode(_v);

    // Encoding loop
    let ret = '';
    let i = 0;

    while (i < _v.length) {
      const chr1 = _v.charCodeAt(i++);
      const chr2 = _v.charCodeAt(i++);
      const chr3 = _v.charCodeAt(i++);

      let enc1 = chr1 >> 2;
      let enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      let enc4 = chr3 & 63;

      if (isNaN(chr2))
      {
        enc3 = 64;
        enc4 = 64;
      }
      else if (isNaN(chr3))
      {
        enc4 = 64;
      }

      ret += CHARSET.charAt(enc1) + CHARSET.charAt(enc2) + CHARSET.charAt(enc3) + CHARSET.charAt(enc4);
    }

    // Check if padding shall be removed
    if (!(options?.isPad ?? true)) {
      while (ret.length > 0) {
        if (ret[ret.length - 1] !== '=') break;
        ret = ret.substring(0, ret.length - 1);
      }
    }

    return ret;
  }


  /**
   * Decode representation of URL-safe base64 string into content string
   * @param v 
   */
  decode(v: string): string {
    // Fill up padding automatically
    while ((v.length % 4) !== 0) v += '=';

    // Drop other strings
    v = v.replace(/[^A-Za-z0-9\-_=]/g, '');

    // Loop through
    let ret = '';
    let i = 0;
    while (i < v.length) {
      const enc1 = CHARSET.indexOf(v.charAt(i++));
      const enc2 = CHARSET.indexOf(v.charAt(i++));
      const enc3 = CHARSET.indexOf(v.charAt(i++));
      const enc4 = CHARSET.indexOf(v.charAt(i++));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      ret += String.fromCharCode(chr1);
      if (enc3 !== 64) ret += String.fromCharCode(chr2);
      if (enc4 !== 64) ret += String.fromCharCode(chr3);
    }
    
    // Finally decode as UTF-8
    return utf8Decode(ret);
  }
}

const xwUrlBase64 = new XwUrlBase64();
export default xwUrlBase64;