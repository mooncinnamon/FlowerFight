export function authHeader() {
    // return authorization header with jwt token

    // const token = JSON.parse(localStorage.getItem('accessToken'));
    const token = JSON.parse(sessionStorage.getItem('accessToken'));
    if (token && token.accessToken) {
        return { 'Authorization': 'Bearer ' + token.accessToken };
    } else {
        return {};
    }
}