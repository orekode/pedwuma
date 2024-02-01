<?php

  header("access-control-allow-origin: *");
  header("access-control-allow-methods: GET, POST");
  header("access-control-allow-headers: content-type");
  header("content-type: application/json");

  $curl = curl_init();

  $reference = $_REQUEST['reference'];


  curl_setopt_array($curl, array(

    CURLOPT_URL => "https://api.paystack.co/transaction/verify/$reference",

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_ENCODING => "",

    CURLOPT_MAXREDIRS => 10,

    CURLOPT_TIMEOUT => 30,

    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,

    CURLOPT_CUSTOMREQUEST => "GET",

    CURLOPT_HTTPHEADER => array(

      "Authorization: Bearer sk_test_ee4258abd0e5f27ceee1f020d765e1d4b77bf31c",

      "Cache-Control: no-cache",

    ),

  ));

  

  $response = curl_exec($curl);

  $err = curl_error($curl);


  curl_close($curl);
  

  if ($err) {

    return [
      "status" => false
    ];

  } else {

    echo $response;

  }


?>