import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PracticeComponent } from './pages/practice/practice.component';
import { HomeComponent } from './pages/home/home.component';
import { HiraganaComponent } from './pages/hiragana/hiragana.component';
import { KatakanaComponent } from './pages/katakana/katakana.component';

import { KanaTableComponent } from './components/kana-table/kana-table.component';

@NgModule({
    declarations: [
        AppComponent,
        PracticeComponent,
        HomeComponent,
        HiraganaComponent,
        KatakanaComponent,
        KanaTableComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        ButtonsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
