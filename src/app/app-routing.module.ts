import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticeComponent } from './pages/practice/practice.component';
import { HomeComponent } from './pages/home/home.component';
import { HiraganaComponent } from './pages/hiragana/hiragana.component';
import { KatakanaComponent } from './pages/katakana/katakana.component';

const routes: Routes = [
    { path: '', redirectTo: '/practice', pathMatch: 'full' },
    { path: 'practice', component: HomeComponent },
    { path: 'practice/:mode/:read', component: PracticeComponent },
    { path: 'hiragana', component: HiraganaComponent },
    { path: 'katakana', component: KatakanaComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
