import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from '../../../core/src/app/lib/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Biblioteca';

  constructor(private versionCheck: VersionCheckService) {}

  ngOnInit(): void {
    this.versionCheck.init();
  }
}
