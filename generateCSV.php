<?


$handle = fopen("data.csv", "w+");

fwrite($handle, "name,lat,lng,company,production,dateStart,dateEnd,act13\n");

for($i = 0; $i <= 500; $i++)
{
	switch(rand(1,9))
	{
		case 1: $name = "Shell"; break;
		case 2: $name = "CNX"; break; 
		case 3: $name = "Chesapeake"; break; 
		case 4: $name = "Chesapeake"; break; 
		case 5: $name = "Chesapeake"; break; 
		case 6: $name = "Chesapeake"; break; 
		case 7: $name = "Atlas"; break; 
		case 8: $name = "Range"; break; 
		case 9: $name = "Atlas"; break; 
	}
	
	$start = rand(1000,1500);
	$end = rand(40,999);
	$lifespan = $start - $end;

	echo $string = $i . "," . (40 + rand(0, 2000) / 1000) . "," . (-75 - rand(0,5000) / 1000) . "," . $name . "," . rand(0,40000) . "," . date("Y-m-d", strtotime("-" . $start . " days")) . "," . date("Y-m-d", strtotime("-" . $end . " days")) . "," . $lifespan * 150 . "\n";
	fwrite( $handle, $string );
}

?>