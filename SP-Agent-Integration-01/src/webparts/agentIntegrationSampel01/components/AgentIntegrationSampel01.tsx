import * as React from 'react';
import styles from './AgentIntegrationSampel01.module.scss';
import type { IAgentIntegrationSampel01Props } from './IAgentIntegrationSampel01Props';
import { escape } from '@microsoft/sp-lodash-subset';
import APIClientBased from './APIClientBased/APIClientBased';

export default class AgentIntegrationSampel01 extends React.Component<IAgentIntegrationSampel01Props> {
  public render(): React.ReactElement<IAgentIntegrationSampel01Props> {
    const {
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.agentIntegrationSampel01} ${hasTeamsContext ? styles.teams : ''}`}>
        <APIClientBased {...this.props} />
      </section>
    );
  }
}
