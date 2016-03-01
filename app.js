(function(){
  "use strict";


  var Moosipurk = function(){

    // SINGLETON PATTERN (4 rida)
    if(Moosipurk.instance){
      return Moosipurk.instance;
    }
    Moosipurk.instance = this; // this viitab moosipurgile

    this.routes = Moosipurk.routes;

    console.log(this);
    //console.log('moosipurgi sees');

    // KÕIK MUUTUJAD, mis on üldised ja muudetavad
    this.currentRoute = null; // hoian meeles mis lehel olen (home-view, ...)
    this.interval = null;
    //hakkan hoidma k6iki purke
    this.jars = [];


    //panen rakenduse tööle
    this.init();
  };

  // kirjeldatud kõik lehed
  Moosipurk.routes = {
    "home-view": {
      render: function(){
        // käivitan siis kui jõuan lehele
        console.log('JS avalehel');

        // kui olemas, teen nulliks
        if(this.interval){ clearInterval(this.interval); }

        // kui jõuan avalehele siis käivitub timer, mis hakkab trükkima kulunud sekundeid
        // divi sisse #counter
        // hakkab 0st
        var seconds = 0;
        this.interval = window.setInterval(function(){
          seconds++;
          document.querySelector('#counter').innerHTML = seconds;
        }, 1000); //iga 1000ms tagant käivitub

      }
    },
    "list-view": {
      render: function(){
        console.log('JS loendi lehel');

      }
    },
    "manage-view": {
      render: function(){
        console.log('JS halduse lehel');

      }
    }
  };

  //kõik moosipurgi funktsioonid tulevad siia sisse
  Moosipurk.prototype = {
    init: function(){
      console.log('rakendus käivitus');
      // Siia tuleb esialgne loogika

      window.addEventListener('hashchange', this.routeChange.bind(this));

      //vaatan mis lehel olen, kui ei ole hashi lisan avalehe
      console.log(window.location.hash);
      if(!window.location.hash){
        window.location.hash = "home-view";
      }else{
        //hash oli olemas, käivitan routeChange fn
        this.routeChange();
      }

      //saan k2tte purgid localStorage kui on (on see muutuja, mis me salvestasime all, olemas)
      if(localStorage.jars){
        //v6tan stringi ja teen tagasi objektideks
        this.jars = JSON.parse(localStorage.jars);
        console.log('laadisin localStoragist massiivi' + this.jars.length);//mitu

        //tekitan loendi html
        this.jars.forEach(function(jar){
          //isak2ivitav funktsioon

          var new_jar = new Jar(jar.title, jar.ingredients);
          document.querySelector('.list-of-jars').appendChild(li);

        });

      }


      // hakka kuulama hiireklõpse
      this.bindEvents();
    },
    bindEvents: function(){
      document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
     //kuulan trykkimist otsikastis (search)
     document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

    document.querySelector('.change-color').addEventListener('click', this.myFunction.bind(this));
    },

    search: function(event){
      //otsikasti vaartus
    var needle = document.querySelector('#search').value;
    console.log(needle);

    var list = document.querySelectorAll('ul.list-of-jars li');
    console.log(list);

    for(var i=0; i<list.length; i++){
      var li = list[i];
      // yhe list itemi sisu tekst
       var stack = li.querySelector('.content').innerHTML; //innerHTML annab sisu

       //kas otsiv s6na on sisus olemas
       if(stack.indexOf(needle) !== -1){
         //olemas
         li.style.display ='list-item';
       }else{
         //ei ole, index on -1
         li.style.display =none;
       }

    }
    },


    addNewClick: function(event){
      // lisa uus purk
      var title = document.querySelector('.title').value;
      var ingredients = document.querySelector('.ingredients').value;

    // console.log(title + ' ' + ingredients);

      var new_jar = new Jar(title, ingredients);
      // lisan massiivi purgi
      this.jars.push(new_jar); //new_jar on massiivi nimi (title)
      console.log(JSON.stringify(this.jars));// [{}]
      //JSONi strigina salvestan localStorage'see
       localStorage.setItem('jars', JSON.stringify(this.jars));
       //setItem v6tab vastu kaks asja : 'muutuja nimi' ja 'mida me salvestame'

      var li = new_jar.createHtmlElement();
      document.querySelector('.list-of-jars').appendChild(li);


    },
    routeChange: function(event){

      // slice võtab võtab # ära #home-view >> home-view
      this.currentRoute = window.location.hash.slice(1);

      // kas leht on olemas
      if(this.routes[this.currentRoute]){
        //jah

        this.updateMenu();

        console.log('>>> ' + this.currentRoute);
        //käivitan selle lehe jaoks ettenähtud js
        this.routes[this.currentRoute].render();
      }else{
        // 404?
        console.log('404');
        window.location.hash = 'home-view';
      }

    },

    updateMenu: function(){

      //kui on mingil menüül klass active-menu siis võtame ära
      document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace(' active-menu', '');

      //käesolevale lehele lisan juurde
      document.querySelector('.' + this.currentRoute).className += ' active-menu';

    },

    myFunction: function() {
        document.getElementById("manage-view").style.backgroundColor = "lightblue";
    }

  };



  var Jar = function(new_title, new_ingredients){
    this.title = new_title;
    this.ingredients = new_ingredients;
  };

  Jar.prototype = {
    createHtmlElement: function(){
      // anda tagasi ilus html


      // li
      //   span.letter
      //     M
      //   span.content
      //     Maasikamoos | maasikas, õun


      var li = document.createElement('li');

          var newElement = document.createElement("span");
          newElement.innerHTML = (Math.random()*100);
        /*  newElement.innerHTML = (function(){
            for (var i=0; i<newElement.length; i++){
              var li = newElement[i];
                var stack = li.querySelector('span').innerHTML; //innerHTML annab sisu
              }
            });
          */
          //  newElement.setAttribute("class", "id");
          //document.getElementsByTagName("h1")[0].setAttribute("class", "id");
            li.appendChild(newElement);

      var span = document.createElement('span');
      span.className = 'letter';

      var letter = document.createTextNode(this.title.charAt(0));
      span.appendChild(letter);

      li.appendChild(span);

      var content_span = document.createElement('span');
      content_span.className = 'content';

      var content = document.createTextNode(this.title + ' | ' + this.ingredients);
      content_span.appendChild(content);

      li.appendChild(content_span);

      console.log(li);

      return li;
    }
  };


  window.onload = function(){
    var app = new Moosipurk();
  };

})();
