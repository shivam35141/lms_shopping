import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://18.217.131.129:3000/api/v1/'
: baseURL = 'http://localhost:3000/api/v1/'
}
// 192.168.0.179
//18.217.131.129
// 192.168.246.203
export default baseURL;
 