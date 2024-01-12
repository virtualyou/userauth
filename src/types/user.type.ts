interface UserType {
    id: number;
    username: string;
    fullname: string;
    email: string;
    password: string;
    ownerId: number;
    agentOwnerId: number;
    agentActive: boolean;
    monitorOwnerId: number;
    monitorActive: boolean;
    agentMnemonic: string;
    monitorMnemonic: string;
    agentId: number;
    monitorId: number;
    mfa: number;
}

