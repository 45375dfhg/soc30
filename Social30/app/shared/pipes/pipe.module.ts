import { NgModule } from '@angular/core';
import { KeysPipe } from './keys.pipe';

// why:
// https://stackoverflow.com/questions/39007130/the-pipe-could-not-be-found-angular2-custom-pipe/40770507#40770507

@NgModule({
    imports:        [],
    declarations:   [KeysPipe],
    exports:        [KeysPipe],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
} 