/*jslint white: true, browser: true, devel: true, evil: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

/*global $: true, FB: true, window: true */

"use strict";

FB.init({ apiKey: 'f89c4f0186a4f2181fb7320263679c6c', status: true, cookie: true, xfbml: true});

FB.Event.subscribe('auth.login', function (response) {
    // Reload the application in the logged-in state
    window.top.location = 'http://apps.facebook.com/innovation_winner/';
});

// function showMe(response) {
//     var html;
//     FB.api('/me', function (response) {
//         html = '<table>';
//         for (var key in response) {
//             html += (
//                 '<tr>' +
//                 '<th>' + key + '</th>' +
//                 '<td>' + response[key] + '</td>' +
//                 '</tr>'
//             );
//         }
//         div.innerHTML = html;
//     });
// }

// function showFriends() {
//     FB.api({ method: 'friends.get' }, function (result) {
//
//         var markup = '',
//             numFriends = result ? Math.min(5, result.length) : 0,
//             i;
//
//         console.info('friends.get response', result);
//
//         if (numFriends > 0) {
//             for (i = 0; i < numFriends; i++) {
//                 markup += (
//                     '<fb:profile-pic size="square" ' + 'uid="' + result[i] + '" ' + 'facebook-logo="true"' + '></fb:profile-pic>'
//                 );
//             }
//         }
//         profilePicsDiv.innerHTML = markup;
//         // showMe();
//         FB.XFBML.parse(profilePicsDiv);
//     });
// }

// function publishWithUI() {
//     FB.ui({
//         method: 'stream.publish',
//         message: 'Price Picker rocks, why aren\'t you playing',
//         attachment: {
//             name: 'Price Picker',
//             caption: 'An awesome innovation',
//             description: (
//                 'Price Picker, more innovative than your mum - and more fun!'
//             ),
//             href: 'http://apps.facebook.com/innovation_winner/'
//         },
//         action_links: [
//             {text: 'Code', href: 'http://apps.facebook.com/innovation_winner/'}
//         ],
//         user_message_prompt: 'Tell your friends they suck if they\'re not playing Price Picker'
//     },
//     function (response) {
//         if (response && response.post_id) {
//             // alert('Post was published.');
//         } else {
//             // alert('Post was not published.');
//         }
//     });
// }

// function publish() {
//     var body = 'Price Picker, in your stream spamming your "friends"';
//     FB.api('/me/feed', 'post', { body: body }, function (response) {
//         if (!response || response.error) {
//             // console.debug('Error occured');
//         } else {
//             // console.debug('Post ID: ' + response);
//         }
//     });
// }

// function getUserID() {
//     FB.api('/me', function (response) {
//         console.debug(response.id);
//     });
// }

// function getFriendIDs() {
//     FB.api({ method: 'friends.get' }, function (result) {
//         var numFriends = result ? Math.min(5, result.length) : 0,
//             friendIDs  = [],
//             i;
//         if (numFriends > 0) {
//             for (i = 0; i < numFriends; i++) {
//                 friendIDs.push(result[i]);
//             }
//         }
//         console.debug(friendIDs);
//     });
// }

// FB.getLoginStatus(function (response) {
//
//     if (!response.session) {
//         profilePicsDiv.innerHTML = '<em>You are not connected</em>';
//         return;
//     }
//
//     showMe();
//     showFriends();
//
//     document.getElementById('publishWithUI').onclick = publishWithUI;
//     document.getElementById('publish').onclick = publish;
//
// });


(function () {

    var randomListing  = '/listings/random.json',
        similarListing = '/listings/similar_to/', // NOTE you need to append PROPERTY_ID.json
        listingA       = {},
        listingB       = {},
        mostExpensive,
        canGuess,
        startingLives = 3,
        score         = 0,
        high_score    = 0,
        streak        = 0,
        bestStreak    = 0,
        guesses       = 0,
        lives         = 0,
        uid;

    // TODO Might need to use this as the INIT for the whole app
    function getMyFBDetails() {
        FB.api('/me', function (response) {
            uid = response.id;
            $('#my_fb_avatar').html('<fb:profile-pic size="square" ' + 'uid="' + uid + '" ' + 'facebook-logo="true"' + '></fb:profile-pic>');
            FB.XFBML.parse(document.getElementById('my_fb_avatar'));
        });
    }

    function publishWithUI(msg) {
        FB.api({
            method: 'stream.publish',
            message: msg,
            attachment: {
                name: 'Price Picker',
                caption: 'An awesome innovation',
                description: (
                    'Price Picker, more innovative than your mum - and more fun!'
                ),
                href: 'http://apps.facebook.com/innovation_winner/'
            },
            action_links: [
                {text: 'Code', href: 'http://apps.facebook.com/innovation_winner/'}
            ],
            user_message_prompt: 'Tell your friends they suck if they\'re not playing Price Picker'
        },
        function (response) {
            if (response && response.post_id) {
                // alert('Post was published.');
            } else {
                // alert('Post was not published.');
            }
        });
    }

    function publishScore() {
        var msg = 'I just scored ' + score + ' in Price Picker, why aren\'t you playing?';
        publishWithUI(msg);
    }

    function drawLeaderBoard(data) {
        var i,
            user,
            html = '<table id="leaderboard"><tr><th>Friend</th><th>Best Streak</th><th>High Score</th></tr>';
        for (i = 0; i < data.length; i++) {
            user = data[i];
            html += '<tr>' +
                    '<td><fb:profile-pic size="square" uid="' + user.id + '" facebook-logo="true"></fb:profile-pic>' + '</td>' +
                    '<td>' + user.best_streak + '</td>' +
                    '<td>' + user.high_score + '</td></tr>';
        }
        html += '</table><p><span id="tryAgain" class="button">Try Again!</span><span id="publish" class="button">Share Your Score</span></p>';
        $('.resultMessage strong').html(html);
        $('.resultMessage strong')[0].className = '';
        $('.resultMessage').show();
        // TODO ADD PLAY AGAIN
        FB.XFBML.parse(document.getElementById('leaderboard'));
        $('#nextButton').hide();
        $('#tryAgain').click(init);
        $('#publish').click(publishScore);
    }

    function displayLeaderBoard() {
        FB.api({ method: 'friends.get' }, function (result) {
            var numFriends = result ? Math.min(5, result.length) : 0,
                friendIDs  = [],
                url,
                i;
            if (numFriends > 0) {
                for (i = 0; i < numFriends; i++) {
                    friendIDs.push(result[i]);
                }
            }

            friendIDs.push(uid);

            url = '/users/' + friendIDs.join(',') + '.json';

            $.get(url, function (data) {
                drawLeaderBoard(data);
            });

        });
    }

    function updateScoreboard(win) {
        var url, data;
        if (win) {
            streak = streak + 1;
            score  = score + 10 * streak;
        } else {
            streak = 0;
        }
        if (streak > bestStreak) {
            bestStreak = streak;
        }
        if (score > high_score) {
            high_score = score;
        }
        $('.score').html(score);
        $('.highScore').html(high_score);
        $('.streak').html(streak);
        $('.lives').html(lives);
        $('.bestStreak').html(bestStreak);
        // TODO make submit score a seperate function
        if (win) {
            url = '/user/' + uid + '.json?score=' + score + '&streak=' + bestStreak;
            data = 'uid';
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function () {
                    // console.debug(arguments);
                }
            });
        }
    }

    function displayListing(ctx, data) {
        $('a.mainImage', ctx).html('<img src="' + data.image_url + '">');
    }

    function displayListingDetails(ctx, data) {
        $('.price', ctx).html('$' + data.price);
        $('.address', ctx).html(data.suburb + ', ' + data.state + ', ' + data.postcode);
        $('.bedrooms', ctx).html(data.bedrooms);
        $('.bathrooms', ctx).html(data.bathrooms);

        $('.infoLink', ctx).attr({href: 'http://www.realestate.com.au/' + data.id});
        $(ctx).show();
    }

    function displayListingA() {
        displayListing('.imageWrapper.first', listingA);
    }

    function displayListingB() {
        displayListing('.imageWrapper.second', listingB);
    }

    function displayListingADetails() {
        displayListingDetails('.first .postNote', listingA);
    }

    function displayListingBDetails() {
        displayListingDetails('.second .postNote', listingB);
    }

    function disableGuessing() {
        canGuess = false;
    }

    function enableGuessing() {
        canGuess = true;
    }

    function popupMessage(msg, icon) {
        $('.resultMessage strong').html(msg).show();
        if (icon) {
            $('.resultMessage strong')[0].className = icon;
        }
        $('.resultMessage').show();
    }

    function win() {
        popupMessage('You rock!', 'win');
        $('#nextButton').show();
        updateScoreboard('win');
        displayListingADetails();
        displayListingBDetails();
    }

    function lose() {
        lives = lives - 1;
        if (lives <= 0) {
            disableGuessing();
            displayLeaderBoard();
            // TODO do all score posting here
        } else {
            popupMessage('You suck!', 'lose');
        }
        updateScoreboard();
        displayListingADetails();
        displayListingBDetails();
    }

    function guess(e) {
        if (!canGuess) {
            return;
        }
        var correct = $(e.currentTarget).hasClass(mostExpensive);
        guesses = guesses + 1;
        disableGuessing();
        displayListingADetails();
        displayListingBDetails();
        if (correct) {
            win();
        } else {
            lose();
        }
    }

    function setupNextTurn() {
        $('.resultMessage').hide();
        $('.postNote').hide();
        $.get(randomListing, function (listing) {
            listingA = listing;
            $.get(similarListing + listingA.id + '.json', function (listing) {
                listingB = listing;
                displayListingA();
                displayListingB();
                enableGuessing();
                // NOTE A must always be on the first, B must always be on the second
                mostExpensive = (listingA.price > listingB.price) ? 'first' : 'second';
            });
        });
    }

    function init() {
        getMyFBDetails();
        score = 0;
        streak = 0;
        // NOTE do not reset best streak or high score
        lives = startingLives;
        $('.lives').html(lives);
        $('.score').html(score);
        $('.imageWrapper').click(guess);
        $('.resultMessage').click(setupNextTurn);
        setupNextTurn();
    }

    init();

}());