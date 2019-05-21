import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { PlusLazyFile } from '../interfaces/plus-lazy-file.interface';
import { PlusFilePosition } from '../enums/plus-file-poition.enum';
import { PlusFileType } from '../enums/plus-file-type.enum';

@Injectable()
export class PlusLazyHelperService {
  public document: Document;

  public constructor(
    @Inject(DOCUMENT) document: any, // https://github.com/angular/angular/issues/23904
  ) {
    this.document = <Document>document;
  }

  public merge(target: any, ...sources: any[]): any {
    if (!sources.length) {
      return target;
    }

    const source: object = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (this.isObject(source[key])) {
            if (!target[key]) {
              Object.assign(target, { [key]: {} });
            }

            this.merge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }
    }

    return this.merge(target, ...sources);
  }

  public isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
  }

  public getElement(options: PlusLazyFile): HTMLElement | null {
    switch (options.type) {
      case PlusFileType.Script:
        return this.getScriptElement(options);

      case PlusFileType.Link:
        return this.getLinkElement(options);
    }

    return null;
  }

  public getScriptElement(loadScript: PlusLazyFile): HTMLScriptElement {
    const scriptElement: HTMLScriptElement = this.document.createElement(PlusFileType.Script);

    scriptElement.src = loadScript.url;

    this.setAttribute(scriptElement, loadScript);

    return scriptElement;
  }

  public getLinkElement(loadScript: PlusLazyFile): HTMLLinkElement {
    const linkElement: HTMLLinkElement = this.document.createElement(PlusFileType.Link);

    linkElement.href = loadScript.url;
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';

    this.setAttribute(linkElement, loadScript);

    return linkElement;
  }

  public insertByPosition(element: HTMLElement, loadScript: PlusLazyFile): void {
    switch (loadScript.position) {
      case PlusFilePosition.HEAD_BEGIN: {
        this.document.getElementsByTagName('head')[0].insertAdjacentElement('afterbegin', element);
        break;
      }

      case PlusFilePosition.HEAD_END: {
        this.document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', element);
        break;
      }

      case PlusFilePosition.BODY_BEGIN: {
        this.document.body.insertAdjacentElement('afterbegin', element);
        break;
      }

      case PlusFilePosition.BODY_END: {
        this.document.body.insertAdjacentElement('beforeend', element);
        break;
      }

      default:
        this.document.getElementsByTagName('head')[0].insertAdjacentElement('beforeend', element);
    }
  }

  public setAttribute(element: HTMLElement, data: PlusLazyFile): void {
    if (data.attr) {
      Object.keys(data.attr).forEach((value: string) => {
        element[value] = data.attr[value];
      });
    }
  }
}
