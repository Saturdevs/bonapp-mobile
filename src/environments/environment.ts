// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api_url: 'http://localhost:3001/api',
  // api_general_url: 'http://localhost:3000/api',
  // socket_url: 'http://localhost:3001',
  
  api_general_url: 'https://bonapp-general.herokuapp.com/api', //HEROKU GENERAL
  socket_url: 'https://bonapp.herokuapp.com',  // HEROKU CUSTOMER
  api_url: 'https://bonapp.herokuapp.com/api', // HEROKU CUSTOMER
  
  // api_general_url: 'http://f4b03ff96525.ngrok.io/api', // TO USE APK IN DEBUG - URL CHANGES  3000
  // socket_url: 'http://41c83b4594c3.ngrok.io',  // TO USE APK IN DEBUG - URL CHANGES 3001
  // api_url: 'http://41c83b4594c3.ngrok.io/api', // TO USE APK IN DEBUG - URL CHANGES 3001
  avatar_url: 'https://ui-avatars.com/api/?name='     

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
