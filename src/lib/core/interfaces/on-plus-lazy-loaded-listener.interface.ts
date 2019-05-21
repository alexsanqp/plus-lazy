import { PlusLazyFile } from './plus-lazy-file.interface';

export interface OnPlusLazyLoadedListener {
  onPlusLazyLoaded(files: PlusLazyFile | PlusLazyFile[]): void;
}
