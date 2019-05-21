import { PlusFilePosition } from '../enums/plus-file-poition.enum';
import { PlusFileType } from '../enums/plus-file-type.enum';

export interface PlusLazyFile {
  url: string;
  type: PlusFileType;
  position?: PlusFilePosition;
  attr?: {
    integrity?: string;
    crossOrigin?: string;
    async?: boolean;
    defer?: boolean;
    [key: string]: any,
  };
  data?: Event | any | null;
}
