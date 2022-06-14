<?php
class encdec {
	var $skey 	= "#Zomma1Dillo2Turbo#\0\0\0\0\0";
	var $iv = 'TXmr56uI+09-I4-6'; //Pinal - 8 February 2020 - Purpose : PHP5.6 to 7.2 , Seperating guest portal and cc encode decode file.
	
    public  function encode_front($value){ 
 
	    if(!$value){return false;}
		
		$iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-256-CBC'));    
        $crypttext=openssl_encrypt($value,'AES-256-CBC',$this->skey,OPENSSL_RAW_DATA, $iv);
		return trim($this->safe_b64encode($crypttext."<1p1>".$iv));
    }
	
    public  function safe_b64encode($string) {
 
		$data = base64_encode($string);
		$data = str_replace(array('+','/','='),array('-','_',''),$data);
		return $data;
    }
 
	public function safe_b64decode($string) {
		$data = str_replace(array('-','_'),array('+','/'),$string);
		$mod4 = strlen($data) % 4;
		if ($mod4) {
		  $data .= substr('====', $mod4);
		}
		return base64_decode($data);
    }
 
	function openssl($action, $string)
	{
		$output = false;
		
		$encrypt_method = "AES-256-CBC";
		$secret_key = 'adsdfsdfsd15dsfsdbc';
		$secret_iv = 'cdgvsdgsdg4dsgsdgd';
	
		$key = hash('sha256', $secret_key);
		
		$iv = substr(hash('sha256', $secret_iv), 0, 16);
	
		if( $action == 'encrypt' ) {
			$output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
			$output = base64_encode($output);
			$output = strrev($output);
		}
		else if( $action == 'decrypt' ){
			$output = strrev($string);
			$output = base64_decode($output);
			$output = openssl_decrypt($output, $encrypt_method, $key, 0, $iv);
		}
		return $output; 
	}
	
	//Pinal - 30 November 2019 - START
	//Purpose : PHP5.6 to 7.2 
    public  function encode($value){ 
 
	    if(!$value){return false;}
        $crypttext=openssl_encrypt($value,'AES-256-CBC',$this->skey,OPENSSL_RAW_DATA, $this->iv);
		return trim($this->safe_b64encode("<1p1>".$crypttext));
    }
 
    public function decode($value){
 
		if(!$value){return false;}
		$crypttext = $this->safe_b64decode($value); 
		
		if (strpos($crypttext, '<1p1>') !== false) {
			$DE=str_replace("<1p1>","",$crypttext);
			$decrypttext=openssl_decrypt(($DE), 'AES-256-CBC', $this->skey, OPENSSL_RAW_DATA, $this->iv);
			
			return trim($decrypttext);
		}
		else
		{
			return $this->old_enc_decode($value);
		}
    }
	
	public function old_enc_decode($crypttext)
	{
		try
		{
			$log = new logger();
			$log->logIt("GUESTREQUEST_MYCRYPT");
			
			if (extension_loaded('mcrypt') && version_compare(PHP_VERSION, '5.3.0', '>=') && version_compare(PHP_VERSION, '7.0', '<')) {
				include_once(dirname(__FILE__).'/../../old_encdec_gr.php');			
				$objmcrypt_encdec=new mcrypt_encdec();
				return $objmcrypt_encdec->decode($crypttext);
			}
			else
			{
				$url="http://sb.ipms247.com/control/old_encdec_gr.php";
				
				$ch=curl_init();
				curl_setopt($ch, CURLOPT_URL, $url);
				curl_setopt($ch, CURLOPT_USERAGENT, "self/GR_app");
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);			
				curl_setopt($ch, CURLOPT_POST, true);
				$post = array(
					"crypttext" => $crypttext
				);
				curl_setopt($ch, CURLOPT_POSTFIELDS,/* http_build_query($post)*/ $post );
				
				$res='';
				$res=curl_exec($ch);
				$curlinfo = curl_getinfo($ch);
				
				$curl_errno = curl_errno($ch);
				$curl_error = curl_error($ch);
				if ($curl_errno > 0)
				{
					return $curl_errno." ==== ".$curl_error;
				}
				curl_close($ch);
				
				return $res;
			}
		}
		catch(Exception $e)
		{
			return $e;
		}
	}
	//Pinal - 26 December 2019 - END
}
?>
