import axios from 'axios';

const api = "https://movieapi-production-2474.up.railway.app";
const api2 = "http://192.168.1.100:5041";

async function authloginAccount(username, password) {
  try {
    const response = await axios.post(`${api}/api/account/login`, {
        "username": username,
        "password": password,
      }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to login: ' + errorMessage);
    throw new Error('Failed to login: ' + errorMessage);
  }
}

async function authCreateUser(username, email, password) {
  try {
    const response = await axios.post(`${api}/api/account/register`, {
        "username": username,
        "email": email,
        "password": password,
      }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    return token;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to create user: ' + errorMessage);
    throw new Error('Failed to create user: ' + errorMessage);
  }
}

async function getProfile(username, token) {
  try {
      const response = await axios.get(`${api}/api/account/user/${username}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      alert('Failed to fetch user profile: ' + errorMessage);
      throw new Error('Failed to fetch user profile: ' + errorMessage);
  }
}

async function updateProfileWithImage(username, token, profileData) {
  try {
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('FirstName', profileData.firstName || '');
    formData.append('LastName', profileData.lastName || '');
    formData.append('Country', profileData.country || '');

    const response = await axios.post(
      `${api}/api/account/update-user-profile`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    alert('Failed to update user profile with image: ' + errorMessage);
    throw new Error('Failed to update user profile with image: ' + errorMessage);
  }
}

async function postPortfolio(name, token) {
  try {
    const response = await axios.post(
      `${api}/api/portfolio`,
      `"${name}"`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to post portfolio: ' + errorMessage);
    throw new Error('Failed to post portfolio: ' + errorMessage);
  }
}

async function deletePortfolio(name, token) {
  try {
    const response = await axios.delete(
      `${api}/api/portfolio?name=${name}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to delete portfolio: ' + errorMessage);
    throw new Error('Failed to delete portfolio: ' + errorMessage);
  }
}
async function sendMessageToUs(firstName, lastName, message) {
  try {
    const response = await axios.post(
      `${api}/api/account/report-and-contact`,{
        firstName: firstName,
        lastName: lastName,
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to send report: ' + errorMessage);
    throw new Error('Failed to send report: ' + errorMessage);
  }
}
async function changeUserPassword(token,currentPassword, newPassword, username) {
  try {
    const response = await axios.post(
      `${api}/api/account/change-password`,{
        currentPassword: currentPassword,
        newPassword: newPassword,
        username: username
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to change password: ' + errorMessage);
    throw new Error('Failed to change password: ' + errorMessage);
  }
}
async function enable2FA(username) {
  try {
    const response = await axios.post(
      `${api}/api/account/enable-two-factor?username=${username}`,
      {
        headers: {
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to enable 2FA: ' + errorMessage);
    throw new Error('Failed to enable 2FA: ' + errorMessage);
  }
}
async function disable2FA(username) {
  try {
    const response = await axios.post(
      `${api}/api/account/disable-two-factor?username=${username}`,
      {
        headers: {
          'Accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to disable 2FA: ' + errorMessage);
    throw new Error('Failed to disable 2FA: ' + errorMessage);
  }
}

async function verifyUser2FA(username,verificationCode) {
  try {
    const response = await axios.post(
      `${api}/api/account/verify-two-factor`,{
        username: username,
        code: verificationCode,
      },
      {
        headers: {
          'Accept': '*/*',
        },
      }
    );
    return response.data.token;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.errors : error.message;
    alert('Failed to disable 2FA: ' + errorMessage);
    throw new Error('Failed to disable 2FA: ' + errorMessage);
  }
}





export function verify2FA(username,verificationCode){
  return verifyUser2FA(username,verificationCode)
}

export function disableTwoFactor(username){
  return disable2FA(username)
}

export function enableTwoFactor(username){
  return enable2FA(username)
}
export function changePassword(token,currentPassword,newPassword,username){
  return changeUserPassword(token,currentPassword,newPassword,username)
}
export function sendContactMessage(firstName,lastName,message){
  return sendMessageToUs(firstName,lastName,message)
}
export function deleteUserPortfolio(name, token) {
  return deletePortfolio(name, token);
}

export function postUserPortfolio(name, token) {
  return postPortfolio(name, token);
}

export function getUserProfile(username, token) {
  return getProfile(username, token);
}

export function saveUserProfile(username, token, profileData) {
  return updateProfileWithImage(username, token, profileData);
}

export function loginAccount(username, password) {
  return authloginAccount(username, password);
}

export async function createUser(username, email, password) {
  return authCreateUser(username, email, password);
}
