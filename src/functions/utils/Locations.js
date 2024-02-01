
import axios from "axios";

            
            
export const ipInfo = async () => {
    try {
      let response = await axios.get('https://api.ipify.org?format=json&callback=?', {
          headers: {
              'Content-Type' : 'application/json'
          }
      });

      let data = await axios.get(`https://ipapi.co/${response.data.ip}/json/`);

      data = data.data;

      return { lat: data.latitude, lng: data.longitude, location: `${data.country_name}, ${data.region}`, ip: data.ip}

    } catch (error) {
      // Handle errors here, e.g., log them or return a default value
      console.error(error);
      return {
        lat: 0,
        lng: 0,
        location: ``,
        ip: "",
      };
    }
};


export const userRank = (data, lat=0, lng=0) => {

  if(typeof data == "undefined") data = [];

  let copyObj = [...data];


  for(let i = 0; i < copyObj.length; i++ ) {
    let item = copyObj[i];
    copyObj[i].distance = calculateDistance(item?.user?.location?.Latitude, item?.user?.location?.Longitude, lat, lng);
  }

  copyObj.sort((map1, map2) => map1.distance - map2.distance);

  return copyObj;
}

export const jobRank = (data, lat=0, lng=0) => {

  if(typeof data == "undefined") data = [];

  let copyObj = [...data];


  for(let i = 0; i < copyObj.length; i++ ) {
    let item = copyObj[i];
    copyObj[i].distance = calculateDistance(item?.Latitude, item?.Longitude, lat, lng);
  }

  copyObj.sort((map1, map2) => map1.distance - map2.distance);

  return copyObj;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Earth's radius in kilometers

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = (Math.PI * lat1) / 180;
  const lon1Rad = (Math.PI * lon1) / 180;
  const lat2Rad = (Math.PI * lat2) / 180;
  const lon2Rad = (Math.PI * lon2) / 180;

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance; // The distance in kilometers
}



