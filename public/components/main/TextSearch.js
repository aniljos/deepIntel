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
  EuiSwitch
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { uiModules } from 'ui/modules';
import { EuiFieldText } from '@elastic/eui';
import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services'


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
export class TextSearch extends React.Component {

  state = {
    search: "",
    fields: [],
    data: [],
    size: "",
    noResultsMessage: "",
    itemIdToExpandedRowMap: {},
    selectedFields: [fields[0], fields[1]],
    refreshMessage: "",
    displayAsExpandable: false
  }


  constructor(props) {
    super(props);
    this.baseUrl = "http://local"
  }

  componentDidMount() {

    this.elasticBaseUrl = "http://localhost:9200/deep-intel/"

    // const path = "_mapping";

    // const url = this.elasticBaseUrl + path;

    // const { httpClient } = this.props;
    // httpClient.get(url).then(resp => {
    //   console.log(resp.data);

    //   const properties = resp.data["deep-intel"].mappings.properties;
    //   console.log(properties);
    //   const fields = [];
    //   let id = 1;
    //   for (const prop in properties) {
    //     //console.log(prop);
    //     fields.push({ id: id, name: prop });
    //     id++;
    //   }
    //   this.setState({
    //     fields
    //   });

    // });
  }

  onFieldSelected = (selectedOptions) => {
    this.setState({
      selectedFields: selectedOptions,
      refreshMessage: refreshMessage
    });
  }

  onSearchChange = (evt) => {
    this.setState({
      search: evt.target.value,
      refreshMessage: refreshMessage
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
      if (this.state.size) {
        requestData.size = parseInt(this.state.size);
      }
      if (this.state.search) {
        requestData.query = {
          match: {
            text: {
              query: this.state.search,
              fuzziness: "AUTO"
            }
          }
        }
      }
      if (this.state.selectedFields.length > 0) {
        requestData["_source"] = this.state.selectedFields.map(item => item.label);
      }


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

  toggleDetails = item => {


    const itemIdToExpandedRowMapValues = { ...this.state.itemIdToExpandedRowMap };
    console.log(itemIdToExpandedRowMapValues);
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {


      const { text } = item;

      const listItems = [
        {
          title: 'Message',
          description: text ? text : "No Message",
        }
      ];
      //console.log(listItems);
      itemIdToExpandedRowMapValues[item.id] = (
        <div>
          <EuiTitle size="m">
            <h2>Message</h2>
          </EuiTitle>
          <EuiSpacer size="m" />
          <EuiHighlight search={this.state.search} highlightAll={true}>
            {text ? text : "No Message"}
          </EuiHighlight>
        </div>
      );
    }
    //setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    this.setState({
      itemIdToExpandedRowMap: itemIdToExpandedRowMapValues
    }, () => {
      console.log("State: ", this.state.itemIdToExpandedRowMap)
    });
  };

  defineDataColumns = () => {

    const columns = [];
    const selectedFields = this.state.selectedFields.map(item => item);
    console.log(selectedFields);
    // selectedFields.forEach(item => {


    // });

    for (const item of selectedFields) {
      if (item.label === "text") {
        if (!this.state.displayAsExpandable) {
          columns.push({
            field: item.label,
            name: item.title,
            sortable: false,
            render: text => (
              <EuiHighlight search={this.state.search} highlightAll={true}>
                {text}
              </EuiHighlight>
            )
          });
        }
      }
      else {

        if (item.label === "media") {
          columns.push({
            field: item.label,
            name: item.title,
            dataType: 'boolean',
            sortable: true,
            render: hasMedia => {
              const color = hasMedia ? 'success' : 'danger';
              const label = hasMedia ? 'YES' : 'NO';
              return <EuiHealth color={color}>{label}</EuiHealth>;
            },
          });
        }
        else {
          columns.push({
            field: item.label,
            name: item.title,
            sortable: true
          });
        }

      }
    }

    if (this.state.displayAsExpandable && selectedFields.findIndex(item => item.label === "text") != -1) {
      columns.push({
        align: RIGHT_ALIGNMENT,
        width: '40px',
        isExpander: true,
        render: item => (
          <EuiButtonIcon
            onClick={() => this.toggleDetails(item)}
            aria-label={this.state.itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
            iconType={this.state.itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
          />
        )
      })
    }
    return columns;

  }

  checkIfTextIsSelected = () => {
    const index = this.state.selectedFields.findIndex(item => item.label === "text");
    //console.log("checkIfTextIsSelected", index);
    return index !== -1
  }

  // doSearch = (data) => {
  //   console.log(data.queryText);
  //   if (data.queryText) {


  //     const data = [...this.state.data];
  //     const results = data.filter(item => {

  //       return item["message_id"] == data.queryText

  //     });
  //     this.setState({
  //       data: results
  //     });
  //   }
  //   return true;
  // }

  render() {
    const { title } = this.props;
    const { search } = this.state;
    const { onSearchChange, onSearch } = this;



    const dataColumns = this.defineDataColumns();
    //console.log("dataColumns", dataColumns)

    const filters = [];

    if (this.state.selectedFields.findIndex(item => item.label === "media") !== -1) {
      filters.push({
        type: 'is',
        field: 'media',
        name: "HasMedia",
        negatedName: "NoMedia"
      })
    }

    if (this.state.selectedFields.findIndex(item => item.label === "text") !== -1) {
      filters.push({
        type: 'is',
        field: 'text',
        name: "HasText",
        negatedName: "NoText"
      })
    }

    const searchBox = {

      box: {
        incremental: false,
        schema: true,
      },
      filters: filters,
      //onChange: this.doSearch

    };

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
                <EuiFlexItem>
                  <EuiComboBox placeholder="Select Fields(Default: all)" fullWidth={true}
                    options={fields} onChange={this.onFieldSelected} selectedOptions={this.state.selectedFields} />
                </EuiFlexItem>
                {this.checkIfTextIsSelected() ?
                  <EuiFlexItem>
                    <EuiFieldSearch placeholder="Search for Text" compressed={true} value={search} fullWidth={true} onChange={onSearchChange} />
                  </EuiFlexItem> : null}


                {this.checkIfTextIsSelected() ? <EuiFlexItem>
                  <EuiSwitch
                    label="Display Text as expandable"
                    checked={this.state.displayAsExpandable}
                    onChange={e => { this.setState({ displayAsExpandable: e.target.checked, refreshMessage: refreshMessage }) }}
                  />
                </EuiFlexItem> : null}


                <EuiFlexItem style={{ width: '200px' }}>
                  <EuiButton fill onClick={onSearch} size="s" disabled={this.state.selectedFields.length === 0}>Search</EuiButton>
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
                    <EuiInMemoryTable
                      items={this.state.data}
                      itemID="id"
                      columns={dataColumns}
                      isExpandable={true}
                      pagination={true}
                      sorting={true}
                      itemIdToExpandedRowMap={this.state.itemIdToExpandedRowMap}
                      search={searchBox}
                    />
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
