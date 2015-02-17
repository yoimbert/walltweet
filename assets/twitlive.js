(function($) {
    $.fn.liveTweets = function(options) {

        var defaults = {
            operator: "#google",
            startMessages: 8,
            timeBetweenTweets: 5,
            showThumbnails: true,
            convertTextlink: true,
            linkHashtags: true,
            linkUsernames: true
        };

        var options = $.extend(defaults, options);

        return this.each(function() {
            tweetHolder = $(this);

            /* Base code */
            var tweets = [];
            var nr = 0;
            var total = 0;
            var tweetKeys = 0;
            var firstTime = false;
            var thumbSize = "small";
            var noThumbnailPath = "http://a2.twimg.com/a/1292975674/images/default_profile_2_normal.png";
            var twitterURL = "http://www.twitter.com/";
            var tweetTimer = false;
            var maxItems = 8;

            var tag = options.operator;
            var tweetsFromSearch = "http://search.twitter.com/search.json?callback=?&q=" + escape(tag) + "&rpp=" + maxItems;

            var getTweets = function() {
                $.getJSON(tweetsFromSearch, function(data) {
                    $.each(data.results, function(key, value) {
                        if (tweetExists(value.id) == false) {
                            tweets[tweetKeys] = value;
                            tweetKeys++;
                        }
                    });
                    if (firstTime == false) {
                        tweets.reverse();
                        loopTweets();
                    }
                    total = tweets.length;
                });
            };

            var customize = function(operator) {
                // Set new operator(s)
                tag = operator;
                tweetsFromSearch = "http://search.twitter.com/search.json?callback=?&q=" + escape(tag) + "&rpp=" + maxItems;

                // Clear tweets
                $(".tweet").remove();

                // Init new tweets
                globalReset();
                getTweets();
            };

            /** CHANGE TAGS **/
            $("ul li a").on('click', function() {
                
                
                $("ul li a").removeClass('active');
                
                $(this).addClass('active');
             
           
                if($(this).hasClass('all-tags')) {
                    
                    var tags = [];
                    
                    $('.search-tweet').each(function(){
                        
                        tags.push($(this).text());
                    });
                    
                    console.log(tags.join(' OR '));
                    
                    customize(tags.join(' OR '));
                } else {
                    customize($(this).text());
                }
            });

            var loopTweets = function() {
                if (firstTime == false) {
                    if (options.startMessages > 1) {
                        for (var i = 0; i < options.startMessages; i++) {
                            if (tweets[nr] != undefined) {
                                showTweet(i, 'instant');
                            }
                        }
                        nr = (i - 1);
                    } else {
                        showTweet(0, 'instant');
                    }

                    firstTime = true;
                    nr++;
                }

                // Only create this once...
                if (tweetTimer == false) {

                    jQuery.fjTimer({interval: (options.timeBetweenTweets * 1000), repeat: true, tick: function(counter, timerId) {
                            if (tweets[nr] != undefined) {
                                showTweet(nr, 'normal');
                                nr++;
                            }
                        }
                    });
                    tweetTimer = true;
                }
            };

            // We check to see if a Tweet allready exists..
            var tweetExists = function(tweetId) {
                var tweetAlreadyFound = false;
                $.each(tweets, function(key, value) {
                    if (value.id == tweetId) {
                        tweetAlreadyFound = true;
                    }
                });
                return tweetAlreadyFound;
            };

            // Regular expressions for the URLs
            var formatUrl = function(text) {
                var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                return text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
            };

            var formatHashUrl = function(text) {
                var exp = /\#([a-zA-Z]+)([\s|\.\,:]+)*/g;
                return text.replace(exp, "<a target='_blank' href='http://twitter.com/#search?q=%23$1'>#$1 </a>");
            };

            var formatUserUrl = function(text) {
                var exp = /\@([a-zA-Z]+)([\s|\.\,:]+)*/g;
                return text.replace(exp, "<a target='_blank' href='http://twitter.com/$1'>@$1 </a>");
            };

            // Format URLs in tweet - optional - 
            var formatTweetMsg = function(text) {
                if (options.convertTextlink == true) {
                    text = formatUrl(text);
                }

                if (options.linkHashtags == true) {
                    text = formatHashUrl(text);
                }

                if (options.linkUsernames == true) {
                    text = formatUserUrl(text);
                }

                return text;
            };

            // Give the tweet a nice timestamp
            var formatTime = function(pastTime) {
                /* Credits to: Zemanta */
                var origStamp = Date.parse(pastTime);
                var curDate = new Date();
                var currentStamp = curDate.getTime();

                var difference = parseInt((currentStamp - origStamp) / 1000);

                if (difference < 0)
                    return false;
                if (difference <= 60)
                    return "Seconds ago";
                if (difference < 3600)
                    return parseInt(difference / 60) + " minutes ago";
                if (difference <= 1.5 * 3600)
                    return "One hour ago";
                if (difference < 23.5 * 3600)
                    return Math.round(difference / 3600) + " hours ago";
                if (difference < 1.5 * 24 * 3600)
                    return "One day ago";

                var dateArr = pastTime.split(' ');
                return dateArr[4].replace(/\:\d+$/, '') + ' ' + dateArr[2] + ' ' + dateArr[1] + (dateArr[3] != curDate.getFullYear() ? ' ' + dateArr[3] : '');
            };

            // Show the tweet to the audience
            var showTweet = function(nr, displayTime) {
                var tweetMsg = tweets[nr].text;
                var tweetAuthor = tweets[nr].from_user;
                var tweetThumb = tweets[nr].profile_image_url;
                var tweetDate = tweets[nr].created_at;
                var tweetClass = "";

                if (nr == 0) {
                    tweetClass = "first";
                }
                if (thumbSize == "large") {
                    tweetThumb = tweetThumb.replace("_normal", "");
                }

                // Set data       
                if (tweetThumb.indexOf('default_profile') > 0) {
                    var tweetDiv = $('<div id="tweet_' + tweets[nr].id + '" class="tweet dark"><div class="content"><div class="profile"><img src="' + tweetThumb + '" alt="" /><a href="#">@' + tweetAuthor + '</a></div><p>' + formatTweetMsg(tweetMsg) + '</p></div></div>');
                    //var tweetDiv = $("<div class='tweet " + tweetClass + "' id='tweet_" + tweets[nr].id + "'><img width='48' height='48' class='tweet_foto' src='" + noThumbnailPath + "'/><div class='tweet_text'><a  class='profile' target='_blank' href='" + twitterURL + tweetAuthor + "'>@" + tweetAuthor + "</a> " + formatTweetMsg(tweetMsg) + "<span>" + formatTime(tweetDate) + "</span></div></div>");
                } else {
                    var tweetDiv = $('<div id="tweet_' + tweets[nr].id + '" class="tweet dark"><div class="content"><div class="profile"><img src="' + tweetThumb + '" alt="" /><a href="#">@' + tweetAuthor + '</a></div><p>' + formatTweetMsg(tweetMsg) + '</p></div></div>');
                }

                tweetHolder.prepend(tweetDiv);

                //Option
                if (!options.showThumbnails == true)
                    $("#tweet_" + tweets[nr].id + " img").remove();

                if (displayTime == 'normal') {
                    $("#tweet_" + tweets[nr].id).show();
                }

                for (var k = 0; k < options.startMessages; k++) {
                    if (k > 3) {
                        $('.tweets-bottom').prepend($('.tweets-top div.tweet').eq(k));
                    }
                }

                $('.tweets-bottom .tweet:gt(3)').remove();
                
                // trigger event
                $(document).trigger('colorize');

                // Do not overload the webpage, destroy old tweets
                if ($(".tweets-top div.tweet").size() > 6) {
                    var tmpTeller = 0;
                    $(".tweets-top div.tweet").each(function() {
                        if (tmpTeller > 7) {
                            $(this).remove();
                        }
                        tmpTeller++;
                    });
                }
            };

            var globalReset = function() {
                tweets = "";
                tweets = [];
                nr = 0;
                total = 0;
                tweetKeys = 0;
                firstTime = false;
            };

            // Init
            getTweets();

            // Pull request each 20 seconds
            jQuery.fjTimer({interval: 4000, repeat: true, tick: function(counter, timerId) {
                    getTweets();
                }
            });
        });
    };
})(jQuery);

jQuery.extend({
    fjFunctionQueue: function(funcToQue) {
        if (funcToQue == null) {
            if (jQuery.fjFunctionQueue.queue != null && jQuery.fjFunctionQueue.queue.queue.length > 0) {
                if (jQuery.fjFunctionQueue.queue.running) {
                    jQuery.fjTimer({
                        interval: jQuery.fjFunctionQueue.queue.properties.interval,
                        tick: function(counter, timer) {
                            var func = jQuery.fjFunctionQueue.queue.queue.shift();
                            try {
                                jQuery.fjFunctionQueue.queue.properties.onTick(jQuery.fjFunctionQueue.queue.index, func);
                                jQuery.fjFunctionQueue.queue.index++;
                            } catch (e) {
                                jQuery.fjFunctionQueue();
                                throw e;
                            }
                            if (jQuery.fjFunctionQueue.queue.queue.length > 0) {
                                jQuery.fjFunctionQueue();
                            } else {
                                jQuery.fjFunctionQueue.queue.running = false;
                                jQuery.fjFunctionQueue.queue.index = 0;
                                jQuery.fjFunctionQueue.queue.properties.onComplete();
                            }
                        }
                    });
                } else {
                    jQuery.fjFunctionQueue.queue.running = true;
                    jQuery.fjFunctionQueue();
                }
            }
        } else {
            if (jQuery.fjFunctionQueue.queue == null) {
                jQuery.fjFunctionQueue.queue = {index: 0, running: false, queue: [], properties: {interval: 1, onComplete: function() {
                        }, onStart: function() {
                        }, autoStart: true, onTick: function(counter, func) {
                            func();
                        }}};
            }
            var isEmptyArray = jQuery.fjFunctionQueue.queue.queue.length == 0;
            if (jQuery.isFunction(funcToQue)) {
                jQuery.fjFunctionQueue.queue.queue.push(funcToQue);
            } else if (jQuery.isArray(funcToQue)) {
                for (var i = 0; i < funcToQue.length; i++) {
                    jQuery.fjFunctionQueue.queue.queue.push(funcToQue[i]);
                }
            } else {
                jQuery.fjFunctionQueue.queue.properties = jQuery.extend(jQuery.fjFunctionQueue.queue.properties, funcToQue);
            }
            if (isEmptyArray && jQuery.fjFunctionQueue.queue.queue.length > 0 && !jQuery.fjFunctionQueue.queue.running && jQuery.fjFunctionQueue.queue.properties.autoStart) {
                jQuery.fjFunctionQueue.queue.running = true;
                jQuery.fjFunctionQueue.queue.properties.onStart();
                jQuery.fjFunctionQueue.queue.running = false;
                jQuery.fjFunctionQueue();
            }
        }
    },
    fjTimer: function(properties) {
        properties = jQuery.extend({interval: 10, tick: function() {
            }, repeat: false, random: false, onComplete: function() {
            }, step: 1}, properties);
        var counter = 0;
        var timer = new function() {
            this.timerId = null;
            this.stop = function() {
                clearInterval(this.timerId);
            }
        }
        timer.timerId = setInterval(function() {
            try {
                properties.tick(counter, timer);
                counter += properties.step;
            } catch (e) {
                alert(e);
            }
            if (properties.repeat !== true && ((properties.repeat * properties.step) <= counter || properties.repeat === false)) {
                timer.stop();
                properties.onComplete();
            }
        }, properties.interval);
    },
    fjTimerEach: function(properties) {
        var ___array = properties.array;
        var ___callback = properties.tick;
        properties.repeat = ___array.length;
        if (properties.step != null) {
            properties.repeat = Math.ceil(___array.length / parseInt(properties.step, 10));
        }
        properties.tick = function(counter, timer) {
            ___callback(counter, ___array[counter]);
        }
        jQuery.fjTimer(properties);
    }
});
jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
};