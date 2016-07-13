import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
export default class Sidebar implements OnInit, OnChanges, OnDestroy {
    open: boolean;
    pullRight: boolean;
    onOpen: EventEmitter<any>;
    onClose: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
}
