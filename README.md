# PhotoAlbum-for-CodeClub
A simple photo album for Code Club.

## Prerequisites

* First, install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)).

      npm install -g polymer-cli

* Second, install [Bower](https://bower.io/) using [npm](https://www.npmjs.com)

        npm install -g bower


* Finally, install [Firebase CLI](https://github.com/firebase/firebase-tools) using [npm](https://www.npmjs.com)

        npm install -g firebase-tools


## Installing the bower components
The bower components are the third-party polymer elements required for the applications. To install run:

    bower install

## Linking with firebase
To allow authentication with Firebase you need to update **src/login.html**. Find the line
    config: {
        type: Object,
        value: {
            apiKey: "AIzaSyBzdWAPMDiLpChNHKAhVePegFFvC6Bbfgk",
            authDomain: "my-album-e93c4.firebaseapp.com",
            databaseURL: "https://my-album-e93c4.firebaseio.com",
            projectId: "my-album-e93c4",
            storageBucket: "my-album-e93c4.appspot.com",
            messagingSenderId: "676833000821"
        }
    },

And replace **apiKey**,**authDomain** etc. with the details obtained from your [Firebase console](https://console.firebase.google.com) for your application. These should look like:

    apiKey: "AIzaSyBzdWAPMDiLpChNHKAhVePegFFvC6Bbfgk",
    authDomain: "my-album-e93c4.firebaseapp.com",
    databaseURL: "https://my-album-e93c4.firebaseio.com",
    projectId: "my-album-e93c4",
    storageBucket: "my-album-e93c4.appspot.com",
    messagingSenderId: "676833000821"


In addition, update **.firebaserc** with your projectId.

{
  "projects": {
    "default": "my-album-e93c4"
  }
}


## Login options
Firebase provides a set of authentication providers. To access this change the following line in **src/login-fire.html** to reflect the options selected for your application in the firebase console.

                <login-fire id="auth" app-name="login" providers="google, facebook, twitter, github, anonymous" user="{{user}}" signed-in="{{signedIn}}"></login-fire>

If you don't want ''facebook'' remove ''facebook''. Repeat for the other providers.

## Testing the application
To run application simple run the following command.

    start.cmd

If all is well the application should open on the login screen in your default browser. To allow logging in, the URL **127.0.0.1** MUST be changed to **localhost** otherwise Firebase will reject the login as real.

## Publishing the application

To publish the application to Firebase run the command

    publish.cmd

This will request you to login into your Firebase account. If the publishing is successful you will be able to access your album from anywhere view your firebase URL.

Good Luck!

### Make the app your
It is important that you know how to customise the app and make it yours. This includes somme basic things like changing the title, text, logo and them.

1. **Changing the title**
The title is what appear in the title bar in your browser. 
In **index.html** look for "**Your website details**" and update as necessary to make it your own. This text occurs five times. The same should be done for "**application-name**" and "**description**".

2. **Changing the logo**
This is little more tricky as the logo appears in a few places for different reasons. The main logo on the title bar can be found in **src/my-app.html**

Find the line:

    <iron-icon class="logo" icon="my-icons:logo"></iron-icon>

The logo is "my-icons:logo". The actual logo is stored in **src/my-icons**. The format of this is SVG which is beyond the scope of what we are doing. A collection of good icons can be found on the web. I use [this](https://material.io/icons/) for finding some that I use.

If you do not want to use SVG you can use and image. Remember the image should be small so that it can load quickly. The best format to use is a png. Change the line to: 

    <iron-icon class="logo" src="src/logo.png"></iron-icon>

**logo.png** is the image to use. Ensure that this stored in the correct location otherwise it will not be found. This should be in the **src** folder.

The images in the **images/manifest** folder can also be updated. To get the correct sizes it is better to use a web tool (that I will add later).

**Changing the theme**
Polymer applications are easy theme. Themes can be created using this [tool](https://polymerthemes.com/custom-style/). Create a theme and follow the instructions [here](https://polymerthemes.com/help/).


## TODO - missing features
1. Securing the application so that only authorised users can login and see the photos.

2. ~~Uploading photos~~

3. ~~Creating new albums~~

4. ~~Editing descriptions~~

5. Messaging

6. Ranking photos 

7. ~~Logout button~~

8. ~~Resizing images on firebase~~

9. ~~Consuming resized images from firebase~~