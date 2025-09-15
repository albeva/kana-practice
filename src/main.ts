import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';

import './app/utils';

platformBrowser()
    .bootstrapModule(AppModule)
    .catch(console.error);
