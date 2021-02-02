import { SafePipe } from './safe.pipe';
import {DomSanitizer} from '@angular/platform-browser';

describe('SafePipe', () => {
  it('create an instance', () => {
    // @ts-ignore
    const pipe = new SafePipe(new DomSanitizer());
    expect(pipe).toBeTruthy();
  });
});
