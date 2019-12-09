// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:3001/api',
  socket_url: 'http://localhost:3001',
  // socket_url: 'http://192.168.0.12:3001',  // TO USE DEVAPP
  // api_url: 'http://192.168.0.12:3001/api', // TO USE DEVAPP
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
