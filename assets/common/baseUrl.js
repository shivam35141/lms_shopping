import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.0.179:3000/api/v1/'
: baseURL = 'http://localhost:3000/api/v1/'
}
// 192.168.0.179
// 192.168.246.203
export default baseURL;
