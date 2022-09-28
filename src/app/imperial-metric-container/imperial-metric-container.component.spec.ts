import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import ImperialMetricContainerComponent from './imperial-metric-container.component';

describe('ImperialMetricContainerComponent', () => {
  let component: ImperialMetricContainerComponent;
  let fixture: ComponentFixture<ImperialMetricContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImperialMetricContainerComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImperialMetricContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
