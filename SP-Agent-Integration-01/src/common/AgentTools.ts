import { ConnectionSettings } from "@microsoft/agents-copilotstudio-client";

export class AgentTools {
    public static getConnectionSettings(props: {
        environmentId: string;
        agentIdentifier: string;
        tenantId: string;
        appClientId: string;
    }): ConnectionSettings {
        return {
            environmentId: props.environmentId,
            agentIdentifier: props.agentIdentifier,
            tenantId: props.tenantId,
            appClientId: props.appClientId,
            authority: `https://login.microsoftonline.com/${props.tenantId}`
        };
    }
}

// https://67dbd73fb65ee35cb02f8e272b2c22.4e.environment.api.powerplatform.com/copilotstudio/dataverse-backed/authenticated/bots/feca74c2-64bf-468e-b814-54d54464ebd3/conversations?api-version=2022-03-01-preview
// https://67dbd73fb65ee35cb02f8e272b2c22.4e.environment.api.powerplatform.com/copilotstudio/dataverse-backed/authenticated/bots/crdea_demoAgent01/conversations?api-version=2022-03-01-preview