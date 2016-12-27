import {
  AfterContentInit,
  AnimationTransitionEvent,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
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

import { CloseSidebar } from './close.directive';

@Component({
  selector: 'ng-sidebar',
  template: `
    <aside #sidebar
      [@visibleSidebarState]="_visibleSidebarState"
      (@visibleSidebarState.start)="_animationStarted($event)"
      (@visibleSidebarState.done)="_animationDone($event)"
      role="complementary"
      [attr.aria-hidden]="!open"
      [attr.aria-label]="ariaLabel"
      class="ng-sidebar ng-sidebar--{{position}}"
      [class.ng-sidebar--style]="defaultStyles"
      [ngClass]="sidebarClass">
      <ng-content></ng-content>
    </aside>

    <div *ngIf="showBackdrop"
      [@visibleBackdropState]="_visibleBackdropState"
      aria-hidden="true"
      class="ng-sidebar__backdrop"
      [class.ng-sidebar__backdrop--style]="open && defaultStyles"
      [ngClass]="backdropClass"></div>
  `,
  styles: [`
    .ng-sidebar {
      overflow: auto;
      pointer-events: none;
      position: fixed;
      z-index: 99999999;
    }

      .ng-sidebar--left {
        bottom: 0;
        left: 0;
        top: 0;
      }

      .ng-sidebar--right {
        bottom: 0;
        right: 0;
        top: 0;
      }

      .ng-sidebar--top {
        left: 0;
        right: 0;
        top: 0;
      }

      .ng-sidebar--bottom {
        bottom: 0;
        left: 0;
        right: 0;
      }

      .ng-sidebar--style {
        background: #fff;
        box-shadow: 0 0 2.5em rgba(85, 85, 85, 0.5);
      }

    .ng-sidebar__backdrop {
      height: 100%;
      left: 0;
      pointer-events: none;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99999998;
    }

      .ng-sidebar__backdrop--style {
        background: #000;
        opacity: 0.75;
      }
  `],
  animations: [
    trigger('visibleSidebarState', [
      state('expanded', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('expanded--animate', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('collapsed--left', style({ transform: 'translateX(-110%)' })),
      state('collapsed--right', style({ transform: 'translateX(110%)' })),
      state('collapsed--top', style({ transform: 'translateY(-110%)' })),
      state('collapsed--bottom', style({ transform: 'translateY(110%)' })),
      transition('expanded--animate <=> *', animate('0.3s cubic-bezier(0, 0, 0.3, 1)'))
    ]),
    trigger('visibleBackdropState', [
      state('visible', style({ pointerEvents: 'auto' }))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar implements AfterContentInit, OnChanges, OnDestroy {
  // `openChange` allows for 2-way data binding
  @Input() open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() keyClose: boolean = false;
  @Input() keyCode: number = 27;  // Default to ESCAPE key

  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() closeOnClickOutside: boolean = false;
  @Input() showBackdrop: boolean = false;
  @Input() animate: boolean = true;

  @Input() defaultStyles: boolean = false;

  @Input() sidebarClass: string;
  @Input() backdropClass: string;

  @Input() ariaLabel: string;
  @Input() trapFocus: boolean = true;
  @Input() autoFocus: boolean = true;

  @Output() onOpen: EventEmitter<null> = new EventEmitter<null>();
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();
  @Output() onPositionChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onAnimationStarted: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();
  @Output() onAnimationDone: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();

  /** @internal */
  _visibleSidebarState: string;

  /** @internal */
  _visibleBackdropState: string;

  @ViewChild('sidebar')
  private _elSidebar: ElementRef;

  @ContentChildren(CloseSidebar)
  private _closeDirectives: QueryList<CloseSidebar>;

  private _onClickOutsideAttached: boolean = false;
  private _onKeyDownAttached: boolean = false;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  constructor(@Inject(DOCUMENT) private _document /*: HTMLDocument */) {
    this._manualClose = this._manualClose.bind(this);
    this._trapFocus = this._trapFocus.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  ngAfterContentInit() {
    if (this._closeDirectives) {
      this._closeDirectives.forEach((dir: CloseSidebar) => {
        dir.clicked.subscribe(this._manualClose);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.open) {
        this._open();
      } else {
        this._close();
      }

      this._setVisibleSidebarState();
    }

    if (changes['closeOnClickOutside'] || changes['keyClose']) {
      this._initCloseListeners();
    }

    if (changes['position']) {
      this.onPositionChange.emit(changes['position'].currentValue);
      this._setVisibleSidebarState();
    }
  }

  ngOnDestroy() {
    this._destroyCloseListeners();

    if (this._closeDirectives) {
      this._closeDirectives.forEach((dir: CloseSidebar) => {
        dir.clicked.unsubscribe();
      });
    }
  }

  // Animation callbacks
  // ==============================================================================================

  /** @internal */
  _animationStarted(e: AnimationTransitionEvent): void {
    this.onAnimationStarted.emit(e);
  }

  /** @internal */
  _animationDone(e: AnimationTransitionEvent): void {
    this.onAnimationDone.emit(e);
  }


  // Sidebar toggling
  // ==============================================================================================

  private _setVisibleSidebarState(): void {
    this._visibleSidebarState = this.open ?
      (this.animate ? 'expanded--animate' : 'expanded') :
      `collapsed--${this.position}`;

    this._visibleBackdropState = this.open ? 'visible' : null;
  }

  private _open(): void {
    this._setFocused(true);

    this._initCloseListeners();

    this.onOpen.emit(null);
  }

  private _close(): void {
    this._setFocused(false);

    this._destroyCloseListeners();

    this.onClose.emit(null);
  }

  private _manualClose(): void {
    this.open = false;
    this.openChange.emit(false);

    this._close();
  }


  // Focus on open/close
  // ==============================================================================================

  private _setFocusToFirstItem(): void {
    if (this.autoFocus && this._focusableElements && this._focusableElements.length) {
      this._focusableElements[0].focus();
    }
  }

  private _trapFocus(e: FocusEvent): void {
    if (this.open && this.trapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
      this._setFocusToFirstItem();
    }
  }

  // Handles the ability to focus sidebar elements when it's open/closed
  private _setFocused(open: boolean): void {
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;

    if (open) {
      this._focusedBeforeOpen = this._document.activeElement as HTMLElement;

      // Restore focusability, with previous tabindex attributes
      for (let el of this._focusableElements) {
        const prevTabIndex = el.getAttribute('__tabindex__');
        if (prevTabIndex) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute('__tabindex__');
        } else {
          el.removeAttribute('tabindex');
        }
      }

      this._setFocusToFirstItem();

      this._document.body.addEventListener('focus', this._trapFocus, true);
    } else {
      // Manually make all focusable elements unfocusable, saving existing tabindex attributes
      for (let el of this._focusableElements) {
        const existingTabIndex = el.getAttribute('tabindex');
        if (existingTabIndex) {
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


  // Event handlers
  // ==============================================================================================

  private _initCloseListeners(): void {
    if (this.open && (this.closeOnClickOutside || this.keyClose)) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (this.closeOnClickOutside && !this._onClickOutsideAttached) {
          this._document.body.addEventListener('click', this._onClickOutside);
          this._onClickOutsideAttached = true;
        }

        if (this.keyClose && !this._onKeyDownAttached) {
          this._document.body.addEventListener('keydown', this._onKeyDown);
          this._onKeyDownAttached = true;
        }
      });
    }
  }

  private _destroyCloseListeners(): void {
    if (this._onClickOutsideAttached) {
      this._document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }

    if (this._onKeyDownAttached) {
      this._document.body.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDownAttached = false;
    }
  }

  private _onClickOutside(e: MouseEvent): void {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this._manualClose();
    }
  }

  private _onKeyDown(e: KeyboardEvent | Event): void {
    e = e || window.event;

    if ((e as KeyboardEvent).keyCode === this.keyCode) {
      this._manualClose();
    }
  }
}
