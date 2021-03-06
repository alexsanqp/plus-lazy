import { PlusInjectorInstance } from '../../plus-lazy.module';
import { PlusLazyService } from '../services/plus-lazy.service';
import { PlusLazyType } from '../types/plus-lazy.type';
import { PlusLazyFile } from '../interfaces/plus-lazy-file.interface';
import { PlusOptions } from '../interfaces/plus-options.interface';
import { ExecutePosition } from '../enums/execute-position.enum';

const defaults: PlusOptions = {
  onInit: true,
  position: ExecutePosition.After,
};

export const PlusLazyLoad: Function = (
  list: PlusLazyType,
  options?: PlusOptions,
): Function => {
  const option: PlusOptions = Object.assign({}, options, defaults);

  return function (target: any, objOrType?: any): void {
    if (!!PlusInjectorInstance) {
      const self: any = target.prototype;

      if (option.onInit) {
        const originOnInit: Function = self.ngOnInit;

        self.ngOnInit = function (...args: any[]): void {
          if (option.position === ExecutePosition.Before) {
            requestFiles.apply(this, [list]);
          }

          if (originOnInit) {
            originOnInit.apply(this, args);
          }

          if (option.position === ExecutePosition.After) {
            requestFiles.apply(this, [list]);
          }
        };
      } else {
        requestFiles.apply(self, [list]);
      }
    }
  };
};

function requestFiles(plusList: PlusLazyType): void {
  const plusLazyService: PlusLazyService = PlusInjectorInstance.get<PlusLazyService>(PlusLazyService);

  if (plusLazyService) {
    plusLazyService
      .load(plusList)
      .then((data: PlusLazyFile | PlusLazyFile[]) => {
        if (typeof this.onPlusLazyLoaded === 'function') {
          this.onPlusLazyLoaded(data);
        }
      })
      .catch((error: Error) => {
        if (this && typeof this.onPlusLazyLoadError === 'function') {
          this.onPlusLazyLoadError(error);
        }
      });
  }
}
