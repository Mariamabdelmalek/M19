// src\app\reports\reports.component.ts
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
      plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // bar chart data
  public  barChartType: 'bar' = 'bar';
  public  barChartLegend = true;
  public  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: ' User Interface Language Support', 
        borderColor: '#42A5F5',
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC']

       }
    ]

  };


  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    const token = localStorage.getItem('token'); // or sessionStorage if you're using that

    this.http.get<any>('/api/chart2', {
       headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(data => {
      // Update chart data dynamically
      this.barChartData.labels = data.labels;
      this.barChartData.datasets[0].data = data.values;
      this.chart?.update(); // Update the chart

    });
  }

}

