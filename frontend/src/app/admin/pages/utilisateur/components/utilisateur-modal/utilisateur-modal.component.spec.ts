import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurModalComponent } from './utilisateur-modal.component';

describe('UtilisateurModalComponent', () => {
  let component: UtilisateurModalComponent;
  let fixture: ComponentFixture<UtilisateurModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
