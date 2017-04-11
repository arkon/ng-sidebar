/**
 * Makes a string's first letter uppercase.
 *
 * @return {string} Original string, but with first letter in upper case.
 */
export function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * Returns whether the page is in LTR mode. Defaults to `true` if it can't be computed.
 *
 * @return {boolean} Page's language direction is left-to-right.
 */
export function isLTR(doc: HTMLDocument): boolean {
  let dir: string = 'ltr';

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
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * A decorator that prevents a method from running if it's not in browser context.
 */
export function isBrowser(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      if (typeof window === 'undefined') {
        return;
      }

      // Run original method
      // tslint:disable-next-line:no-invalid-this
      return originalMethod.apply(this, args);
    };

    return descriptor;
}
