import React, { Component } from 'react';
import { Link, HashRouter, Route, withRouter } from 'react-router-dom'
import { TextSearch } from './TextSearch';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiFlexItem } from '@elastic/eui';
import { EuiTitle, EuiNavDrawer, EuiNavDrawerGroup } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';
import { EuiListGroup } from '@elastic/eui';
import { EuiListGroupItem } from '@elastic/eui';
import Charts from './Charts';

const MainContent = withRouter((props) => {


    const handleSearch = () => {

        console.log(props);
        props.history.push("/");
    }
    const handleTest = () => {
        props.history.push("/tst");
    }
    const handleCharts= () => {
        props.history.push("/charts");
    }

    return (
        <EuiFlexGroup direction="row">
            <EuiFlexItem grow={1}>
                <EuiListGroup flush={true}>
                    <EuiListGroupItem
                        onClick={handleSearch}
                        label="Search"
                        iconType="search"
                        size="s"
                        color="ghost" />
                    <EuiListGroupItem
                        onClick={handleCharts}
                        label="Charts"
                        iconType="clock"
                        size="s"
                        color="primary" />
                    
                </EuiListGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={9}>
                <Route path="/" exact render={() => <TextSearch httpClient={props.httpClient}/>} />
                <Route path="/charts" exact render={() => <Charts httpClient={props.httpClient}/>} />
            </EuiFlexItem>
        </EuiFlexGroup>
    );

});


export class Main extends Component {



    render() {
        return (
            <div>

                {/* <NavDrawerDemo/> */}
                {/* <EuiNavDrawer showToolTips={true}>
                    <EuiNavDrawerGroup listItems={navLinks} />
                </EuiNavDrawer> */}


                <HashRouter>
                    <EuiFlexGroup direction="column" justifyContent="center">
                        <EuiFlexItem style={{ width: "900px" }}>
                            <EuiTitle size="l">
                                <h1>
                                    DeepIntel
                                </h1>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiSpacer />
                        <EuiFlexItem>
                            <MainContent {...this.props}/>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </HashRouter>
            </div>
        );
    }

}

