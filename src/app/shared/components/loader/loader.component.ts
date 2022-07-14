import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

type type = 'border' | 'grow';
type coverSize = 'page' | 'fragment';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  @Input() type: type = 'grow';
  @Input() coverSize: coverSize = 'page';
}
