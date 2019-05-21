import { Injector, NgModule } from '@angular/core';

import { PlusLazyHelperService } from './core/services/plus-lazy-helper.service';

export let PlusInjectorInstance: Injector;

@NgModule({
  declarations: [],
  imports: [],
  providers: [PlusLazyHelperService],
  exports: [],
})
export class PlusLazyModule {
  public constructor(
    private injector: Injector,
  ) {
    PlusInjectorInstance = this.injector;
  }
}
