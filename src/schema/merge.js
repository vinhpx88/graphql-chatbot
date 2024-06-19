import Group from '../models/Group.js';
import User from '../models/User.js';

const groups = async groupIds => {
    try {
        const groups = await Group.find({ _id: { $in: groupIds } });
        return groups.map(group => {
            return transformEvent(group);
        });
    } catch(err) {
        throw err;
    }   
};

const user = async userId => {
    
    try {
        const userdb = await User.findById(userId);
        const createdGroups = await groups(userdb._doc.groups);
        return {
            ...userdb._doc,
            _id: userdb.id,
            groups: createdGroups
        }
    } catch(err){

    }
}

export function transformGroup(group) {
    return {
        ...group,
        user: user.bind(this, group.user)
    }
};