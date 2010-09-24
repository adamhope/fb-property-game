/*jslint white: true, browser: true, devel: true, evil: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

/*global $: true, FB: true, window: true */

"use strict";

FB.init({ apiKey: 'f89c4f0186a4f2181fb7320263679c6c', status: true, cookie: true, xfbml: true});

FB.Event.subscribe('auth.login', function (response) {
    // Reload the application in the logged-in state
    window.top.location = 'http://apps.facebook.com/innovation_winner/';
});

var profilePicsDiv = document.getElementById('profile_pics');
var div            = document.getElementById('me');

function showMe(response) {
    var html;
    FB.api('/me', function (response) {
        html = '<table>';
        for (var key in response) {
            html += (
                '<tr>' +
                '<th>' + key + '</th>' +
                '<td>' + response[key] + '</td>' +
                '</tr>'
            );
        }
        div.innerHTML = html;
    });
}

function showFriends() {
    FB.api({ method: 'friends.get' }, function (result) {
        
        var markup = '',
            numFriends = result ? Math.min(5, result.length) : 0,
            i;
        
        console.info('friends.get response', result);
        
        if (numFriends > 0) {
            for (i = 0; i < numFriends; i++) {
                markup += (
                    '<fb:profile-pic size="square" ' + 'uid="' + result[i] + '" ' + 'facebook-logo="true"' + '></fb:profile-pic>'
                );
            }
        }
        profilePicsDiv.innerHTML = markup;
        // showMe();
        FB.XFBML.parse(profilePicsDiv);
    });
}

// resize canvas
// window.fbAsyncInit = function() {
//   FB.Canvas.setAutoResize();
// }


function publishWithUI() {
    FB.ui({
        method: 'stream.publish',
        message: 'Price Picker rocks, why aren\'t you playing',
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

function publish() {
    var body = 'Price Picker, in your stream spamming your "friends"';
    FB.api('/me/feed', 'post', { body: body }, function (response) {
        if (!response || response.error) {
            console.debug('Error occured');
        } else {
            console.debug('Post ID: ' + response);
        }
    });
}

function getUserID() {
    FB.api('/me', function (response) {
        console.debug(response.id);
    });
}

function getFriendIDs() {
    FB.api({ method: 'friends.get' }, function (result) {
        var numFriends = result ? Math.min(5, result.length) : 0,
            friendIDs  = [],
            i;        
        if (numFriends > 0) {
            for (i = 0; i < numFriends; i++) {
                friendIDs.push(result[i]);
            }
        }
        console.debug(friendIDs);
    });
}

FB.getLoginStatus(function (response) {

    if (!response.session) {
        profilePicsDiv.innerHTML = '<em>You are not connected</em>';
        return;
    }

    showMe();
    showFriends();
    
    document.getElementById('publishWithUI').onclick = publishWithUI;
    document.getElementById('publish').onclick = publish;

});


(function () {
    
    var randomListing  = '/listings/random.json',
        similarListing = '/listings/similar_to/', // NOTE you need to append PROPERTY_ID.json
        listingA       = {},
        listingB       = {},
        mostExpensive,
        canGuess,
        score = 0,
        streak = 0,
        bestStreak = 0,
        guesses = 0;

    function initScoreboard() {
        // TODO stuff
    }

    function updateScoreboard(win) {
        if (win) {
            streak = streak + 1;
            score  = score + 10 * streak;
        } else {
            streak = 0;
        }
        $('.score').html(score);
        $('.streak').html(streak);
        $('.guesses').html(guesses);
        if (streak > bestStreak) {
            $('.bestStreak').html(bestStreak);
        }
    }

    function displayListing(ctx, data) {
        $('a', ctx).html('<img src="' + data.image_url + '">');
    }

    function displayListingDetails(ctx, data) {
        $('.price', ctx).html('$' + data.price);
        $('.address', ctx).html(data.suburb + ', ' + data.postcode);
        $('.beds', ctx).html(data.bedrooms);
        $('.baths', ctx).html(data.bathrooms);
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

    function popupMessage(msg, icon) {
        $('.resultMessage').html(msg).show();
    }

    function win() {
        popupMessage('You win!');
        updateScoreboard('win');
    }
    
    function lose() {
        popupMessage('You lose!');
        updateScoreboard();
    }

    function disableGuessing() {
        canGuess = false;
    }
    
    function enableGuessing() {
        canGuess = true;
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

    function setupNewGame() {
        $('.resultMessage').hide();
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
        setupNewGame();
        $('.imageWrapper').click(guess);
        $('.resultMessage').click(setupNewGame);
    }
    
    init();
       
}());