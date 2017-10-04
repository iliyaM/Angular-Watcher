// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
		apiKey: "AIzaSyA_SinPcDRNq4mC43SqE3-GrLs7DRT-MjA",
		authDomain: "angular-watcher.firebaseapp.com",
		databaseURL: "https://angular-watcher.firebaseio.com",
		projectId: "angular-watcher",
		storageBucket: "angular-watcher.appspot.com",
		messagingSenderId: "534159038208"
	}
};
