// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:3001/api',
  api_general_url: 'http://localhost:3000/api',
  socket_url: 'http://localhost:3001',
  // socket_url: 'http://192.168.50.123:3001',  // TO USE DEVAPP
  // api_url: 'http://192.168.50.123:3001/api', // TO USE DEVAPP
  // api_general_url: 'http://f3da2a6852c5.ngrok.io/api', // TO USE APK IN DEBUG - URL CHANGES  3000
  // socket_url: 'http://35bcd1db930d.ngrok.io',  // TO USE APK IN DEBUG - URL CHANGES 3001
  // api_url: 'http://35bcd1db930d.ngrok.io/api', // TO USE APK IN DEBUG - URL CHANGES 3001
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
