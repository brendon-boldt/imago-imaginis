/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
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

  chartOptions = {
    responsive: true,
    scaleFontColor: "#FFFFFF"
  };
  chartDataUploads = [
    { data: [], label: 'Uploads' },
  ];
  chartDataReqs = [
    { data: [], label: 'Requests' },
  ];
  chartColors = [
    {
      backgroundColor: 'rgba(16, 154, 218, 0.6)',
      scaleFontColor: "#FFFFFF",
      borderColor: "rgba(16, 154, 218, 0.85)"
    }
  ]

  public pieChartLabels:string[] = ['Used Space (MB)', 'Free Space (MB)'];
  public pieChartData:number[] = [];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }

  // chartLabels = ['January', 'February', 'Mars', 'April'];
  chartLabelsUploads = [];
  chartLabelsReqs = [];

  onChartClick(event) {
  }

  constructor(private db: DBService){
    Chart.defaults.global.defaultFontColor = "#fff";
  }
  async ngOnInit(){
    var res = await this.db.getSystemStats();
    this.stats = res;
    res = await this.db.getDiskSpaceUsed();
    this.diskStats = res.json();
    this.displayDiskStats();
    res = await this.db.getProcessingPhotos();
    this.processingPhotos = res.json();
    res = await this.db.getProcessingVideos();
    this.processingVideos = res.json();
    res = await this.db.getPastDayUploads();
    this.pastDayUploadCount = res.json();
    console.log(this.pastDayUploadCount)
    res = await this.db.getPastWeekUploads();
    this.pastWeekUploadCount = res.json();
    console.log(this.pastWeekUploadCount);
    res = await this.db.getPastMonthUploads();
    this.pastMonthUploadCount = res.json();
    console.log(this.pastMonthUploadCount)
    res = await this.db.getPastDayReqs();
    this.pastDayReqCount = res.json();
    console.log(this.pastDayReqCount)
    res = await this.db.getPastWeekReqs();
    this.pastWeekReqCount = res.json();
    console.log(this.pastWeekReqCount);
    res = await this.db.getPastMonthReqs();
    this.pastMonthReqCount = res.json();
    console.log(this.pastMonthReqCount)
    this.displayMonthUploads();
    this.displayMonthReqs();
    // Load tables with data
    this.dataReady = true;
  }
  displayDiskStats() {
    this.pieChartData.push(this.diskStats.used/(1024*1024));
    this.pieChartData.push(this.diskStats.free/(1024*1024));
  }
  displayMonthUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastMonthUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastMonthUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastMonthUploadCount[i].count);
    }
  }
  displayDayUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastDayUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastDayUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastDayUploadCount[i].count);
    }
  }
  displayWeekUploads() {
    this.chartLabelsUploads = [];
    this.chartDataUploads[0].data = [];
    for(var i=0; i<this.pastWeekUploadCount.length; i++){
      this.chartLabelsUploads.push(this.pastWeekUploadCount[i].timestamp);
      this.chartDataUploads[0].data.push(this.pastWeekUploadCount[i].count);
    }
  }
  displayMonthReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastMonthReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastMonthReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastMonthReqCount[i].count);
    }
  }
  displayDayReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastDayReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastDayReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastDayReqCount[i].count);
    }
  }
  displayWeekReqs() {
    this.chartLabelsReqs = [];
    this.chartDataReqs[0].data = [];
    for(var i=0; i<this.pastWeekReqCount.length; i++){
      this.chartLabelsReqs.push(this.pastWeekReqCount[i].timestamp);
      this.chartDataReqs[0].data.push(this.pastWeekReqCount[i].count);
    }
  }
}
