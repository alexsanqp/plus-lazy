import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PlusLazyFile } from '../interfaces/plus-lazy-file.interface';
import { PlusFileType } from '../enums/plus-file-type.enum';
import { PlusLazyType } from '../types/plus-lazy.type';
import { PlusLazyHelperService } from './plus-lazy-helper.service';

const PlusFileDefaults: Partial<PlusLazyFile> = {
  attr: {
    async: false,
  },
};

@Injectable({
  providedIn: 'root',
})
export class PlusLazyService {
  public readonly loaded: Map<string, PlusLazyFile>;

  public constructor(
    private http: HttpClient,
    private helper: PlusLazyHelperService,
  ) {
    this.loaded = new Map<string, PlusLazyFile>();
  }

  public load(
    loadScript: PlusLazyType,
    type: PlusFileType = PlusFileType.Script,
  ): Promise<null | never | PlusLazyFile | PlusLazyFile[]> {
    try {
      switch (true) {
        case typeof loadScript === 'string': {
          return this.startLoad({ type, url: <string>loadScript });
        }

        case Array.isArray(loadScript): {
          const scripts: Promise<PlusLazyFile>[] = (<PlusLazyFile[]>loadScript).map(this.loadArrayScriptMap(type).bind(this));

          return <Promise<PlusLazyFile[]>>Promise.all(scripts);
        }

        case loadScript && typeof loadScript === 'object': {
          return this.startLoad(<PlusLazyFile>loadScript);
        }
      }
    } catch (error) {
      return <Promise<never>>Promise.reject(error);
    }

    return <Promise<null>>Promise.resolve(null);
  }

  public getFile<T>(loadScript: PlusLazyFile): Observable<T | T[]> {
    return this.http.get<T>(loadScript.url);
  }

  private startLoad(loadScript: PlusLazyFile): Promise<PlusLazyFile | null> {
    const options: PlusLazyFile = this.helper.merge({}, PlusFileDefaults, loadScript);

    return new Promise((resolve: any, reject: any): void => {
      if (this.loaded.has(options.url)) {
        return resolve(this.loaded.get(options.url));
      }

      switch (options.type) {
        case PlusFileType.Script:
        case PlusFileType.Link: {
          const element: HTMLElement = this.helper.getElement(options);
          this.elementEventAttach(element, options, resolve, reject);

          break;
        }

        case PlusFileType.File: {
          this.getFile(options)
            .pipe(
              map((data: any) => ({ ...options, data })),
              tap((loadData: PlusLazyFile) => this.loaded.set(options.url, loadData)),
            )
            .subscribe(
              (loadData: PlusLazyFile) => resolve(loadData),
              (error: any) => reject(error),
            );

          break;
        }
      }

    }) as any;
  }

  private elementEventAttach(element: HTMLElement, loadScript: PlusLazyFile, resolve: any, reject: any): void {
    if (!!element) {
      element.onload = (data: Event): void => {
        const loadData: PlusLazyFile = {
          ...loadScript,
          data,
        };

        this.loaded.set(loadScript.url, loadData);

        resolve(loadData);
      };

      element.onerror = (error: ErrorEvent): void => {
        if (this.loaded.has(loadScript.url)) {
          this.loaded.delete(loadScript.url);
        }

        reject(error);
      };

      this.helper.insertByPosition(element, loadScript);
    }
  }

  private loadArrayScriptMap(type: PlusFileType): Function {
    return (link: string | PlusLazyFile): Promise<PlusLazyFile> | never => {
      switch (true) {
        case typeof link === 'string':
          return this.startLoad(<PlusLazyFile>{ type, url: link });

        case typeof link === 'object':
          return this.startLoad(<PlusLazyFile>link);

        default:
          throw Error('Wrong type of load script parameter');
      }
    };
  }
}
