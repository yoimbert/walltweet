<?php
$list_tags = array();

$list_tags[0] = new stdClass();
$list_tags[0]->title = '#paris';
$list_tags[0]->color = '#5d5358';

$list_tags[1] = new stdClass();
$list_tags[1]->title = '#lol';
$list_tags[1]->color = '#51667b';

$list_tags[2] = new stdClass();
$list_tags[2]->title = '#larochelle';
$list_tags[2]->color = '#10B7A1';

$list_tags[3] = new stdClass();
$list_tags[3]->title = '#webconexio';
$list_tags[3]->color = '#24806b';

$list_tags[4] = new stdClass();
$list_tags[4]->title = '#TechCrunch';
$list_tags[4]->color = '#51667b';

$list_tags[5] = new stdClass();
$list_tags[5]->title = '#leweb';
$list_tags[5]->color = '#BB4BD1';

$tagsString = null;
foreach ($list_tags as $key => $item) {
    $tagsString .= $key != 0 ? ' OR ' : null;
    $tagsString .= $item->title;
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>WEBCONEXIO - Wall Twitter</title>
        <link href="assets/application.css" media="screen" rel="stylesheet" type="text/css" />
        <script src="assets/jquery.js" type="text/javascript"></script>
    </head>

    <body>
        <div id="logo">
            <a href="http://www.webconexio.com"><img src="images/logo.jpg" alt="" /></a>
        </div>
		<div id="time"></div>
        <div class="tweets"></div>
        <div id="site">
            <div id="tags">
                <div class="tweets-top">
                </div>
                <ul>
                    <li><a href="#" class="all-tags active">Tous les tags</a></li>
                    <?php foreach($list_tags as $item) :  ?>
                        <li><a href="#" class="search-tweet"><?php echo $item->title; ?></a></li>
                    <?php endforeach;  ?>
                </ul>
                <div class="tweets-bottom"></div>
            </div>
        </div>
		<div id="footer">
			<a href="http://www.webconexio.com" target="_blank">H&eacute;bergement &amp; Conception WEBCONEXIO </a>

                <p>Webconexio Tweetwall v1 beta
                    Les connexions et leurs tentatives sont enregistr&eacute;es sur les serveurs.<br />
                    Toutes tentatives de nuisance (actes de pirateries, spam,...) feront syst&eacute;matiquement l'objet d'une plainte au service comp&eacute;tent.</p>
		</div>
        <script type="text/javascript">

            jQuery(document).ready(function($) {

                $(document).bind('colorize', function() {
                    <?php foreach($list_tags as $item) : ?>
                            $('.tweet:Contains("<?php echo $item->title; ?>")').css('background-color', '<?php echo $item->color; ?>');
                    <?php endforeach; ?>
                });

                $(".tweets-top").liveTweets({
                    operator: "<?php echo $tagsString; ?>",
                    startMessages: 8
                });

            });
			function runClock() {
				today   = new Date();
				hours   = today.getHours();
				minutes = today.getMinutes();
				seconds = today.getSeconds();
				timeValue = hours;
				timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
				
				jQuery('#time').text(timeValue);
				timerID = setTimeout("runClock()",1000);
				timerRunning = true;
			}
			
			runClock();
        </script>
        <script src="assets/twitlive.js" type="text/javascript"></script>
    
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-33309799-7']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

    </body>
</html>