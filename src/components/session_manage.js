import { getUserToken } from './auth';

export default class SessionManager {
  static myInstance = null;
  userToken = '';

    constructor() {
    console.log('constructor called');
    this.userToken=getUserToken();
  }

  saveSessionUserToken() {
    getUserToken()
      .then(token => {
        this.userToken = token;
      })
      .catch(err => {
        this.userToken = '';
      });
  }
  static shared() {
    if (SessionManager.myInstance == null) {
        SessionManager.myInstance = new SessionManager();
    }

    return this.myInstance;
  }
  getAuthorizationHeader = () => {
    return {
      headers: {
        'Authorization': 'Bearer ' + this.userToken,
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
      }
    };
  };
}
