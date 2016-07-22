import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ng2-sidebar',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ng2-sidebar {
      bottom: 0;
      left: 0;
      overflow: auto;
      pointer-events: none;
      position: fixed;
      top: 0;
      transform: translateX(-110%);
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      will-change: transform;
      z-index: 99999999;
    }

      .ng2-sidebar--style {
        background: #fff;
        box-shadow: 0 0 2.5em rgba(84, 85, 85, 0.5);
      }

      .ng2-sidebar--pull-right {
        left: auto;
        right: 0;
        transform: translateX(110%);
      }

      .ng2-sidebar.ng2-sidebar--open {
        pointer-events: auto;
        transform: none;
        will-change: initial;
      }

    .ng2-sidebar__overlay {
      background: #000;
      height: 100%;
      left: 0;
      opacity: 0.75;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99999998;
    }
  `],
  template: `
    <aside #sidebar
      class="ng2-sidebar"
      [class.ng2-sidebar--style]="defaultStyles"
      [class.ng2-sidebar--open]="open"
      [class.ng2-sidebar--pull-right]="pullRight"
      [ngClass]="sidebarClassName">
      <ng-content></ng-content>
    </aside>

    <div *ngIf="showOverlay && open"
      class="ng2-sidebar__overlay"
      [ngClass]="overlayClassName"></div>
  `
})
export default class Sidebar implements OnInit, OnChanges, OnDestroy {
  // `openChange` allows for 2-way data binding
  @Input() open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() pullRight: boolean = false;
  @Input() closeOnClickOutside: boolean = false;
  @Input() showOverlay: boolean = false;

  @Input() defaultStyles: boolean = false;

  @Input() sidebarClassName: string;
  @Input() overlayClassName: string;

  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('sidebar')
  private _elSidebar: ElementRef;

  private _onClickOutsideAttached: boolean = false;

  constructor() {
    this._onClickOutside = this._onClickOutside.bind(this);
  }

  ngOnInit() {
    this._initCloseOnClickOutside();
  }

  ngOnDestroy() {
    this._destroyCloseOnClickOutside();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['open']) {
      if (this.open) {
        this.onOpen.emit(null);

        this._initCloseOnClickOutside();
      } else {
        this.onClose.emit(null);

        this._destroyCloseOnClickOutside();
      }
    }

    if (changes['closeOnClickOutside']) {
      this._initCloseOnClickOutside();
    }
  }


  // On click outside
  // ==============================================================================================

  private _initCloseOnClickOutside() {
    if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
      // timeout so that things render first
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
      this.open = false;
      this.openChange.emit(false);

      this.onClose.emit(null);

      this._destroyCloseOnClickOutside();
    }
  }
}
