// ChartTry.jsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexRadialChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [65], // Set the value for the radial bar
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                    toolbar: {
                        show: false // Hide toolbar
                    }
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 225,
                        hollow: {
                            margin: 0,
                            size: '70%',
                            background: '#fff',
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 0,
                                blur: 4,
                                opacity: 0.24
                            }
                        },
                        track: {
                            background: '#fff',
                            strokeWidth: '67%',
                            margin: 0,
                            dropShadow: {
                                enabled: true,
                                top: -3,
                                left: 0,
                                blur: 4,
                                opacity: 0.35
                            }
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                offsetY: -10,
                                show: true,
                                color: '#AFADB4',
                                fontSize: '17px'
                            },
                            value: {
                                formatter: function(val) {
                                    return parseInt(val);
                                },
                                color: '#AFADB4',
                                fontSize: '36px',
                                show: true,
                            }
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark', // You can set this to 'light' if preferred
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#f05f23'], // Keep the red color for the end of the gradient
                        inverseColors: false,
                        opacityFrom: 1, // Fully opaque blue
                        opacityTo: 1, // Fully opaque red
                        stops: [0, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: '#f05f23',
                                opacity: 1
                            },
                            {
                                offset: 100,
                                color: '#f05f23',
                                opacity: 1
                            }
                        ]
                    }
                },
                stroke: {
                    lineCap: 'round' // Round the edges of the stroke
                },
                labels: ['Percent'],
            },
        };
    }

    render() {
        return (
            <div id="chart" className="w-full h-full">
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="radialBar"
                    height={350} // Fixed height for radial chart
                />
            </div>
        );
    }
}

export default ApexRadialChart;
