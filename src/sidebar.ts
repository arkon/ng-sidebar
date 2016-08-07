import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
  ViewEncapsulation,
  QueryList
} from '@angular/core';

import CloseSidebar from './close';

export const SIDEBAR_POSITION = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
};

@Component({
  selector: 'ng2-sidebar',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ng2-sidebar {
      overflow: auto;
      pointer-events: none;
      position: fixed;
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      will-change: transform;
      z-index: 99999999;
    }

      .ng2-sidebar--left {
        bottom: 0;
        left: 0;
        top: 0;
        transform: translateX(-110%);
      }

      .ng2-sidebar--right {
        bottom: 0;
        right: 0;
        top: 0;
        transform: translateX(110%);
      }

      .ng2-sidebar--top {
        left: 0;
        right: 0;
        top: 0;
        transform: translateY(-110%);
      }

      .ng2-sidebar--bottom {
        bottom: 0;
        left: 0;
        right: 0;
        transform: translateY(110%);
      }

      .ng2-sidebar--style {
        background: #fff;
        box-shadow: 0 0 2.5em rgba(84, 85, 85, 0.5);
      }

      .ng2-sidebar--open .ng2-sidebar {
        pointer-events: auto;
        transform: none;
        will-change: initial;
      }

    .ng2-sidebar__overlay {
      height: 100%;
      left: 0;
      pointer-events: none;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99999998;
    }

      .ng2-sidebar--open .ng2-sidebar__overlay {
        pointer-events: auto;
      }

      .ng2-sidebar--open .ng2-sidebar__overlay--style {
        background: #000;
        opacity: 0.75;
      }
  `],
  template: `
    <aside #sidebar
      role="complementary"
      [attr.aria-hidden]="!open"
      [attr.aria-label]="ariaLabel"
      class="ng2-sidebar ng2-sidebar--{{position}}"
      [class.ng2-sidebar--style]="defaultStyles"
      [ngClass]="sidebarClass">
      <ng-content></ng-content>
    </aside>

    <div *ngIf="showOverlay"
      aria-hidden="true"
      class="ng2-sidebar__overlay"
      [class.ng2-sidebar__overlay--style]="defaultStyles"
      [ngClass]="overlayClass"></div>
  `,
  host: {
    '[class.ng2-sidebar--open]': 'open'
  }
})
export default class Sidebar implements OnInit, OnChanges, OnDestroy, AfterContentInit {
  // `openChange` allows for 2-way data binding
  @Input() open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() position: string = SIDEBAR_POSITION.Left;
  @Input() closeOnClickOutside: boolean = false;
  @Input() showOverlay: boolean = false;

  @Input() defaultStyles: boolean = false;

  @Input() sidebarClass: string;
  @Input() overlayClass: string;

  @Input() ariaLabel: string;

  @Output() onOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('sidebar')
  private _elSidebar: ElementRef;

  @ContentChildren(CloseSidebar, { descendants: true })
  private _closeDirectives: QueryList<CloseSidebar>;

  private _onClickOutsideAttached: boolean = false;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  constructor() {
    this._trapFocus = this._trapFocus.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
  }

  ngOnInit() {
    this._initCloseOnClickOutside();
  }

  ngOnDestroy() {
    this._destroyCloseOnClickOutside();

    this._closeDirectives.forEach((dir: CloseSidebar) => {
      dir.clicked.unsubscribe();
    });
  }

  ngAfterContentInit() {
    this._closeDirectives.forEach((dir: CloseSidebar) => {
      dir.clicked.subscribe(() => this._manualClose());
    });
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['open']) {
      if (this.open) {
        this._open();
      } else {
        this._close();
      }
    }

    if (changes['closeOnClickOutside']) {
      this._initCloseOnClickOutside();
    }
  }

  private _open() {
    this._focusedBeforeOpen = document.activeElement as HTMLElement;
    this._getFocusableElements();
    this._setFocusToFirstItem();
    document.body.addEventListener('focus', this._trapFocus, true);

    this._initCloseOnClickOutside();

    this.onOpen.emit(null);
  }

  private _close() {
    this._focusedBeforeOpen && this._focusedBeforeOpen.focus();
    document.body.removeEventListener('focus', this._trapFocus, true);

    this._destroyCloseOnClickOutside();

    this.onClose.emit(null);
  }

  private _manualClose() {
    this.open = false;
    this.openChange.emit(false);

    this._close();
  }


  // Focus on open/close
  // ==============================================================================================

  private _getFocusableElements() {
    this._focusableElements = Array.from(this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;
  }

  private _setFocusToFirstItem() {
    if (this._focusableElements && this._focusableElements.length) {
      this._focusableElements[0].focus();
    }
  }

  private _trapFocus(e: Event) {
    if (this.open && !this._elSidebar.nativeElement.contains(e.target)) {
      this._setFocusToFirstItem();
    }
  }


  // On click outside
  // ==============================================================================================

  private _initCloseOnClickOutside() {
    if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
      // In a timeout so that things render first
      setTimeout(() => {
        document.body.addEventListener('click', this._onClickOutside);
        this._onClickOutsideAttached = true;
      }, 0);
    }
  }

  private _destroyCloseOnClickOutside() {
    if (this._onClickOutsideAttached) {
      document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }
  }

  private _onClickOutside(e: Event) {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this._manualClose();
    }
  }
}
