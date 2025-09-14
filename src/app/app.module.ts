import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PracticeComponent } from './pages/practice/practice.component';
import { HomeComponent } from './pages/home/home.component';
import { HiraganaComponent } from './pages/hiragana/hiragana.component';
import { KatakanaComponent } from './pages/katakana/katakana.component';

import { KanaTableComponent } from './components/kana-table/kana-table.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
    getAnalytics,
    provideAnalytics,
    ScreenTrackingService,
} from '@angular/fire/analytics';

import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        PracticeComponent,
        HomeComponent,
        HiraganaComponent,
        KatakanaComponent,
        KanaTableComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        ScreenTrackingService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
