# Wordpress REST API Tutorial - Authentication

## Getting Started
These tutorials work with Wordpress 4.7 or higher.

## Authentication With Wordpress
The more I dug into authentication with Wordpress, the more I appreciated just how Wordpress does things.  Wordpress core already has security set up, and they are constantly updating it to plug up any holes.  Once you tap into that security, you are set and ready to move on to creating and deleting posts.

This article from Tutsplus explains that there are three different ways authentication can be used in Wordpress:
https://code.tutsplus.com/tutorials/wp-rest-api-setting-up-and-using-basic-authentication--cms-24762
1. basic authentication
2. OAuth authentication
3. cookie authentication
The first two are alternate ways to use authentication with Wordpress.  I personally prefer using cookie authentication because it lets you use the cookies that Wordpress automatically generates when you log in.

## Setting Up Authentication
When a user logs in to Wordpress a cookie is created that has a bunch of information pertaining to the user, the current session, and what the user can and can't do.  Once this cookie has been generated, we can access this information to add functionality to our App.

On a recent project, I needed to get the user information after login.  I put this code in my functions.php file:

```
if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
  wp_localize_script('RunService', 'WPsettings', array(
    'root' => esc_url_raw( rest_url() ),
    'nonce' => wp_create_nonce( 'wp_rest' ),
    'current_ID' => get_the_ID(),
    'session_token' => wp_get_session_token(),
    'user_ID' => get_current_user_id()
  ));
};
```

What this does is create an object 'WPsettings' that has a root, nonce, current_ID, session_token, and user_ID if the user is logged in and has the ability to edit posts.

## Using Authentication Within Your Theme
Now that you have this fancy WPsettings object, now what can you use it for?  Let's start at the top and work our way down.

#### WPsettings.root
Whenever you call WPsettings.root in your javascript files, it creates a URL of the local Wordpress install and the url where the REST functionality is.  This is particularly handy when you need to write your routes.

##### A Sample Request using WPsettings.root
```
$http.get(WPsettings.root + 'wp/v2/posts')
```

#### WPsettings.nonce
The nonce is a "number used once", and Wordpress uses it for an added layer of security.  More information on the nonce can be found here:
https://codex.wordpress.org/WordPress_Nonces
What you need to know about the nonce is that you need to have it to put in the headers of your requests.

#### WPsettings.current_ID
Gets the ID of the request

#### WPsettings.session_token
This is the token that is generated in the cookie on login.

#### WPsettings.user_ID
This gets the ID of the logged in user.  This is necessary whenever you need to filter results with the user ID.

## Setting Request Headers
In order to add stuff to the Wordpress Database with the REST API you need to set the headers of your request.  Doing this with a jQuery AJAX request is pretty simple, so we'll start with that.

#### AJAX POST Request
Information for this request can be found here (note, the routes are for an earlier version of the API):
https://code.tutsplus.com/tutorials/wp-rest-api-creating-updating-and-deleting-data--cms-24883
```
$.ajax({
        url: WPsettings.root + 'wp/v2/posts',
        method: 'POST',
        data: //something to send here
        beforeSend: function ( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce': WPsettings.nonce );
        },
        success: function( data ) {
            console.log( data );
        },
    });
```

#### $http POST Request
I found $http requests to be a little trickier than just setting the request header, fortunately that can be fixed by creating a request object first:

```
let postReqObj = {
      this.method = 'POST';
      this.url = WPsettings.root + 'wp/v2/posts';
      this.headers = {
        'X-WP-Nonce': WPsettings.nonce
      };
      this.data = user;
    }
```

Once your object has been created, you can attach it to your $http request like so:

```
$http(postReqObj).then(response => {
  //do stuff
});
```

## Authentication with the REST API
This is only the beginning, but it's pretty cool once you get going with it.  In later posts I'll talk about the different things you can do with POST requests and how you can create custom META to create a full functioning SPA App with a Wordpress backend.
