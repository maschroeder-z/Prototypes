import * as React from 'react';
import { useEffect, useState } from 'react';
import { Components } from 'botframework-webchat';
import { ConnectionSettings, CopilotStudioClient, CopilotStudioWebChat, CopilotStudioWebChatConnection } from '@microsoft/agents-copilotstudio-client';
//import styles from './WebChatDemo.module.scss';
import type { IWebChatDemoProps } from './IWebChatDemoProps';
import { acquireToken } from '../../../common/UnifiedAuthManager';

const { BasicWebChat, Composer } = Components;

export interface IChatProps extends Pick<IWebChatDemoProps, 'appClientId' | 'tenantId' | 'environmentId' | 'agentIdentifier' | 'userEmail'> {
  directConnectUrl?: string;
  showTyping?: boolean;
  baseUrl?: string;
}

interface ChatMessageProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ children, type = 'info' }) => {
  const styles = {
    info: { padding: 16 },
    warning: { padding: 16, color: '#8a6d3b', backgroundColor: '#fcf8e3' },
    error: { padding: 16, color: '#a94442', backgroundColor: '#f2dede' }
  };

  return <div style={styles[type]}>{children}</div>;
};

interface WebChatRendererProps {
  connection: CopilotStudioWebChatConnection;
}

const WebChatRenderer: React.FC<WebChatRendererProps> = ({ connection }) => {
  return (
   <Composer directLine={connection}>
    <BasicWebChat></BasicWebChat>
   </Composer>
  );
}

const WebChatDemo: React.FC<IChatProps> = ({
  appClientId,
  tenantId,
  environmentId,
  agentIdentifier,
  directConnectUrl,
  userEmail,
  baseUrl,
  showTyping = true
}) => {
  const [connection, setConnection] = useState<CopilotStudioWebChatConnection | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const isConfigured = appClientId && tenantId && (directConnectUrl || (environmentId && agentIdentifier));

  let cancelled = false;

  useEffect(() => {
  const initializeWebChat = async (): Promise<void> => {
    try
    {
      // Step 1: Acquire authentication token
      const token = await acquireToken({
        appClientId,
        tenantId,
        currentUserLogin: userEmail,
        redirectUri: baseUrl || window.location.origin
      });

      if (!token) {
        throw new Error('Unable to acquire authentication token');
      }

      // Step 2: Create connection settings
      const settings = new ConnectionSettings({
        appClientId,
        tenantId,
        environmentId: environmentId || '',
        agentIdentifier: agentIdentifier || '',
        directConnectUrl: directConnectUrl || ''
      });    

      // Step 3: Initialize Copilot Studio client
      const client = new CopilotStudioClient(settings, token);

      // Step 4: Create WebChat connection with enhanced settings
      const webchatSettings = {
        showTyping: true,
        hideUploadButton: false,
        enableIncomingActivityMiddleware: true,
        typingAnimationDuration: 5000,
        typingIndicatorTimeout: 30000
      };

      const webchatConnection = CopilotStudioWebChat.createConnection(client, webchatSettings);

      if (!cancelled) {
        setConnection(webchatConnection);
        setIsLoading(false);
        console.log('WebChat: Initialization completed successfully');
      }

    } catch (err) {
      if (!cancelled) {
        console.error('WebChat initialization error:', err);

        // Better error handling for debugging
        let errorMessage = 'Failed to initialize WebChat';
        if (err instanceof Error) {
          errorMessage = err.message;
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
          });
        } else {
          console.error('Non-Error object thrown:', err);
          console.error('Error type:', typeof err);
          console.error('Error stringified:', JSON.stringify(err));
        }

        setError(errorMessage);
        setIsLoading(false);
      }
    }    
  };
  
  initializeWebChat().catch(console.error);

  return () => {
      cancelled = true;
  };

  },[isConfigured, appClientId, tenantId, environmentId, agentIdentifier, directConnectUrl, userEmail, baseUrl]);

  if (!isConfigured) {
    return (
      <ChatMessage type="warning">
        Configure appClientId, tenantId, and either directConnectUrl or (environmentId and agentIdentifier) in the manifest properties.
      </ChatMessage>
    );
  }

  if (error) {
    return <ChatMessage type="error">Error: {error}</ChatMessage>;
  }

  if (isLoading) {
    return <ChatMessage>Connecting to Copilot Studio...</ChatMessage>;
  }

  if (!connection) {
    return (
      <ChatMessage type="error">
        Failed to establish WebChat connection. Please check your configuration.
      </ChatMessage>
    );
  }
  return (<>
    <WebChatRenderer connection={connection} />
  </>);
}

export default WebChatDemo;