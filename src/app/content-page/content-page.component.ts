import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartType, GoogleChartComponent } from 'angular-google-charts';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  @ViewChild('immersionChart', {static: false}) immersionChart: GoogleChartComponent;
  public anime: Anime;
  public watching: boolean;
  public immersionEntries;
  public immersionEntryForm: FormGroup;
  public chartType = ChartType.LineChart
  public chartData;
  public displayChart = false;
  public isMobileScreen = false;
  public entryListStatus = 'hidden';
  public entryFormStatus = 'hidden';
  public entryListClass = `entry-list ${this.entryListStatus}`;
  public entryFormClass = `entry-form ${this.entryFormStatus}`;
  public FlexSettings;
  public activeFlexSettings;

  public constructor(
    private route: ActivatedRoute, 
    private kitsuService: KitsuService, 
    private firestoreService: FirestoreService, 
    private formBuilder: FormBuilder,
    private bpObserver: BreakpointObserver,
  ) { }

  public ngOnInit(): void {
    // Ensure that the chart is redrawn on window resize
    window.addEventListener('resize', () => {
      this.immersionChart.chartWrapper.draw();
    })

    // Initialize and freeze FlexSettings for easy switching between views
    this.FlexSettings = {
      mobileScreen: {
        pageLayout: 'column',
        containers: {
          contentDetails: '49%',
          immersionDetails: '49%',
          gap: '2%',
        },
        contentDetails: {
          layout: 'row',
          posterImage: '284px',
          contentText: 'calc(70% - 284px)',
        },
        immersionDetails: {
          entriesContainerLayout: 'column',
        }
      },
      smallScreen: {
        pageLayout: 'column',
        containers: {
          contentDetails: '49%',
          immersionDetails: '49%',
          gap: '2%',
        },
        contentDetails: {
          layout: 'row',
          posterImage: '284px',
          contentText: 'calc(70% - 284px)',
        },
        immersionDetails: {
          entriesContainerLayout: 'row',
        }
      },
      largeScreen: {
        pageLayout: 'row',
        containers: {
          contentDetails: '48%',
          immersionDetails: '45%',
          gap: '1%',
        },
        contentDetails: {
          layout: 'row',
          posterImage: '284px',
          contentText: 'calc(70% - 284px)',
        },
        immersionDetails: {
          entriesContainerLayout: 'row',
        }
      },
    }
    Object.freeze(this.FlexSettings);

    // Set breakpoints for switching between mobile and desktop view

    this.bpObserver.observe(['(max-width: 1368px)', '(max-width: 800px)']).subscribe((result) => {
      const breakpoints = result.breakpoints;
      if (breakpoints['(max-width: 800px)']) {
        this.isMobileScreen = true;
        this.activeFlexSettings = this.FlexSettings.mobileScreen;
      }
      else if (breakpoints['(max-width: 1368px)']) {
        this.activeFlexSettings = this.FlexSettings.smallScreen;
        this.isMobileScreen = false;
      } else {
        this.activeFlexSettings = this.FlexSettings.largeScreen;
        this.isMobileScreen = false;
      }
    });

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
          if (res) {
            this.chartData = Object.entries(res).sort();
            
            // Check for empty chart data that could occurr when the only entry for an anime is deleted
            if (this.chartData.length > 0) {
              this.displayChart = true;
            }
          } else {
            this.chartData = []
          }
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
      this.immersionEntries.set(docData, {merge: true});
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
