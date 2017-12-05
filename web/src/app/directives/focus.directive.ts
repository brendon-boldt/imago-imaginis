/**
 * Imago Imaginis 
 * ----------------------------
 * Angular directive to make a certain component gain focus when a page is loaded
 * Currently not fully implemented within the application
 */
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[focusMe]' })
export class FocusDirective {
    constructor(el: ElementRef) {
        console.log(el);
        el.nativeElement.autofocus = 'true';
    }
}