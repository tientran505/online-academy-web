import User from '../utils/models/user.model.js';

export default {
    findByIdAndUpdate(id, name, password, email) {
        return User.findByIdAndUpdate(id, {
            name, 
            password,
            email, 
        });
    },
};