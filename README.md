Welcome to Munch
=====

Your personal feed aggregator.

This is a 100% vanilla Javascript experiment with a little help from <a href="http://github.com/evandrolg/Feed">feed.js</a> and <a href="https://github.com/andris9/simpleStorage">simplestorage.js</a>. It uses <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage#localStorage">localstorage</a> to store your feed list and <a href="https://developers.google.com/feed/v1/jsondevguide#resultJson">google's feed API</a> to fetch the latest articles of provided feed url.

This app was built as an exercise on using localstorage and practicing my javascript skills. Why a feed aggregator? For some time i've been wanting to pick up on an earlier version of a feed aggregator i built a few years ago that used a server-side script to process and output articles, but this time i wanted to see if i could make something totally client-side and platform independent.

###Beta Release

It's not 100% fail safe. It probably isn't the neatest code and structure yet, it needs more features like providing warnings when deleting feeds from list, the ability to backup your feed list in case you want to clear your browser's localstorage, and maybe a better looking and functioning UI.

###Usage

Just download Munch folder and put it anywhere you wish. No localhost/server needed.

Open index.html on a browser that <a href="http://caniuse.com/#search=localstorage">supports localstorage</a>, start adding your favorite feeds to the list, use it as your personal feed reader.

The interface is pretty simple, the delete buttons next to each item of the list deletes that item only, to clear the whole list from your localstorage click the <em>Clear List</em> button. <strong>(Warning: This will clear the list forever, you will have to add each item manually again)</strong>
