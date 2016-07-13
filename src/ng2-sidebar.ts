import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'ng2-sidebar',
  styles: [`
    .ng2-sidebar {
      background: #fff;
      bottom: 0;
      box-shadow: 0 0 2.5em rgba(84,85,85,0.5);
      left: 0;
      max-width: 250px;
      overflow: auto;
      padding: 2em 1em;
      pointer-events: none;
      position: fixed;
      top: 0;
      transform: translateX(-110%);
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      width: 100%;
      will-change: transform;
      z-index: 99999999;
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
  `],
  template: `
    <div class="ng2-sidebar"
      [class.ng2-sidebar--open]="open"
      [class.ng2-sidebar--pull-right]="pullRight"
      [ngClass]="sidebarClassName">
      <ng-content></ng-content>
    </div>
  `
})
export default class Sidebar implements OnInit, OnChanges, OnDestroy {
  @Input() open: boolean = false;
  @Input() pullRight: boolean = false;
  @Input() closeOnClickOutside: boolean = false;

  @Input() sidebarClassName: string;

  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  private _onClickOutsideAttached: boolean = false;

  constructor(private _el: ElementRef) {
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
        console.log('OPEN CHANGE')
        this.onOpen.emit(null);
        this._initCloseOnClickOutside();
      } else {
        console.log('CLOSE CHANGE')
        this.onClose.emit(null);
      }
    }
  }


  // On click outside

  private _initCloseOnClickOutside() {
    if (this.open && this.closeOnClickOutside && !this._onClickOutsideAttached) {
      document.body.addEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = true;
    }
  }

  private _destroyCloseOnClickOutside() {
    if (this._onClickOutsideAttached) {
      document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }
  }

  private _onClickOutside(e: Event) {
    if (this.open && !this._el.nativeElement.contains(e.target)) {
      console.log('CLICK OUTSIDE')
      this.open = false;
      this.onClose.emit(null);

      this._destroyCloseOnClickOutside();
    }
  }
}
