// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndPoint: 'https://ds1axq05pz0cy.cloudfront.net',
  awsRegion: 'ap-northeast-2',
  cognitoIdentityPoolId: 'ap-northeast-2:1faeac65-d7a0-4d20-b774-81700395f7d4',
  vodS3Bucket: 'matube-assets',
  cognitoLoginEndPoint: 'cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_iTILdUcZk'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
