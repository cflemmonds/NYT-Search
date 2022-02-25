const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //1
const key ='jvTpbChW7yu17VjbpUkAts9LPcCwN2pU'; //2
let url; //3

/*
    What we are doing:
        1. Here we declare the baseURL of the API.
        2. We put in the value of our API key here. This lets the NYT know exactly what user is using their API.
        3. We will see later how to use the 'let url' variable. We'll use it to make a dynamic search url.
*/ 

// SEARCH FORM 
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

// RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

// RESULTS SECTION
const section = document.querySelector('section');

/*
Remember what the querySelector method does?
MDN docs define it as follows:
    - It returns the first Element within the document that matches the specified selector or group of selectors. If no matches are found, null is returned.
*/

nav.style.display = 'none';

let pageNumber = 0;
let displayNav = false;

/*
    What we are doing:
    target.addEventListener()
    - using the addEventListener() method to identify a target and then add an event listener on that target.
    - event targets can be an element, the document object, window object, or any other object that supports events.
    - where we want events to happen in our app:
        1. we want to submit a form that contains a query: "Sports", "Politics", "Weather", etc.
        2. we want to be able to toggle through the results when we click on the next or previous button.
*/
        //1                    //2
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage); // 3
previousBtn.addEventListener('click', previousPage); // 3

/*
How it works:
    1. First, remember that searchForm targets the form element in the html page > const searchForm = document.querySelector('form');
        This event fires on a form, not the button. When the form is submitted, we will fire a function called fetchResults, the second parameter in the function.
    2. The same is true for the other two items, but they are click events. Meaning, when someone clicks on next or prev, it will fire off the function for either.
    3.
*/


                    //1
function fetchResults(e){
    // console.log(e); //2 (we will be commenting this out in lieu of the preventDefault() method)
    // Assemble the full URL
    e.preventDefault(); // we add preventDefault() to make sure that a request isn't actually sent. The default nature of a form is to POST data; we aren't signing up for something or filling out something to be stored in a database. Instead we are using the form to gather, GET data. We will be cancelling out the default nature and constructing a GET request.
    url = baseURL + '?api-key=' + key + '&page' + pageNumber + '&q=' + searchTerm.value; //3
    console.log(url); //4

    if(startDate.value !== '') {
        console.log(startDate.value)
        url += '&begin_date=' + startDate.value;
    };

    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };

    //1
    fetch(url)
    .then(function(result){
        // console.log(result) // we will be commenting this out
        return result.json(); //2
    }).then(function(json){
        // console.log(json); //3
        displayResults(json); //1 & //3 see displayResults section below
    });
}

// 2
function displayResults(json) {
    // console.log("DisplayResults", json);
    // console.log(json.response.docs);
    while (section.firstChild) {
        section.removeChild(section.firstChild); //1
        
    }
    let articles = json.response.docs;
    // console.log(articles);

    if(articles.length === 0) {
        console.log("No results");
    } else {
        // Display the data 
        for(let i = 0; i < articles.length; i++) {
            console.log(i); // so now that we are iterating over the articles properly, we can begin doing DOM manipulation each time we iterate the results, using the following code:
            let article = document.createElement('article'); // 1
            let heading = document.createElement('h2'); //2
            let link = document.createElement('a'); //1 -- see links section

            let current = articles[i]; //2 -- see links section
            console.log('Current:', current); //3 -- see links section

            link.href = current.web_url; //4 -- see links section
            link.textContent = current.headline.main; //5 -- see links section

            article.appendChild(heading); //3
            heading.appendChild(link); //6 -- see links section
            section.appendChild(article); //4
        }

            if(articles.length >= 10) {
                nav.style.display = 'block'; // shows the nav display if 10 items are in the array
            } else {
                nav.style.display = 'none'; // hides the nav display if less than 10 items in the array
            }
    } // See the section below "SHOWING THE RESULTS"
};

function nextPage(){
    console.log("Next button clicked");
} //5

function previousPage(){
    console.log("Previous button clicked");
} //5

/*
    What we are doing:
    1. the little (e) is called an 'event handling function'. Every EHF receives an 'event object'. The (e) is similar to a variable that allows you to interact with the event object.
    2. we are logging the event so we can view it in console for learning purposes.
    3. we are creating a versatile query string. This is loaded with other variables, and url requirements. we have our base for the API, our key, the page number that corresponds to the results array and our specific value. Something to study on my own would be "?" "&" and "&q=" in a url string. What are those?
    4. we log the string so we can see it.
    5. we add a few basic functions to define nextPage and previousPage and log them.
*/

/*
A helpful table to remember:

ˇparameter  | ˇpurpose
---------------------------------------------------
baseURL     | The actual web address for the API
apiKey      | Your key allowing access into the API
page        | The current page of results being accessed
q           | This is the search term, or query, that we are looking for in the API
begin_date  | The earliest (furthest away) date from which we want to see articles
end_date    | The latest (most recent) date from which we want to see articles
*/

/*
A quick note about .preventDefault()

Calling preventDefault() during any stage of event flow cancels the event, meaning that any default action normally taken by the implementation as a result of the event will not occur.
*/

/*
    What we are doing (in the fetch() section): 
    1. fetch() is a keyword that allows us to make a request for information, similar to a GET request with HTTP.
    2. This creates a promise containing a result object{}. This is our response. It will convert into a json object by returning the result.json function.
    3. the json object is used in another promise (set off by the second .then method) to send the information received into another function. for now we are using the console.log(json) to see the json data.
*/

/*
TO RECAP:
    1. We make the fetch() request
    2. We pass in the NYT url.
    3. We create a promise .then() that returns a response object called result.
    4. The promise asynchronously returns a function that converts the result into usable json() format - result.json() is that function call.
    5. We create a second promise that has a function that takes in the json object.
    6. We log the json object for now.
*/



/*
displayResults()
Now that we've received some data back from the API, we need to start working with it.

What we are doing:
    1. we've taken out the console.log in our fetch and replaced it with displayResults(json)
    2. We moved the console.log to a displayResults function.
    3. As a recap: when the promise returns the json, we fire off a function called display results that will work to manage the data.
*/

/*
SHOWING THE RESULTS
    - We want to write an if-else statment that will deal with the data using this logic:

        if(no results)
            do something
        else
            display the data

    - if... allows us to handle if there are 0 results. else... lets us handle the articles variable which contains an array of articles, else... will let us iterate over the array.
    - Once we are iterating over our articles properly, we can do DOM manipulation while we iterate over the results.
    - Here is what is happening each time our loop runs:
        1. We create a variable that will create a node in the DOM that is an article element.
        2. Also create a heading variable that creates a node in the DOM that is an h2 element.
        3. We call appendChild() on the article element. We pass in heading to the appendChild method; meaning there will be an h2 element created inside each article element.
        4. We call the appendChild method on the section element and pass in the article to that. This way the article is a child of section and the h2 is a grandchild of section.
*/

/*
LINKS
--------------
1. We create a 'link' variable that is going to use the 'a' element, the anchor tag which will allow us to create an href link.
2. We create a 'current' variable that holds the data of the current article as we iterate.
3. We log the current data so that we can see it in the console.
4. Since link is an 'a' element, we need an href property to it. current.web_url grabs the hyperlink for the current article out of the json result. This will set the value for the link.href each time we iterate.
5. The text that we'll use in link.textContent is set to the value of current.headline.main, which is part of the json object from the NYT API. You can see this when you drill down into the data.
6. Finally we call the appendChild method on the heading element again. This will append a link as a child element in the DOM inside of each h2. See the screenshot for orientation.
*/

/*
NAVIGATION
-------------

*/
