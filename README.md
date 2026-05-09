# Planify

Coordinate schedules with your group.

Made with Next.js, TypeScript, Bootstrap, and Firebase.

### How to use this program:

1. Download the code
2. Go into the planify/ directory and run "npm install" to download all of the dependencies of this project
3. Set up Firebase project (if you have not already)
    - Sign into Firebase's <a href="https://firebase.google.com/">website</a> and click on "Go to console"
    - Click "Create a new Firebase project" (you don't need to enable Gemini or Google Analytics)
    - Once your app is created, click "Add app" and select "Web" 
    - You will be prompted to set up Firebase hosting: you don't need to
    - You will then be given the Firebase SDK
4. In the planify/ directory, create an .env.local file, which is where you will store the environment variables from the Firebase SDK necessary to establish a connection to Firebase
    - Then, you want to add these fields to the file with your own information for your API key:
        ```
            NEXT_PUBLIC_FIREBASE_API_KEY="[your API key]"
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="[Firebase project name].firebaseapp.com"
            NEXT_PUBLIC_FIREBASE_PROJECT_ID="[your Firebase project name]"
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="[Firebase project name].firebasestorage.app"
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="[messaging sender id]"
            NEXT_PUBLIC_FIREBASE_APP_ID="[Firebase app ID]"
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="[Firebase measurement ID]"
        ```
    - These are all values that will be used in the lib/firebase.ts file to establish a connection to Firebase
    - <b>Note</b>: if you did not enable Google Analytics when creating the Firebase project, then you won't have a Measurement ID, which is fine
5. Next, click on "Search for products" and search for "Authentication".
    - Then, once you are on the Authentication menu, click on the "Service Providers" tab
    - There, click on Google, and then toggle "Enable" and then save it
    - While you're still on the Authentication page, click on "Settings" then scroll down to "Authorized Domains" and you want to click "Add domain" and add your localhost URL
6. Next, search for "Firestore" while you're still on the Firebase console
    - Click on "Create a database"
    - Select your edition (mine is Standard edition)
    - Select your location (mine is us-east4)
    - On the Configure step, select "Start in production mode"
    - Once the database is created, you should remain on the Firestore page and click on the "Rules" tab at the top
    - Then, copy and paste these rules in:
      ```
        rules_version = '2';

        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if request.auth != null;
            }
          }
        }
      ```
     - Then, click "Publish"
8. Now, you should be ready to run the app and log in! You do not need to create any of the collections or documents in the database manually. Firebase will handle it automatically.
