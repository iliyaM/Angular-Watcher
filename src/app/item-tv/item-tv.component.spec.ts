import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTvComponent } from './item-tv.component';

describe('ItemTvComponent', () => {
  let component: ItemTvComponent;
  let fixture: ComponentFixture<ItemTvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
