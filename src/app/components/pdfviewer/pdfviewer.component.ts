import { Component, Input } from '@angular/core';

@Component({
    selector: 'ej-app',
    templateUrl: './pdfviewer.component.html',
})
export class PdfViewerComponent {
     service: string; 

     @Input() 
     docPath: string = '';
     
    constructor() {
        this.service = 'http://js.syncfusion.com/demos/ejservices/api/PdfViewer';
        
    }	
}
