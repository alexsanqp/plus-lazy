## PlusLazy

PlusLazy is a lazy loading of files at the component level.

### Installation
 - `npm install --save plus-lazy`
 - And then include it in your module
    ```typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { PlusLazyModule } from 'plus-lazy';
    import { AppComponent } from './app.component';
    
    @NgModule({
        declarations: [ AppComponent ],
        imports: [ BrowserModule, PlusLazyModule ],
        bootstrap: [ AppComponent ]
    })
    export class MyAppModule {}
    ```
### Usages
 - As a decorator:
    ```typescript
    import { Component } from '@angular/core';
    import { PlusLazyLoad, PlusLazyType, PlusLazyFile, PlusFileType, PlusFilePosition, OnPlusLazyLoadedListener } from 'plus-lazy';

    declare const L: any;

    const LEAFLET_FILES: PlusLazyType = [
        {
          url: 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css',
          type: PlusFileType.Link,
          position: PlusFilePosition.HEAD_END,
        },
        {
          url: 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js',
          type: PlusFileType.Script,
          position: PlusFilePosition.BODY_END,
        },
    ];
 
    @Component({
      selector: 'ev-geography',
      templateUrl: './geography.component.html',
      styleUrls: ['./geography.component.scss'],
    })
    @PlusLazyLoad(LEAFLET_FILES)
    export class GeographyComponent implements OnPlusLazyLoadedListener {
       public onPlusLazyLoaded(data: PlusLazyFile[]): void {
        // TODO: init your code here
       }
    }
    ```
 - Use with service:
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { PlusLazyLoad, PlusLazyType, PlusLazyFile, PlusFileType, PlusFilePosition, PlusLazyService } from 'plus-lazy';

    declare const L: any;

    const LEAFLET_FILES: PlusLazyType = [
        {
          url: 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css',
          type: PlusFileType.Link,
          position: PlusFilePosition.HEAD_END,
        },
        {
          url: 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js',
          type: PlusFileType.Script,
          position: PlusFilePosition.BODY_END,
        },
    ];
 
    @Component({
      selector: 'ev-geography',
      templateUrl: './geography.component.html',
      styleUrls: ['./geography.component.scss'],
    })
    export class GeographyComponent implements OnInit {
       public constructor(
         private plService: PlusLazyService,
       ) {   
       }
    
       public ngOnInit(): void {
         this.plService
           .load(LEAFLET_FILES)
           .then((data: PlusLazyFile | PlusLazyFile[]): void => {
             // TODO: init your code here
           })
           .catch((error: Error) => {
             console.error(error);
           });
       }
    }
    ```