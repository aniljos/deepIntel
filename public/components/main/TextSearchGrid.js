import React from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiFieldSearch,
  EuiButton,
  EuiBasicTable,
  EuiLink,
  EuiHealth,
  EuiFlexGroup, EuiFlexItem, EuiSpacer,
  EuiInMemoryTable,
  EuiFieldNumber,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiComboBox,
  EuiToast,
  EuiHighlight,
  EuiSwitch,
  EuiDatePicker,
  EuiDatePickerRange,
  EuiCard,
  EuiIcon,
  EuiPanel

} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { uiModules } from 'ui/modules';
import { EuiFieldText } from '@elastic/eui';
import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services'
import moment from 'moment';

const fields = [
  {
    label: "message_id",
    title: "MessageID"
  },
  {
    label: "chat.username",
    title: "Channel"
  },
  {
    label: "chat.title",
    title: "Channel"
  },
  {
    label: "from_user.username",
    title: "From User"
  },
  {
    label: "media",
    title: "HasMedia"
  },
  {
    label: "document.file_name",
    title: "Document"
  },
  {
    label: "date",
    title: "Date"
  },
  {
    label: "text",
    title: "Message"
  }
]
const refreshMessage = "Click Search to update the results";
export class TextSearchGrid extends React.Component {

  state = {
    search: "",
    fields: [],
    data: [],
    size: "",
    noResultsMessage: "",
    refreshMessage: "",
    startDate: null,
    endDate: null
    //startDate: moment().subtract(1, '-d'),
    //endDate: moment()
  }


  constructor(props) {
    super(props);
    //this.baseUrl = "http://local"
  }

  async componentDidMount() {

    this.elasticBaseUrl = "http://localhost:9200/deep-intel-2/"

    // const resp = await this.props.httpClient.post('../api/deep_intel/fetch', {fileName: "Video.mp4"})
    // console.log("response", resp);

    // const resp1 = await this.props.httpClient.post('../api/deep_intel/fetchPhoto', {fileName: "Video.mp4"})
    // console.log("response1", resp1);
  }

  

  onSearchChange = (evt) => {
    this.setState({
      search: evt.target.value,
      refreshMessage: refreshMessage
    })
  }

  handleChangeStart = (date) => {

    this.setState({
      startDate: date
    })
  }
  handleChangeEnd = (date) => {
    this.setState({
      endDate: date
    })
  }
  handleClearDate = () => {
    this.setState({
      startDate: null,
      endDate: null
    })
  }

  onSearch = async () => {
    //alert(this.state.search);

    this.setState({
      itemIdToExpandedRowMap: {}
    }, async () => {



      const { httpClient } = this.props;
      const path = "_search"
      const requestData = {};
      requestData.query = {
        bool: {
          must: []
        }
      }
      let range = {
        range: {
          date: {
            gte: null,
            lte: null
          }
        }
      };
      let match = {
        match: {
          text: {
            query: "",
            fuzziness: "AUTO"
          }
        }
      };

      if (this.state.size) {
        requestData.size = parseInt(this.state.size);
      }

      if (this.state.startDate && this.state.endDate) {

        range.range.date.gte = this.state.startDate.format();
        range.range.date.lte = this.state.endDate.format();
        requestData.query.bool.must.push(range);
        
      }

      if (this.state.search) {

        match.match.text.query = this.state.search;
        requestData.query.bool.must.push(match);
       
      }
      

      console.log(requestData);
      const resp = await httpClient.post(this.elasticBaseUrl + path, requestData);

      const data = resp.data.hits.hits.map((item, index) => { return { id: index, ...item._source } });
      console.log(data);
      this.setState({
        data,
        noResultsMessage: data.length === 0 ? "No Records Found" : "",
        refreshMessage: ""
      });

    })
  }

  

  
  


  renderData = () => {

    return this.state.data.map((item, index) => {
      return (
        <EuiFlexItem key={item.id}>
          <EuiCard
            layout="horizontal"
            icon={<EuiIcon size="l" type={'email'} />}
            title={item.chat && item.chat.title? item.chat.title : 'Message'}
            description={<div><p>{'Date: ' + moment(item.date).format( 'DD-MM-YYYY HH:mm:ss')}</p> <p>User Name: {item.chat && item.chat.username ? item.chat.username: ""}</p> </div>}
            children={<EuiPanel hasShadow={true} ><EuiHighlight search={this.state.search} highlightAll={true}>{item.text}</EuiHighlight></EuiPanel>}
            onClick={() => window.alert('Card clicked')}
            
          />
        </EuiFlexItem>
      )
    })


  }


  render() {
    const { title } = this.props;
    const { search } = this.state;
    const { onSearchChange, onSearch } = this;
    

    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="m">
              <h1>
                <FormattedMessage
                  id="deepIntel.helloWorldText"
                  defaultMessage="Deep Intel Search"
                  values={{ title }}
                />
              </h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>

              <EuiFlexGroup direction="column">
                <EuiFlexItem style={{ width: '250px' }}>
                  <EuiFieldNumber placeholder="Record Size(Default is 10)"
                    value={this.state.size} onChange={evt => this.setState({ size: evt.target.value, refreshMessage: refreshMessage })} />
                </EuiFlexItem>

                <EuiFlexItem >
                  <EuiFlexGroup direction="row">
                    <EuiFlexItem grow={7}>
                      <EuiDatePickerRange
                        fullWidth={true}
                        startDateControl={
                          <EuiDatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChangeStart}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            isInvalid={this.state.startDate > this.state.endDate}
                            aria-label="Start date"
                            showTimeSelect
                            placeholder="Start Date"

                          />
                        }
                        endDateControl={
                          <EuiDatePicker
                            selected={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            isInvalid={this.state.startDate > this.state.endDate}
                            aria-label="End date"
                            showTimeSelect
                            placeholder="End Date"
                          />
                        }
                      />
                    </EuiFlexItem>

                    <EuiFlexItem>
                      <EuiButton onClick={this.handleClearDate} size="l"
                        disabled={!this.state.startDate || !this.state.endDate}>Clear</EuiButton>
                    </EuiFlexItem>
                  </EuiFlexGroup>

                </EuiFlexItem>


                <EuiFlexItem>
                    <EuiFieldSearch placeholder="Search for Text" compressed={true} value={search} fullWidth={true} onChange={onSearchChange} />
                  </EuiFlexItem>

                <EuiFlexItem style={{ width: '200px' }}>
                  <EuiButton fill onClick={onSearch} size="s" >Search</EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>




            </EuiPageContentHeader>
            <EuiPageContentBody>

              {this.state.data.length > 0 ?
                <EuiFlexGroup direction="column">
                  <EuiFlexItem>
                    <EuiTitle size="l">
                      <h1>Results</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                  {this.state.refreshMessage !== "" ? <EuiFlexItem>
                    <EuiToast
                      title={this.state.refreshMessage}
                      color="warning"
                      iconType="alert"
                    />
                  </EuiFlexItem> : null}
                  <EuiFlexItem>
                    <EuiTitle size="m">
                      <h1> Hits : {this.state.data.length}</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                  <EuiFlexItem grow={9}>

                    <EuiFlexGroup columns={3} direction="column" justifyContent="flexStart"  >
                      {this.renderData()}
                    </EuiFlexGroup>

                  </EuiFlexItem>
                </EuiFlexGroup> : <EuiTitle size="s">
                  <h2>
                    {this.state.noResultsMessage}
                  </h2>
                </EuiTitle>}

            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
