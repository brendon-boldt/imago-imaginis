import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[focusMe]' })
export class FocusDirective {
    constructor(el: ElementRef) {
        console.log(el);
        el.nativeElement.autofocus = 'true';
    }
}