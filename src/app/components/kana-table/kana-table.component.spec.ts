import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanaTableComponent } from './kana-table.component';

describe('KanaTableComponent', () => {
  let component: KanaTableComponent;
  let fixture: ComponentFixture<KanaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
