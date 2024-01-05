import * as bcrypt from "bcryptjs";
import * as bip39 from "bip39";
import db from "../../models";
const User = db.user;

interface CreateRequest {
    username: string,
    fullname: string,
    email: string,
    password: string,
    ownerId: number,
    agentOwnerId: number,
    monitorOwnerId: number,
}

export async function createAgent(body: CreateRequest) {
    const user = await User.create({
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 8),
        ownerId: body.ownerId,
        agentOwnerId: body.agentOwnerId,
        monitorOwnerId: body.monitorOwnerId,
        agentActive: true,
        monitorActive: false,
        agentMnemonic: bip39.generateMnemonic(),
        monitorMnemonic: bip39.generateMnemonic(),
        agentId: 0,
        monitorId: 0,
        mfa: 0,
    });
    // user only one role (DEFAULT)
    user.setRoles([2]);
    return user;

}

export async function createMonitor(body: CreateRequest) {
    const user = await User.create({
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 8),
        ownerId: body.ownerId,
        agentOwnerId: body.agentOwnerId,
        monitorOwnerId: body.monitorOwnerId,
        agentActive: false,
        monitorActive: true,
        agentMnemonic: bip39.generateMnemonic(),
        monitorMnemonic: bip39.generateMnemonic(),
        agentId: 0,
        monitorId: 0,
        mfa: 0,
    });
    // user only one role (DEFAULT)
    user.setRoles([3]);
    return user;

}