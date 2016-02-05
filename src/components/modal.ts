import * as jQuery from 'jquery';
import 'bootstrap';
import { Component, AfterViewInit, Input, Output, EventEmitter, Type } from 'angular2/core';

const $: any = jQuery.noConflict();

@Component({
    selector: 'modal',
    template: `
        <div id="{{id}}" class="modal" [ngClass]="{ fade: animation }" tabindex="-1" role="dialog">
            <div class="modal-dialog" [ngClass]="{ 'modal-sm': isSmall(), 'modal-lg': isLarge() }">
                <div class="modal-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent implements AfterViewInit {

    id: string = uniqueId('modal_');
    $modal: JQuery;
    result: ModalResult = ModalResult.None;
    hiding: boolean = false;
    overrideSize: string = null;
    @Input() animation: boolean = true;
    @Input() size: string;
    @Output() onClose: EventEmitter<string> = new EventEmitter();

    ngAfterViewInit() {
        this.$modal = $('#' + this.id);
        this.$modal.appendTo('body').modal({show: false});
        this.$modal
            .on('hide.bs.modal', (e) => {
                this.hiding = true;
                if (this.result === ModalResult.None) this.dismiss();
                this.result = ModalResult.None;
            })
            .on('hidden.bs.modal', (e) => {
                this.hiding = false;
                this.overrideSize = null;
            });
    }

    open(size?: string) {
        if (ModalSize.validSize(size)) this.overrideSize = size;
        this.$modal.modal('show');
    }

    close() {
        this.result = ModalResult.Close;
        this.onClose.next(this.result);
        this.hide();
    }

    dismiss() {
        this.result = ModalResult.Dismiss;
        this.onClose.next(this.result);
        this.hide();
    }

    private hide() {
        if (!this.hiding) this.$modal.modal('hide');
    }

    private isSmall() {
        return this.overrideSize !== ModalSize.Large && this.size === ModalSize.Small || this.overrideSize === ModalSize.Small;
    }

    private isLarge() {
        return this.overrideSize !== ModalSize.Small && this.size === ModalSize.Large || this.overrideSize === ModalSize.Large;
    }
}

export class ModalSize {
    static Small = 'sm';
    static Large = 'lg';

    static validSize(size: string) {
        return size && (size === ModalSize.Small || size === ModalSize.Large);
    }
}

export enum ModalResult {
    None,
    Close,
    Dismiss
}

let id: number = 0;
export function uniqueId(prefix: string): string {
    return prefix + ++id;
}