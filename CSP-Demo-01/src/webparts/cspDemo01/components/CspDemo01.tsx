import * as React from 'react';
import styles from './CspDemo01.module.scss';
import type { ICspDemo01Props } from './ICspDemo01Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';

export default class CspDemo01 extends React.Component<ICspDemo01Props> {
  btnClick:any = null;

  constructor(props:ICspDemo01Props) {         
      super(props);      
      this.btnClick = React.createRef();
  }

  protected loadWitSPComponentLoader() {
    SPComponentLoader.loadScript('https://code.jquery.com/jquery-4.0.0.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {     
      (this as any).jQuery = jQuery;          
      jQuery(".btndemo")[0].onclick = function() {
        alert("demo");
        jQuery(this).css("background","yellow");            
      }    
    });
  }

  protected loadWitHeader() {    
    const scriptTag = document.createElement("script");
    scriptTag.src="https://code.jquery.com/jquery-4.0.0.min.js";
    scriptTag.crossOrigin="anonymous";
    scriptTag.integrity="sha256-OaVG6prZf4v69dPg6PhVattBXkcOWQB62pdZ3ORyrao=";
    document.head.appendChild(scriptTag);
  }

  protected inlineEvalCode()
  {
    const scriptBlock = "alert('Hello from eval all!')";
    eval(scriptBlock);
  }

  componentDidMount() {    
    (this.btnClick.current as any).onclick = function() { 
        this.innerHTML = 'Click event inline bound is still working.'; 
        alert("demo");
    };    
  }

  public render(): React.ReactElement<ICspDemo01Props> {
    
    this.loadWitSPComponentLoader();
    //this.loadWitHeader();

    this.inlineEvalCode();    
        
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (      
      <section className={`${styles.cspDemo01} ${hasTeamsContext ? styles.teams : ''}`}>
        <>
        <script>console.log("CSP violation :-)");</script>
        </>
        <button id="btnDemo" className='btndemo'>jQuery function with line handler</button>
        <button  ref={this.btnClick} >jQuery function with line handler</button>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }
}
