/**
 * @desc PHP code to put within the functions.php file to create the WPsettings {object}
 */
<?php
if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
  wp_localize_script('RunService', 'WPsettings', array(
    'root' => esc_url_raw( rest_url() ),
    'nonce' => wp_create_nonce( 'wp_rest' ),
    'current_ID' => get_the_ID(),
    'session_token' => wp_get_session_token(),
    'user_ID' => get_current_user_id()
  ));
};
?>

/**
 * @desc sample jQuery AJAX call for use with the Wordpress REST API
 */
$.ajax({
  url: WPsettings.root + 'wp/v2/posts',
  method: 'POST',
  data: //something to send here
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-WP-Nonce': WPsettings.nonce);
    },
  success: function(data) {
    console.log(data);
  },
});

/**
 * @desc request object for the Wordpress REST API $http call
 */
let postReqObj = {
  this.method = 'POST';
  this.url = WPsettings.root + 'wp/v2/posts';
  this.headers = {
    'X-WP-Nonce': WPsettings.nonce
  };
  this.data = user;
}

/**
 * @desc sample $http request for Wordpress REST API
 */
$http(postReqObj).then(response => {
  //do stuff
});
