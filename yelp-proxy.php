<?php
	$API_KEY = "cIssRSK9ZYyfYT9XuUfuWnINvvwhPRzdrBKnYUqdjb2Lz9NZ4FEcFimx0bEA_WcWeRIGCFhkwaN0XVLiejvqE2rwBOmzRd2_sORm6BnTH2zSURwK5KHqiofzwtq3XHYx";
	$BASE_URL ="https://api.yelp.com/v3/businesses/search?";
	ini_set("memory_limit",-1);

	$term = $_REQUEST['term'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lng'];
	$rad = $_REQUEST['rad'];
	$cat = $_REQUEST['cat'];
        
  $url = $BASE_URL . "term=$term&latitude=$lat&longitude=$lon&radius=$rad&catagories=$cat";
      
  // set up our authorization headers to send the API key
	$headers = stream_context_create(array(
  'http' => array(
    'method' => 'GET',
    'header' => "Accept: application/json\r\n" . "Authorization: Bearer $API_KEY\r\n"
    )
	));
		
	$filedata = file_get_contents($url,false,$headers);
     	
  // send a content-type header for the response so that the client browser will understand what is coming back
	header("content-type: application/json");
			
	// echo the content from the downloaded file
  echo $filedata;
  
  exit();
?>