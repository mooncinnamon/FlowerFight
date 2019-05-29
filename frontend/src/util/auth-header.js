export function authHeader() {
    // return authorization header with jwt token

    const token = JSON.parse(localStorage.getItem('accessToken'));
    console.log('call','authHeader', token);
    if (token && token.accessToken) {
        return { 'Authorization': 'Bearer ' + token.accessToken };
    } else {
        return {};
    }
}