/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the system stats page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import Chart from 'chart.js';

@Component({
  selector: 'system-stats',
  templateUrl: './system-stats.component.html',
  styleUrls: ['../css/app.component.css', '../css/system-stats.component.css']
})
export class SystemStatsComponent {
  dataReady: boolean = false;
  stats: any;
  diskStats: any;
  processingPhotos: any;
  processingVideos: any;
  pastDayUploadCount: any;
  pastWeekUploadCount: any;
  pastMonthUploadCount: any;
  pastDayReqCount: any;
  pastWeekReqCount: any;
  pastMonthReqCount: any;
  flaggedPhotos: any;
  flaggedVideos: any;
// ------------------------------------- CHARTS -------------------------------------------
  // General settings for charts on the page
  chartOptions = {
    responsive: true,
    scaleFontColor: "#FFFFFF"
  };
  // Data for the number of uplaods
  chartDataUploads = [
    { data: [], label: 'Uploads' },
  ];
  // Data for the number of data requests
  chartDataReqs = [
    { data: [], label: 'Requests' },
  ];
  // Settings for chart colors on the page
  chartColors = [
    {
      backgroundColor: 'rgba(16, 154, 218, 0.6)',
      scaleFontColor: "#FFFFFF",
      borderColor: "rgba(16, 154, 218, 0.85)"
    }
  ]
  // Set pie chart settings
  public pieChartLabels:string[] = ['Used Space (MB)', 'Free Space (MB)'];
  public pieChartData:number[] = [];
  public pieChartType:string = 'pie';
 
  // Placeholder for future events that could implemented for the charts
  public chartClicked(e:any):void {}
  public chartHovered(e:any):void {}
  public onChartClick(e:any):void {}
  // The different x-axis points for the graphs
  chartLabelsUploads = [];
  chartLabelsReqs = [];
// -----------------------------------------------------------------------------------------
  
  // Constructor for the page
  constructor(private db: DBService){
    Chart.defaults.global.defaultFontColor = "#fff";
  }
  // Called when page is first loaded.
  // Import all the system data from the database to display in the graphs/charts
  async ngOnInit(){
    var res = await this.db.getSystemStats();
    this.stats = res;
    res = await this.db.getDiskSpaceUsed();
    this.diskStats = res.json();
    this.displayDiskStats(); // Update the disk chart
    res = await this.db.getProcessingPhotos();
    this.processingPhotos = res.json();
    res = await this.db.getProcessingVideos();
    this.processingVideos = res.json();
    res = await this.db.getPastDayUploads();
    this.pastDayUploadCount = res.json();
    res = await this.db.getPastWeekUploads();
    this.pastWeekUploadCount = res.json();
    res = await this.db.getPastMonthUploads();
    this.pastMonthUploadCount = res.json();
    res = await this.db.getPastDayReqs();
    this.pastDayReqCount = res.json();
    res = await this.db.getPastWeekReqs();
    this.pastWeekReqCount = res.json();
    res = await this.db.getPastMonthReqs();
    this.pastMonthReqCount = res.json();
    res = await this.db.getFlaggedPhotos();
    this.flaggedPhotos = res.json();
    res = await this.db.getFlaggedVideos();
    this.flaggedVideos = res.json();
    // Display charts for number of uploads and number of requests within the past month
    this.displayMonthUploads();
    this.displayMonthReqs();
    // Once all data has been loaded, we can display the charts
    this.dataReady = true;
  }
  // Puts received data from DB into the pie chart
  displayDiskStats() {
    this.pieChartData.push(this.diskStats.used/(1024*1024));
    this.pieChartData.push(this.diskStats.free/(1024*1024));
  }
  // Puts received data from DB about number of monthly uploads into the uploads chart
  displayMonthUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastMonthUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastMonthUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastMonthUploadCount[i].count);
    }
  }
  // Puts received data from DB about number of daily uploads into the uploads chart
  displayDayUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastDayUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastDayUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastDayUploadCount[i].count);
    }
  }
  // Puts received data from DB about number of weekly uploads into the uploads chart
  displayWeekUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastWeekUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastWeekUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastWeekUploadCount[i].count);
    }
  }
  // Puts received data from DB about number of monthly requests into the requests chart
  displayMonthReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastMonthReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastMonthReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastMonthReqCount[i].count);
    }
  }
  // Puts received data from DB about number of daily requests into the requests chart
  displayDayReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastDayReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastDayReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastDayReqCount[i].count);
    }
  }
  // Puts received data from DB about number of weekly requests into the requests chart
  displayWeekReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastWeekReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastWeekReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastWeekReqCount[i].count);
    }
  }
}
