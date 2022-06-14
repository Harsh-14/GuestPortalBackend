<?php
 include_once 'encdec.php';
 $encdec = new encdec();
 $hotelcode = $encdec->decode($argv[1]);
 echo $hotelcode;
// PDFwMT5rJbR1hI9LR1nbyvMz1wBH
?>