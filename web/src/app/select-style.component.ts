/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'select-style',
  templateUrl: './select-style.component.html',
  styleUrls: ['./app.component.css']
})
export class SelectStyleComponent {
  freeUser: boolean = true;
  uploadImage: String = "../assets/monalisa.jpg";
  selectedStyle: Object = {"style": "Select a style", "example":"assets/brush.png"};
  styles: Array<Object> = [{"style":"Cubism", "example":"../assets/cubism.jpg"}, {"style":"Flowers", "example":"../assets/flowers.jpg"}, {"style":"Starry Night", "example":"../assets/starrynight.jpg"}, {"style":"Oil Painting", "example":"../assets/oil.jpg"}, {"style":"Impressionism", "example":"../assets/impress.jpg"}];
  update = function(style){
    this.selectedStyle = style;
  }
}
