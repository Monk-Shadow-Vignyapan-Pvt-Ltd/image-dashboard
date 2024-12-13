import React from 'react';
import ReactApexChart from 'react-apexcharts';

class TreemapChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                    data: [
                        { x: 'India', y: 218 },
                        { x: 'Germany', y: 149 },
                        { x: 'United States', y: 184 },
                        { x: 'Saudi Arabia', y: 55 },
                        { x: 'Thailand', y: 84 },
                        { x: 'Australia', y: 31 },
                        { x: 'France', y: 70 },
                        { x: 'Pakistan', y: 30 },
                        { x: 'Canada', y: 44 },
                        { x: 'Japan', y: 68 },
                        { x: 'Indonesia', y: 28 },
                        { x: 'Georgia', y: 19 },
                        { x: 'Ireland', y: 29 }
                    ]
                }
            ],
            options: {
                chart: {
                    height: '100%',
                    type: 'treemap',
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
                colors: ['#F05F23'], // Base color for the treemap
                plotOptions: {
                    treemap: {
                        shadeIntensity: 0.5, // Adjust for lighter/darker shades
                    }
                }
            }
        };
    }

    render() {
        return (
            <div id="chart" className="w-full h-full" style={{ height: '300px' }}> {/* Set explicit height here */}
                <ReactApexChart
                    className="h-full w-full" // Ensure full width and height for chart
                    options={this.state.options}
                    series={this.state.series}
                    type="treemap"
                    height="100%" // Set to 100% to inherit from parent div
                />
            </div>
        );
    }
}

export default TreemapChart;
