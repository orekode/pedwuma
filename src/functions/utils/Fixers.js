
import { Timestamp } from 'firebase/firestore'; // Import the Timestamp class from Firebase
import CryptoJS from 'crypto-js';

export const paddNumber = (number) => {
    if(!number) return '0000';
    
    let numberSize = number.toString().length;
    let numOfZeros = numberSize > 4 ? 0 : 4 - numberSize;

    return '0000'.slice(0, numOfZeros) + number.toString();
}

export const getPast7Days = () => {
    const dayNames = [];
    const dayTimestamps = [];
  
    // Get the current date
    const today = new Date();
  
    for (let i = 6; i >= 0; i--) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i); // Subtract 'i' days to go back in time
  
      // Calculate the beginning of the day
      const startOfDay = new Date(currentDay);
      startOfDay.setHours(0, 0, 0, 0);
  
      // Calculate the end of the day
      const endOfDay = new Date(currentDay);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Format the current day's name
      const dayName = currentDay.toLocaleDateString(undefined, { weekday: 'long' });
  
      // Push the day name and timestamps to their respective arrays
      dayNames.push(dayName);
      dayTimestamps.push([startOfDay, endOfDay]);
    }
  
    return [dayNames, dayTimestamps];
}
  
export const getHumanReadableDateDifference = (timestamp1, timestamp2) => {
    const oneMinuteInMilliseconds = 60 * 1000;
    const oneHourInMilliseconds = 60 * oneMinuteInMilliseconds;
    const oneDayInMilliseconds = 24 * oneHourInMilliseconds;
    const oneWeekInMilliseconds = 7 * oneDayInMilliseconds;
    const oneMonthInMilliseconds = 30.44 * oneDayInMilliseconds; // Average month length
  
    // Convert Firebase Timestamp objects to JavaScript Date objects
    const date1 = timestamp1?.toDate();
    const date2 = timestamp2?.toDate();
  
    // Calculate the time difference in milliseconds
    const timeDifference = date1 - date2;
    const absoluteTimeDifference = Math.abs(timeDifference);
  
    // Calculate the differences in various units
    const monthsDifference = Math.floor(absoluteTimeDifference / oneMonthInMilliseconds);
    const remainingTimeInMilliseconds = absoluteTimeDifference % oneMonthInMilliseconds;
    const daysDifference = Math.floor(remainingTimeInMilliseconds / oneDayInMilliseconds);
    const remainingTimeInMilliseconds2 = remainingTimeInMilliseconds % oneDayInMilliseconds;
    const hoursDifference = Math.floor(remainingTimeInMilliseconds2 / oneHourInMilliseconds);
    const remainingTimeInMilliseconds3 = remainingTimeInMilliseconds2 % oneHourInMilliseconds;
    const minutesDifference = Math.floor(remainingTimeInMilliseconds3 / oneMinuteInMilliseconds);
  
    // Create a human-readable string
    let result = '';
    if (monthsDifference > 0) {
      result += `${monthsDifference} month${monthsDifference > 1 ? 's' : ''}`;
    }
    if (daysDifference > 0) {
      if (result) result += ' and ';
      result += `${daysDifference} day${daysDifference > 1 ? 's' : ''}`;
    }
    if (hoursDifference > 0) {
      if (result) result += ' and ';
      result += `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''}`;
    }
    if (minutesDifference > 0) {
      if (result) result += ' and ';
      result += `${minutesDifference} min${minutesDifference > 1 ? 's' : ''}`;
    }
  
    return result || '0 minutes';
  };
  



export const readableDate = (timestamp) => {
    if(!timestamp) return "";
    // Convert Firestore Timestamp to JavaScript Date
    const date = timestamp?.toDate();
  
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const dayOfMonth = date?.getDate();
    const month = months[date?.getMonth()];
    const dayOfWeek = daysOfWeek[date?.getDay()];
    const hours = date?.getHours();
    const minutes = date?.getMinutes();
    const amPm = hours >= 12 ? "pm" : "am";
  
    // Convert to 12-hour time format
    const formattedHours = hours % 12 || 12;
  
    return `${dayOfMonth}th ${month} ${dayOfWeek} ${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}${amPm}`;
}
  

export const extractNames = (fullName) => {
  // Split the full name into parts using whitespace
  const nameParts = fullName.trim().split(' ');

  let firstname = '';
  let lastname = '';

  // Determine the first name and last name based on the number of parts
  if (nameParts.length === 1) {
    // Only one part provided; consider it as the last name
    lastname = nameParts[0];
  } else if (nameParts.length >= 2) {
    // At least two parts provided; consider the first part as the first name
    firstname = nameParts[0];

    // Concatenate the remaining parts as the last name
    lastname = nameParts.slice(1).join(' ');
  }

  return { firstname, lastname };
}


export const safeGet = (obj, properties, alternateValue = false) => {

  if(typeof(properties) !== "object") properties = [properties];

  let result = properties.reduce((subObj, prop) => (subObj && subObj[prop]) ? subObj[prop] : false , obj);

  if(result == false) return alternateValue;

  return result;

}


export const checkInputsOnObj = (obj, properties) => {
  let check = true;

  if(typeof(properties) !== "object") properties = [properties];

  for(let i = 0; i < properties.length; i++) {
    let sub_check = safeGet(obj, properties[i]);

    if(typeof(sub_check) == "object" && Object.keys(sub_check).length <= 0) check = check && false;

    else if(sub_check == "" || sub_check == false) check = check && false;
  }

  return check;
}

export const checkValueInObj = (obj, properties, value) => {
  let check = false;

  if(typeof(properties) !== "object") properties = [properties];

  for(let i = 0; i < properties.length; i++) {
    let sub_check = safeGet(obj, properties[i]);

    if(sub_check == value) check = true;
  }

  return check;
}

export const checkObjInArray = (arr, properties, value) => {
  let check = false;

  for(let i = 0; i < arr.length; i++) {
    let obj = arr[i];

    check = checkValueInObj(obj, properties, value);

    if(check) return check;
  }

  return check;

}


export const isValidURL = (url) => {
  try {
    // Create a new URL object and check if it's a valid URL
    new URL(url);
    return true;

  } catch (error) {

    return false;
    
  }
}

const secretKey = '@mysecrete@key@200';

export function encrypt(token) {
    const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString().replaceAll('+','xNkt').replaceAll('/','p51Rd').replaceAll('=','Mfm6');
    return encryptedToken;
}

export function decrypt(encryptedToken) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken.replaceAll('xNkt', '+').replaceAll('p51Rd', '/').replaceAll('Mfm6', '='), secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
}