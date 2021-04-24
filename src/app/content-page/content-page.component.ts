import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  public anime: Anime;
  public watching: boolean;
  public immersionEntries;
  public immersionEntryForm: FormGroup;
  public chartType = ChartType.LineChart
  public chartData;
  public dataReady = false;
  public entryListStatus = 'hidden';
  public entryFormStatus = 'hidden';
  public entryListClass = `entry-list ${this.entryListStatus}`;
  public entryFormClass = `entry-form ${this.entryFormStatus}`

  public constructor(private route: ActivatedRoute, private kitsuService: KitsuService, private firestoreService: FirestoreService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    // Get the anime slug from the current url. Using the route snapshot allows us
    // to retrieve our anime even if the user browses directly to the route without
    // using the apps router outlet.
    const animeSlug: string = this.route.snapshot.url[1].path;
    this.kitsuService.getAnime(animeSlug).subscribe((anime: Anime) => {
      this.anime = anime;
      this.watching = this.firestoreService.watchingAnime.find(element => element.id === this.anime.id) ? true : false;
      this.firestoreService.getImmersionEntries(this.anime.attributes.slug).subscribe((immersionEntries) => {
        this.immersionEntries = immersionEntries;
        this.immersionEntries.valueChanges().subscribe((res) => {
          this.chartData = Object.entries(res).sort();
          this.dataReady = true;
        });
      });
    });
    this.initializeForm();
  }

  public initializeForm(): void {
    this.immersionEntryForm = this.formBuilder.group({
      date: '',
      length: 0,
    })
  }

  public submitEntry(): void {
    const finalizeSubmit = () => {
      let docData = { }
      docData[this.immersionEntryForm.value.date] = this.immersionEntryForm.value.length;
      this.immersionEntries.update(docData);
      this.immersionEntryForm.reset();
      this.immersionEntryForm.patchValue({length: 0});
    }
    if (this.chartData.find(element => element[0] == this.immersionEntryForm.value.date)) {
      if(confirm('An entry for the entered date was already found. Overwrite the current entry?')) {
        finalizeSubmit();
      } else {
        alert('Your entry was not submitted.')
      }
    } else {
      finalizeSubmit();
    }
    
  }

  public toggleEntryList(): void {
    this.entryListStatus = this.entryListStatus === 'hidden' ? 'active' : 'hidden';
    this.entryListClass = `entry-list ${this.entryListStatus}`;
  }

  public toggleEntryForm(): void {
    this.entryFormStatus = this.entryFormStatus === 'hidden' ? 'active' : 'hidden';
    this.entryFormClass = `entry-form ${this.entryFormStatus}`;
  }
}
