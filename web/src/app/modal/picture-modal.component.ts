/**
 * This is the modal component that we use in our Angular environment
 * https://stackoverflow.com/questions/34513558/angular-2-0-and-modal-dialog
 */
import { Component, Input, ViewChild } from '@angular/core';
@Component({
  selector: 'picture-modal',
  template: `
  <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'show': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'inline-flex' : 'none', 'color': 'black', 'overflow': 'scroll'}">
    <div class="modal-dialog" style="min-width: 85%;">
      <div class="modal-content" style="background: rgba(255, 255, 255, .9);">
        <div class="modal-header" style="margin: auto">
          <ng-content select=".app-modal-header"></ng-content>
        </div>
        <div class="modal-body">
          <ng-content select=".app-modal-body"></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select=".app-modal-footer"></ng-content>
        </div>
      </div>
    </div>
  </div>
  `
})
export class PictureModalComponent {
  @Input() clickOutsideToHide;
  @ViewChild('video') video;

  public visible = false;
  public visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      if(this.clickOutsideToHide){
        this.hide();
      }
    }
  }
}