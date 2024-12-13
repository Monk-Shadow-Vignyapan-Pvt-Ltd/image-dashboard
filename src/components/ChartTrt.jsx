// ChartTry.jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                    name: 'series1',
                    data: [100, 90, 70, 100, 90, 109, 100]
                }
            ],
            options: {
                chart: {
                    type: 'area',
                    width: '100%',
                    height: '100%',
                    toolbar: {
                        show: false // Hide toolbar (zoom, pan, etc.)
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    colors: ['#FF2023']
                },
                xaxis: {
                    labels: {
                        show: false // Hide x-axis labels
                    },
                    axisBorder: {
                        show: false // Hide x-axis border
                    },
                    axisTicks: {
                        show: false // Hide x-axis ticks
                    },

                    type: 'datetime',
                    categories: [
                        '2018-09-19T00:00:00.000Z',
                        '2018-09-19T01:30:00.000Z',
                        '2018-09-19T02:30:00.000Z',
                        '2018-09-19T03:30:00.000Z',
                        '2018-09-19T04:30:00.000Z',
                        '2018-09-19T05:30:00.000Z',
                        '2018-09-19T06:30:00.000Z'
                    ]
                },
                fill: {
                    type: 'gradient', 
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3,
                        stops: [0, 90, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: '#FF2023', // Start color (your custom color)
                                opacity: 1
                            },
                            {
                                offset: 100,
                                color: '#fc9091', // End color
                                opacity: 0.3
                            }
                        ]
                    }
                },
                yaxis: {
                    labels: {
                        show: false // Hide y-axis labels
                    }
                },
                grid: {
                    show: false // Hide grid lines
                },
                tooltip: {
                    enabled: false // Hide tooltip
                }
                // tooltip: {
                //     x: {
                //         format: 'dd/MM/yy HH:mm'
                //     }
                // }
            }
        };
    }

    render() {
        return (
            <div id="chart" className="w-full h-full">
                <ReactApexChart
                    className="h-full"
                    options={this.state.options}
                    series={this.state.series}
                    type="area"
                    height="100%"
                />
            </div>
        );
    }
}

export default ApexChart;
