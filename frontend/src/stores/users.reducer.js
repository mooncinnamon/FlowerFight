import { userConstants } from '../constants';

export function token(state = {}, action) {

    switch (action.type) {
        case userConstants.GETALL_SUCCESS:
            return {
                items: action.token
            };
        case userConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}