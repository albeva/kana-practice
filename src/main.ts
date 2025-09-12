import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import './app/utils';

if (environment.production) {
    enableProdMode();
}

platformBrowser()
    .bootstrapModule(AppModule)
    .catch(console.error);
