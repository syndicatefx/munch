/*//////////////////////////////////////////////////////////////
  MUNCH
  Javascript based personal feed aggregator app

  * http://syndicatefx.com/munch
  * author: Paulo Nunes <syndicatefx@gmail.com>
  * http://syndicatefx.com
  * 21-09-2014
  * License: MIT
//////////////////////////////////////////////////////////////*/




/*--------------------------------------------------------------
  LIST POSTS FROM RSS FEED

  * This function is called when the feed link, from feed list, is
    clicked.
  * It gets the data-* attributes of website name and feed url of
    the clicked link and renders a template to display each entry
    from the given feed.
  * Requires feed.js 
      
--------------------------------------------------------------*/
var changeFeed = function() {

    // get data-title attribute of clicked button
    var blogTitle = this.getAttribute('data-title');
    document.querySelector('.blog-title').innerHTML = blogTitle;

    // get data-url attribute of clicked button
    var feedSource = this.getAttribute('data-url');

    // clear the list of feeds if populated
    document.querySelector('.grid').innerHTML = '';

    // populate list of given feed
    var render = function(posts) {
        var elements = {};
        elements.list = document.querySelector('.grid');
        var template = [
            '<div class="grid-item">',
                '<span>{{ DATE }} by {{ AUTHOR }}</span>',
                '<h3>{{ TITLE }}</h3>',
                '<p>{{ DESCRIPTION }}</p>',
                '<a href="{{ URL }}" class="btn" target="_blank" title="Read Article">Read Article</a>',
            '</div>'
        ].join('');

        posts.feed.entries.forEach(function(element, index) {
            var html = template.replace('{{ URL }}', element.link)
                               .replace('{{ TITLE }}', element.title)
                               .replace('{{ DATE }}', element.publishedDate.slice(0,-14))// SFX-the .slice() to cut out the time from publishedDate
                               .replace('{{ AUTHOR }}', element.author)
                               .replace('{{ DESCRIPTION }}', element.contentSnippet);

            elements.list.innerHTML += html;
        });
    };

    // init the feed
    window.Feed({
      url: feedSource,
      limit: 8,// add number of posts to display
      callback: render
    });
};




/*--------------------------------------------------------------
  ADD/DELETE ITEMS TO FEED LIST USING LOCALSTORAGE 

  * Functions provided by simplestorage.js
  * These functions control the storing, updating and deleting
    of the feed list
--------------------------------------------------------------*/
var item = {
    keys: [],
    value: {}
};


// This function removes single item of feed list

function removeRow(elm){
    var key = elm.element.key;
    simpleStorage.deleteKey(key);
    // remove old
    for(var i = item.keys.length - 1; i>=0; i--){
        if(item.keys[i] == key){
            item.value[item.keys[i]].row.parentNode.removeChild(item.value[item.keys[i]].row);
            delete item.value[item.keys[i]]
            item.keys.splice(i, 1);
        }
    }
};


// This function creates the template for the feed link/item and adds it to the list

function add(data){
    var row = document.createElement("li"),
        name = document.createElement("button"),
        rem = document.createElement("div");

    

    name.innerHTML = (data.key || "").toString().replace(/</g, "&lt;").replace(/</g, "&gt;");
    name.setAttribute("class","feedlink");
    name.setAttribute("data-title",(data.key || "").toString().replace(/</g, "&lt;").replace(/</g, "&gt;"));

    value = name.setAttribute("data-url",(data.value).replace(/"/g, ''));

    rem.innerHTML = '<button type="button" class="deletefeed" onclick="removeRow(this.parentNode);">&#10006;</button>';
    rem.element = data;

    row.appendChild(rem);
    row.appendChild(name);
    
    document.getElementById("list").appendChild(row);

    data.row = row;
    item.value[data.key] = data;
    item.keys.push(data.key);
};


// This function stores the items and updates the localstorage

function update(){
    var keys = simpleStorage.index(), i, len, remove = [], exists;

    for(i=0, len = keys.length; i<len; i++){
        if(!item.value.hasOwnProperty(keys[i])){
            // add new
            add({
                key: keys[i],
                value: JSON.stringify(simpleStorage.get(keys[i]), false, 4)
            });
        }
    }

    // remove old
    for(i = item.keys.length - 1; i>=0; i--){
        exists = false;
        for(var j=0, jlen = keys.length; j < jlen; j++){
            if(item.keys[i] == keys[j]){
                exists = true;
                break;
            }
        }
        if(!exists){
            item.value[item.keys[i]].row.parentNode.removeChild(item.value[item.keys[i]].row);
            delete item.value[item.keys[i]]
            item.keys.splice(i, 1);
        }
    }
};


// This function retrieves the data from the form input

function set(){
    var keyElm = document.getElementById("set-key"),
        valueElm = document.getElementById("set-value"),
        key = keyElm.value,
        value = valueElm.value

    try{
        value = JSON.parse(value);
    }catch(E){}

    if(!key){
        alert("Website Name not set");
        return;
    }
    if(!value){
        alert("Feed URL not set");
        return;
    }

    simpleStorage.set(key, value);

    update();

    keyElm.value = "";
    valueElm.value = "";
};

update();




/*--------------------------------------------------------------
  BUTTON ACTIONS 
--------------------------------------------------------------*/

// Declare variables for our buttons
var feedlink = document.querySelectorAll('.feedlink');
var clear = document.querySelector('.clear');
var addfeed = document.querySelector('.addfeed');

// for all feed links, on click get posts from feed
for (var i = 0; i < feedlink.length; i++) {
    feedlink[i].onclick = changeFeed;
};

// clear on click, delete the whole feed list from localstorage
clear.onclick = function(){
    if(simpleStorage.flush() === true){
        document.location.reload();
    }
    if(simpleStorage.flush() === false){
        alert('Unable to clear localstorage!');
    }
    
};

// add new feed to list
addfeed.onclick = function(){
    set();
    document.location.reload();
};


