import { Component, Input, OnInit } from '@angular/core';
import { Anime } from '../models/anime.model';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit {
  @Input() public anime: Anime;
  constructor() { }

  public ngOnInit(): void {
  }
}
