 // Get the value of a specific cookie
 const cookieName = 'username';

 // Split the cookie string into individual cookies
 const cookies = document.cookie.split(';');

 // Loop through the cookies to find the one with the specified name
 let username = null;
 for (let i = 0; i < cookies.length; i++) {
     const cookie = cookies[i].trim();

     // Check if the cookie starts with the desired name
     if (cookie.startsWith(cookieName + '=')) {
         // Extract and store the cookie value
         username = cookie.substring(cookieName.length + 1);
         break;
     }
 }

 // Use the cookie value as needed
 console.log(username);