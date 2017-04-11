export class Utils {
  /**
   * Makes a string's first letter uppercase.
   *
   * @return {string} Original string, but with first letter in upper case.
   */
  static upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  /**
   * Returns whether the page is in LTR mode. Defaults to `true` if it can't be computed.
   *
   * @return {boolean} Page's language direction is left-to-right.
   */
  static isLTR(doc: HTMLDocument): boolean {
    let dir: string = 'ltr';

    // If `window` doesn't exist, this isn't in the context of a browser...
    if (window) {
      if (window.getComputedStyle) {
        dir = window.getComputedStyle(doc.body, null).getPropertyValue('direction');
      } else {
        dir = (doc.body as any).currentStyle.direction;
      }
    }

    return dir === 'ltr';
  }

  /**
   * Returns whether or not the current device is an iOS device.
   *
   * @return {boolean} Device is an iOS device (i.e. iPod touch/iPhone/iPad).
   */
  static isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }
}
