

'users collection has no plan field';

'There is no user_plan collection';

'every user has a profile document with address information';

let k = {

    "Address Information" : {
        "House Number" : "",
        "Region": "",
        "Street Name": "",
        "Town": ""
    },

}

'there is a services collection that seems to store general information for display on the application';
'it seems to me that this services collection corresponds to my job applications collections also'


//Reviews

'there is no booking profile id for booking profiles';
'there is a job id field, which means comments is based on jobs and users (user id)';

//Location
'there is a location table that stores the location of every user'
'used to implement location search feature'

//Jobs
'there is no address field but there is the map field address_information';
'there is no geohas field';
'change client id field to user id';
'add user pic field';
'job status is a boolean field'; //true active false not active
'there is no description';
'there is no title';
'upload timestamp turns to upload date and upload date is a string field dd-mm-yy';
'add an upload time field that is a string field storing the time of upload like 9:13';
'portfolio is an array of file paths'


//Chat Room
'I have added a last_message_timestamp and sender_id and reciever_id to make it easier to fetch recent messages';
'I have also added a message type field to help defferenciate between text and media messages';

//Categories
'add a category_id field'
'no description'
'no pic'
'services is an array of strings instead of an array of maps'


//Bookings
'add an address type'; //basic nani address fields
'add a house number';
'add a region field';

'requester id is now applier id';
'worker id is now reciever id';
'there is no upload time and date -- ask to ensure that we can know the exact date the booking was made';
'job id is the same as booking id';
'shedule date string dd-mm-yy';
'shedule time string 1:45 am';
'jobs applied id is concat(booking_profile_id, applier_id)';


//Booking profile


//home page
`
1. recreate search box based on locations in the application
`