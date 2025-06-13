import { Signal, signal, computed } from '@angular/core';

export class DialogRef<T = any, R = any> {
    private readonly _afterClosed = signal<R | undefined>(undefined);
    private readonly _componentInstance = signal<T | null>(null);
    private readonly _isVisible = signal(false);

    constructor(public id: string) {}
  
    /**
        * Sets the dialog component instance
    */
    setComponentInstance(instance: T): void {
        this._componentInstance.set(instance);
    }

    /**
        * Gets the dialog component instance
    */
    get componentInstance(): Signal<T | null> {
        return this._componentInstance;
    }

    /**
        * Controls the visibility of the dialog
    */
    get isVisible(): Signal<boolean> {
        return this._isVisible;
    }

    /**
        * Shows the dialog
    */
    open(): void {
        this._isVisible.set(true);
    }

    /**
        * Closes the dialog with an optional result
    */
    close(result?: R): void {
        this._isVisible.set(false);
        this._afterClosed.set(result);
    }

    /**
        * Gets the result of the dialog after it's closed
    */
    get afterClosed(): Signal<R | undefined> {
        return this._afterClosed;
    }
}