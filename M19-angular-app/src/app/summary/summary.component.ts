// src\app\summary\summary.component.ts
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  barChartType: ChartType = 'line';

  barChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['2023', '2024', '2025'],
    datasets: [
      {
        label: 'Duolingo Courses',
        data: [95, 100, 243],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Duolingo's Language Course Expansion Over Time"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Courses' }
      },
      x: {
        title: { display: true, text: 'Year' }
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/chart1').subscribe(data => {
      this.barChartData.labels = data.labels;
      this.barChartData.datasets[0].data = data.values;
    });
  }

}
