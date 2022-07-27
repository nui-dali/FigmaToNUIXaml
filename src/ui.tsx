import React from 'react';
import ReactDOM from 'react-dom';

import { Select, Button, SectionTitle, TextArea, Input, Text} from 'figma-styled-components';
import { UISelectOption as Option, UIState as State} from "./interfaces";
import { CONVENTIONS, ORIGINAL } from './constants';
import { compressExport } from "./ui/exporter";

import JSZip from 'jszip';

import './style.css';

declare function require(path: string): any

let xamlCode = "hello";

/*
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;

  if (msg.type === 'exportResults') {
    compressExport(msg.value, msg.filename)
      .then(() => {
        parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
      });
  }

  if (msg.type === 'xaml-code') {
      console.log('ui kth');
      console.log('ui xaml'+ msg.filename);
      xamlCode = 'good';
  }
}
*/

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: false,
      convention: ORIGINAL,
      xamlCode: 'xaml code will be here',
      fileName: ''
    }

    this.onSelect = this.onSelect.bind(this);
    this.onExport = this.onExport.bind(this);
    this.onFileNameChanged = this.onFileNameChanged.bind(this);
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  applyXamlCode = (value : string) => {
    this.setState({xamlCode : value});
  }

  handleMessage(event) {
    console.log('good!!!!!!!!!!');
    const msg = event.data.pluginMessage;
    if (!msg) return;
  
    if (msg.type === 'exportResults') {
      console.log('ui export !!!!');
      compressExport(msg.value, msg.filename)
        .then(() => {
          parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
        });
    }
  
    if (msg.type === 'xaml-code') {

        //const codeElement = document.getElementById('mytextarea');
        //codeElement.innerText = msg.filename;

        console.log('ui kth');
        //console.log('ui xaml'+ msg.filename);
        xamlCode = msg.filename;      
        this.applyXamlCode(xamlCode);
    }
  }

  onSelect(value: string) {
  }

  onTextChange(value : string) {
      console.log('kth text area is changed!');
      //console.log(xamlCode)
  }

  onExport() {
    //this.setState({ loading: true });
    //const pluginMessage = { type: 'export', value: this.state.convention };
    //parent.postMessage({ pluginMessage: pluginMessage }, '*');

    let generatedCode = `${this.state.xamlCode}`;
    let refinedCode = generatedCode.substring(1);

    let zip = new JSZip();
    zip.file('layout.xaml', refinedCode);
    zip.generateAsync({ type: 'blob' })
    .then((content) => {
      const blobURL = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.className = 'button button-primary';
      link.href = blobURL;
      link.download = `${this.state.fileName}.zip`
      link.click()
      link.setAttribute('download', `${this.state.fileName}.zip`);
    })
  }

  onToXaml() {
    const pluginMessage = { type: 'to-xaml' };
    parent.postMessage({ pluginMessage: pluginMessage }, '*');
  }

  onFileNameChanged(event : any) {
    //console.log(event.target.value);
    this.setState({fileName : event.target.value});
  }

  render() {
    const defaultOption: Option = { label: ORIGINAL, value: ORIGINAL };
    const options: Option[] = CONVENTIONS.map(conv => {
      return { label: conv, value: conv };
    });

    return (
      <>    
        <div id="loader" hidden={!this.state.loading}>
          <div className="loader"></div>
        </div>

        <div hidden={this.state.loading}>
          <SectionTitle id="title">Result</SectionTitle>
          <TextArea id="xamlCodeArea" value = {this.state.xamlCode} onChange={this.onTextChange}/>
          <Button id="export" fullWidth variant="secondary" onClick={this.onToXaml}>Convert to NUI Xaml</Button>
          <Text id="text"> File Name : </Text>
          <input id="input" onChange={this.onFileNameChanged}/>
          <Button id="export" variant="secondary" fullWidth onClick={this.onExport}>Export as NUI Xaml</Button>
        </div>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('plugin'));