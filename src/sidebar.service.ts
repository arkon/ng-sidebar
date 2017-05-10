import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';

import { Sidebar } from './sidebar.component';

@Injectable()
export class SidebarService {
  private _openObserver: Subject<void> = new Subject<void>();
  private _closeObserver: Subject<void> = new Subject<void>();
  private _registerObserver: ReplaySubject<Sidebar> = new ReplaySubject<Sidebar>();

  open(): void {
    this._openObserver.next();
  }

  close(): void {
    this._closeObserver.next();
  }

  register(sidebar: Sidebar) {
    this._registerObserver.next(sidebar);
  }

  onOpen(fn: () => void): Subscription {
    return this._openObserver.subscribe(fn);
  }

  onClose(fn: () => void): Subscription {
    return this._closeObserver.subscribe(fn);
  }

  onRegister(fn: (sidebar: Sidebar) => void): Subscription {
    return this._registerObserver.subscribe(fn);
  }
}
