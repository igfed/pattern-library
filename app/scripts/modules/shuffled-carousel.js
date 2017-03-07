import * as ig from './global.js';

export default (() => {

    var data = {
            "content": {
                "0": {
                    "title": "A lifetime of memories awaits!",
                    "description": "Introduce a friend, collegue or a family member to an Investors Group Consultant to win a trip for two.",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "1": {
                    "title": "This week in the markets",
                    "description": "Central bank action prompts equity market gains.",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "2": {
                    "title": "About your client statement",
                    "description": "To help you get the most value out of your statement, this guide explains what's behind each section.",
                    "image-path": "images/featured-topics-client-statement.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "3": {
                    "title": "Item 4",
                    "description": "Item 4",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "4": {
                    "title": "Item 5",
                    "description": "Item 5",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "5": {
                    "title": "Item 6",
                    "description": "Item 6",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "6": {
                    "title": "Item 7",
                    "description": "Item 7",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },

                "7": {
                    "title": "Item 8",
                    "description": "Item 8",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "8": {
                    "title": "Item 9",
                    "description": "Item 9",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "9": {
                    "title": "Item 10",
                    "description": "Item 10",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "10": {
                    "title": "Item 11",
                    "description": "Item 11",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "11": {
                    "title": "Item 12",
                    "description": "Item 12",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "12": {
                    "title": "Item 13",
                    "description": "Item 13",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "13": {
                    "title": "Item 14",
                    "description": "Item 14",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "14": {
                    "title": "Item 15",
                    "description": "Item 15",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "15": {
                    "title": "Item 16",
                    "description": "Item 16",
                    "image-path": "images/featured-topics-brazil.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "16": {
                    "title": "Item 17",
                    "description": "Item 17",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "17": {
                    "title": "Item 18",
                    "description": "Item 18",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "18": {
                    "title": "Item 19",
                    "description": "Item 19",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                },
                "19": {
                    "title": "Item 20",
                    "description": "Item 20",
                    "image-path": "images/featured-topics-investments-fez.jpg",
                    "image-alt": "Win a Trip to Brazil image",
                    "cta": "Learn More",
                    "link": "more/en/"
                }
            }
        },
        template, html, availableItems, seenItems, igls;

    function init() {

        igls = getLocalStorage(),
        availableItems = data.content;
        seenItems = {
          "0": {
              "title": "A lifetime of memories awaits!",
              "description": "Introduce a friend, collegue or a family member to an Investors Group Consultant to win a trip for two.",
              "image-path": "images/featured-topics-brazil.jpg",
              "image-alt": "Win a Trip to Brazil image",
              "cta": "Learn More",
              "link": "more/en/"
          },
          "7": {
            "title": "Item 8",
            "description": "Item 8",
            "image-path": "images/featured-topics-investments-fez.jpg",
            "image-alt": "Win a Trip to Brazil image",
            "cta": "Learn More",
            "link": "more/en/"
          }
        };

        //Will have to do a check later to see if this already exists in ls, 
        //but for POC I will do this
        igls['advice-stories'] = seenItems;

        generateTemplate(getRandEight(igls['advice-stories']));
    }

    function getLocalStorage() {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem("ig") ? JSON.parse(localStorage.getItem("ig")) : localStorage.setItem("ig", JSON.stringify({}));
        } else {
            console.warn('localstorage is not available!')
            return;
        }
    }

    function getRandEight(blackList) {
      var unseen = [];
      Object.keys(availableItems).forEach((key) => {
        if(!seenItems[key]) {
          unseen.push(availableItems[key]);
        }
      });
      return shuffle(unseen).splice(0, 8);
    }

    function generateTemplate(data) {

        template = `
        <div class="row ig-carousel carousel" data-dots="true" data-infinite="true" data-arrows="true" data-responsive='[{"breakpoint": 640, "settings": {"slidesToShow": 3}}]'>
            {{#content}}
            <div class="medium-4 columns">
              <figure>
                <a href="{{link}}">
                  <img src="{{image-path}}" alt="{{image-alt}}" />
                  <figcaption>
                    <h2>{{title}}</h2>
                    <p>{{description}}</p>
                    <p class="tertiary-cta">{{cta}}</p>
                  </figcaption>
                </a>
              </figure>
            </div>
            {{/content}}
        </div>`;

        var html = Mustache.to_html(template, { "content" : data } );
        $('.ig-shuffled-carousel').html(html);

        buildCarousel();
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function buildCarousel() {
        var prevArrow,
            nextArrow,
            $carousel;

        $('.ig-carousel').not('.slick-initialized').each(function(index) {

            $carousel = $(this);
            prevArrow = ($carousel.data('prevArrowText')) ? '<button type="button" class="slick-prev"><span class="show-for-sr">' + $carousel.data('prevArrowText') + '</span></button>' : '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>';
            nextArrow = ($carousel.data('nextArrowText')) ? '<button type="button" class="slick-next"><span class="show-for-sr">' + $carousel.data('nextArrowText') + '</span></button>' : '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>';

            $carousel.slick({
                adaptiveHeight: $carousel.data('adaptiveHeight') || false,
                arrows: $carousel.data('arrows') || false,
                autoPlay: $carousel.data('autoPlay') || false,
                dots: $carousel.data('dots') || false,
                fade: $carousel.data('fade') || false,
                infinite: $carousel.data('infinite') || false,
                mobileFirst: true,
                nextArrow: nextArrow,
                prevArrow: prevArrow,
                responsive: $carousel.data('responsive') || '',
                slide: $carousel.data('slide') || '',
                slidesToScroll: $carousel.data('slideToScroll') || 1,
                slidesToShow: $carousel.data('slidesToShow') || 1,
                speed: $carousel.data('speed') || 300,
            })
        });
    }

    return {
        init
    };
})()
