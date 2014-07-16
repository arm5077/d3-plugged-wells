<?PHP

$db = mysql_connect("YOUR_DB_ENDPOINT", "YOUR_DB_USERNAME", "YOUR_DB_PWD");
mysql_select_db("YOUR_DB_NAME", $

$query=mysql_query("SELECT * FROM pluggedWells WHERE name LIKE '" . $_GET["name"] . "'");
$results=mysql_fetch_assoc($query);

echo json_encode($results);



?>