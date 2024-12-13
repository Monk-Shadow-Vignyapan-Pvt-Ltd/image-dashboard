// ChartTry.jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                    name: 'Net Profit',
                    data: [44, 55, 57, 56, 61, 58, 63]
                }
            ],
            options: {
                chart: {
                    type: 'bar',
                    width: '100%',
                    height: '100%',
                    toolbar: {
                        show: false // Hide toolbar (zoom, pan, etc.)
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        borderRadius: 10, // This rounds the corners
                        borderRadiusApplication: 'end', // This will apply radius to the top/bottom
                        colors: {
                            ranges: [
                                {
                                    from: 0,
                                    to: 1000,
                                    color: '#ff787a' // Bar color
                                }
                            ]
                        },
                        endingShape: 'rounded',
                        startingShape: 'rounded',
                    }
                },
                dataLabels: {
                    enabled: false // Hide data labels
                },
                stroke: {
                    show: false // Hide the stroke (outlines of bars)
                },
                xaxis: {
                    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    labels: {
                        style: {
                            colors: '#333', // Adjust color of x-axis labels if needed
                            fontSize: '12px' // Adjust font size if needed
                        }
                    },
                    axisTicks: {
                        show: false // Hide x-axis ticks
                    },
                    axisBorder: {
                        show: false // Hide x-axis border line
                    }
                },
                yaxis: {
                    show: false // Completely hide the y-axis
                },
                fill: {
                    type: 'solid', // Change fill type to solid
                    opacity: 1 // Make bars fully opaque
                },
                grid: {
                    show: false // Hide grid lines
                },
                tooltip: {
                    enabled: false // Disable tooltip
                }
            }
        };
    }

    render() {
        return (
            <div id="chart" className="w-full h-full">
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    height="100%" // Full height
                />
            </div>
        );
    }
}

export default ApexBarChart;
