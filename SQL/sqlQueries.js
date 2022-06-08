exports.checkHotel = `SELECT databasename from saasconfig.syscompany where hotel_code=?`;

exports.checkPin = `SELECT fdtraninfo.tranunkid,fdtraninfo.statusunkid,fdrentalinfo.is_void_cancelled_noshow_unconfirmed AS isVoid,fdtraninfo.isgroupowner,fdtraninfo.allowselfguestportalaccess ,fdguesttran.guestunkid, fdtraninfo.supress_roomcharge from saas_ezee.fdtraninfo LEFT JOIN saas_ezee.fdrentalinfo ON fdtraninfo.tranunkid = fdrentalinfo.tranunkid AND fdrentalinfo.is_void_cancelled_noshow_unconfirmed=IF(fdtraninfo.statusunkid IN(5,6,7),1,0) AND ifnull(fdrentalinfo.ismodifiedfromOTA,0) <> 1 AND fdrentalinfo.statusunkid NOT IN (8,12) AND fdrentalinfo.hotel_code= ? LEFT JOIN saas_ezee.fdguesttran ON fdtraninfo.masterguesttranunkid = fdguesttran.guesttranunkid  AND fdguesttran.hotel_code= ? where IF(IFNULL(fdtraninfo.reservationno,'')='',TRIM(LEADING  FROM (TRIM(LEADING ? FROM fdtraninfo.tranunkid)))= ?,fdtraninfo.reservationno=?) AND 
fdtraninfo.doorcode=? AND fdtraninfo.hotel_code=? GROUP BY fdtraninfo.tranunkid `;

exports.checkLanguage = `SELECT cfuser.language,cfuser.userunkid from saas_ezee.cfuser where hotel_code=? AND username=? AND sysdefined=?`;

exports.selectHotel_stuff =`SELECT website,accountfor,logo FROM saas_ezee.cfhotel WHERE hotel_code=?`;

exports.check_currency= `SELECT ER.exchangerateunkid,ER.isprefix AS Prefix,ER.currency_sign As Currency,ER.currency_code As Code,digits_after_decimal,ER.currency_name As Currency_Name,ER.exchange_rate1 as exchange_rate1,ER.exchange_rate2 as exchange_rate2 FROM saas_ezee.cfexchangerate AS ER  WHERE ER.isactive = 1 AND ER.hotel_code=?`;


exports.userData =`SELECT IFNULL(CASE WHEN IFNULL(fdtraninfo.groupunkid, 0) = 0 THEN fdtraninfo. reservationno ELSE (CASE WHEN IFNULL(fdtraninfo.subreservationno, 0) = 0 THEN fdtraninfo.reservationno
ELSE CONCAT(fdtraninfo.reservationno, '-', fdtraninfo.subreservationno) END) END, '') AS reservationno,
TRIM(LEADING '0' FROM (TRIM(LEADING ? FROM fdtraninfo.tranunkid))) AS loginid, fdtraninfo.arrivaldatetime AS arrival, fdtraninfo.masterfoliounkid AS foliounkid, fdtraninfo.departuredatetime AS departure,
travelagentvoucherno, CONCAT(IFNULL(trcontact.salutation, ''), ' ', trcontact.name) AS name,
trcontact.email AS notiemail, fdtraninfo.doorcode AS notidoorcode, fdtraninfo.reservationno AS notiresno,
IFNULL((SELECT lookupunkid FROM saas_ezee.cfcommonlookup AS cfcommonlookup WHERE hotel_code = ?
AND lookuptype = 'SALUTATION' AND (cfcommonlookup.lookup = trcontact.salutation) LIMIT 1),
'') AS salutation,fdrentalinfo.adult,fdrentalinfo.child,cfroomtype.roomtype AS RoomType,
cfroom.name AS Roomno,fdtraninfo.statusunkid,fdtraninfo.isgroupowner,fdrentalinfo.ratetypeunkid,
DATEDIFF(fdtraninfo.departuredatetime,fdtraninfo.arrivaldatetime) AS noofdays,
CAST(fdtraninfo.arrivaldatetime AS DATE) AS arrivaldate,CAST(fdtraninfo.departuredatetime AS DATE) AS departuredate,fdrentalinfo.childage,fdtraninfo.ispaymentlinkamountset,fdtraninfo.googleshortlink,
fdtraninfo.lang_key,fdtraninfo.sourceunkid,IFNULL(fdtraninfo.groupunkid, 0) AS GroupId,IFNULL(trcontact.mobile, '') AS mobile,fdtraninfo.tranunkid,fdrentalinfo.rentalunkid,trcontact.custom3
FROM saas_ezee.fdtraninfo LEFT JOIN saas_ezee.fdrentalinfo ON fdrentalinfo.tranunkid = fdtraninfo.tranunkid
AND fdrentalinfo.hotel_code = ? AND IFNULL(fdrentalinfo.ismodifiedfromOTA, 0) <> 1
AND fdrentalinfo.statusunkid NOT IN (8 , 12) AND fdrentalinfo.rentaldate = CASE
WHEN fdtraninfo.statusunkid IN (1 , 3, 11, 14) THEN '2022-06-07' ELSE CAST(fdtraninfo.arrivaldatetime AS DATE) END INNER JOIN saas_ezee.fdguesttran ON fdguesttran.tranunkid = fdtraninfo.tranunkid
AND fdguesttran.hotel_code = ? AND fdtraninfo.masterguesttranunkid = fdguesttran.guesttranunkid
INNER JOIN saas_ezee.trcontact ON fdguesttran.guestunkid = trcontact.contactunkid
AND trcontact.hotel_code = ? INNER JOIN saas_ezee.cfroomtype ON cfroomtype.roomtypeunkid = fdrentalinfo.roomtypeunkid AND cfroomtype.hotel_code = ? LEFT JOIN saas_ezee.cfroom ON cfroom.roomunkid = fdrentalinfo.roomunkid AND cfroom.hotel_code = ? WHERE fdtraninfo.hotel_code = ? AND fdtraninfo.tranunkid = ?
GROUP BY fdtraninfo.tranunkid`;

exports.hotel_map =`SELECT saas_ezee.cfhotel.*,saas_ezee.cfcountry.country_name FROM saas_ezee.cfhotel LEFT JOIN saas_ezee.cfcountry ON saas_ezee.cfcountry.countryunkid = saas_ezee.cfhotel.country  WHERE saas_ezee.cfhotel.hotel_code=?`;