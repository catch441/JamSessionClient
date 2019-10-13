import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundPageComponent } from './sound-page.component';

describe('SoundPageComponent', () => {
  let component: SoundPageComponent;
  let fixture: ComponentFixture<SoundPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
