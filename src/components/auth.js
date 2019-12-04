export const getUserToken = () => {
    return(window.localStorage.getItem('crow_token'))
};
export const removeAuth = () => {
    window.localStorage.setItem('crow_token', '')
    window.localStorage.setItem('crow_userName', '')
    window.localStorage.setItem('crow_roles', '')
    return true
};
export const getAuth = () => {
    return(window.localStorage.getItem('crow_token'))
};
export const getUserName = () => {
    return(window.localStorage.getItem('crow_userName'))
};