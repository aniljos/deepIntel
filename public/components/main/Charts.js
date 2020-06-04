import React, { Component } from 'react';
import { Chart, Settings, BarSeries, Axis, DARK_THEME, LIGHT_THEME } from '@elastic/charts';
import { EuiTitle } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';

class KibChart extends Component {

    async componentDidMount(){

        // const resp = await this.props.httpClient.get("../api/deep_intel/example")
        // console.log("KibChart", resp);

        // const resp1 = await this.props.httpClient.post("../api/deep_intel/fetchMedia", {name: "abc.mp4"})
        // console.log("KibChart POST", resp1);
        // console.log(resp1);
    }

    render() {
        return (
            <div>
                <EuiTitle size="m">
                    <h1>Charts</h1>
                </EuiTitle>
                <EuiSpacer/>
                <Chart size={{ height: 300 }}>
                    <Settings
                        theme={LIGHT_THEME}
                        rotation={0}
                        showLegend={false}

                    />
                    <BarSeries
                        id="issues"
                        name="Issues"
                        data={[{ x: 0, y: 2 }, { x: 1, y: 9 }, { x: 2, y: 6 }, { x: 3, y: 1 }, { x: 4, y: 4 },]}
                        xAccessor="x"
                        yAccessors={['y']}


                    />
                    <Axis
                        id="bottom-axis"
                        position="bottom"
                        title="Bottom"
                    />
                    <Axis
                        id="left-axis"
                        // showGridLines
                        position="left"
                        title="The X value"

                    />

                </Chart>
            </div>
        );
    }

}

export default KibChart;