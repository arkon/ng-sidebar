import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  QueryList,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import CloseSidebar from './close.directive';

export const SIDEBAR_POSITION = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
};

@Component({
  selector: 'ng2-sidebar',
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside #sidebar
      [@visibleSidebarState]="_visibleSidebarState"
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
      [class.ng2-sidebar__overlay--style]="open && defaultStyles"
      [ngClass]="overlayClass"></div>
  `,
  styles: [`
    .ng2-sidebar {
      overflow: auto;
      pointer-events: none;
      position: fixed;
      z-index: 99999999;
    }

      .ng2-sidebar--left {
        bottom: 0;
        left: 0;
        top: 0;
      }

      .ng2-sidebar--right {
        bottom: 0;
        right: 0;
        top: 0;
      }

      .ng2-sidebar--top {
        left: 0;
        right: 0;
        top: 0;
      }

      .ng2-sidebar--bottom {
        bottom: 0;
        left: 0;
        right: 0;
      }

      .ng2-sidebar--style {
        background: #fff;
        box-shadow: 0 0 2.5em rgba(85, 85, 85, 0.5);
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

      .ng2-sidebar__overlay--style {
        background: #000;
        opacity: 0.75;
      }
  `],
  animations: [
    trigger('visibleSidebarState', [
      state('expanded', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('collapsed--left', style({ transform: 'translateX(-110%)' })),
      state('collapsed--right', style({ transform: 'translateX(110%)' })),
      state('collapsed--top', style({ transform: 'translateY(-110%)' })),
      state('collapsed--bottom', style({ transform: 'translateY(110%)' })),
      transition('* => *', animate('0.3s cubic-bezier(0, 0, 0.3, 1)'))
    ])
  ]
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

  private _visibleSidebarState: string;

  private _onClickOutsideAttached: boolean = false;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument) {
    this._trapFocus = this._trapFocus.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
  }

  ngOnInit() {
    this._setvisibleSidebarState();

    this._setFocused(this.open);

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.open) {
        this._open();
      } else {
        this._close();
      }

      this._setvisibleSidebarState();
    }

    if (changes['closeOnClickOutside']) {
      this._initCloseOnClickOutside();
    }

    if (changes['position']) {
      this._setvisibleSidebarState();
    }
  }

  private _setvisibleSidebarState() {
    this._visibleSidebarState = this.open ? 'expanded' : `collapsed--${this.position}`;
  }

  private _open() {
    this._setFocused(true);

    this._initCloseOnClickOutside();

    this.onOpen.emit(null);
  }

  private _close() {
    this._setFocused(false);

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
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;
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

  // Handles the ability to focus sidebar elements when it's open/closed'
  private _setFocused(open: boolean) {
    this._getFocusableElements();

    if (open) {
      this._focusedBeforeOpen = this._document.activeElement as HTMLElement;

      // Restore focusability, with previous tabIndex attributes
      for (let el of this._focusableElements) {
        const prevTabIndex = el.getAttribute('__tabindex__');
        if (prevTabIndex !== null) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute('__tabindex__');
        } else {
          el.removeAttribute('tabindex');
        }
      }

      this._setFocusToFirstItem();

      this._document.body.addEventListener('focus', this._trapFocus, true);
    } else {
      // Manually make all focusable elements unfocusable, saving existing tabIndex attributes
      for (let el of this._focusableElements) {
        const existingTabIndex = el.getAttribute('tabindex');
        if (existingTabIndex !== null) {
          el.setAttribute('__tabindex__', existingTabIndex);
        }

        el.setAttribute('tabindex', '-1');
      }

      if (this._focusedBeforeOpen) {
        this._focusedBeforeOpen.focus();
      }

      this._document.body.removeEventListener('focus', this._trapFocus, true);
    }
  }


  // On click outside
  // ==============================================================================================

  private _initCloseOnClickOutside() {
    if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
      // In a timeout so that things render first
      setTimeout(() => {
        this._document.body.addEventListener('click', this._onClickOutside);
        this._onClickOutsideAttached = true;
      });
    }
  }

  private _destroyCloseOnClickOutside() {
    if (this._onClickOutsideAttached) {
      this._document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }
  }

  private _onClickOutside(e: Event) {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this._manualClose();
    }
  }
}
