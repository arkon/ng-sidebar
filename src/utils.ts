/**
 * Returns whether the page is in LTR mode. Defaults to `true` if it can't be computed.
 *
 * @return {boolean} Page's language direction is left-to-right.
 */
export function isLTR(): boolean {
  let dir: string = 'ltr';

  if (typeof window !== 'undefined') {
    if (window.getComputedStyle) {
      dir = window.getComputedStyle(document.body, null).getPropertyValue('direction');
    } else {
      dir = (document.body as any).currentStyle.direction;
    }
  }

  return dir === 'ltr';
}

/**
 * Returns whether or not the current device is an iOS device.
 *
 * @return {boolean} Device is an iOS device (i.e. iPod touch/iPhone/iPad).
 */
export function isIOS(): boolean {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  return false;
}

/**
 * Detects whether or not we are running in a browser context or not.
 * From https://stackoverflow.com/a/31090240
 *
 * @return {boolean} Whether this is a browser or a server.
 */
export function isBrowser(): boolean {
  return new Function('try{return this===window;}catch(e){return false;}')();
}
