

var appContainer = document.querySelector('#app-container')
var contentArea = document.querySelector('.content-area')

var BooksModel = Backbone.Model.extend({
   parse: function(parsedRes){
      return parsedRes.volumeInfo
   },

   url: 'https://www.googleapis.com/books/v1/volumes?q=subject'

})

var BookCollection = Backbone.Collection.extend({
   model: BooksModel,
   parse: function(rawJSONRes){
      return rawJSONRes.items
   },
   url: '',

   initialize: function(someCat){
      console.log(someCat)
      this.url = "https://www.googleapis.com/books/v1/volumes?q=subject" + someCat
   }
})

var AppRouter = Backbone.Router.extend({
   routes: {
      "category/:specificCat" : "showSubCategory",
      "category/:generalCat" : "showGeneralCategory",
      "" : "showHome"
   },

   showHome: function(){

      var categoryListings = [
         {catName: "Fiction" , subcatList: ['Drama','Literature','Mystery', 'Poetry','Romance'] },
         {catName: "Nonfiction" ,   subcatList: ['Biography', 'Business', 'Education', 'Health', 'Philosophy', 'Self-Help'] },
         {catName: "Miscellaneous" ,   subcatList: ['Cooking','Crafts','Espanol', 'Medicine'] },
      ]

      categoryListings.forEach(function(genreObj, i){

         var bigStr = "<div class='col-sm-4'><h3><a href='#category/" + genreObj.catName + "'>" + genreObj.catName + "</a></h3>"

         for (var i = 0; i < genreObj.subcatList.length; i++){
            bigStr += "<p><a href='#category/" + genreObj.subcatList[i].toLowerCase() + "'>" + genreObj.subcatList[i] + "</a></p>"
         }
         bigStr += "</div>"

         contentArea.innerHTML += bigStr
      })


   },

   showGeneralCategory: function(genCat){
      var collInstance = new BookCollection(genCat)

      collInstance.fetch().then(function(){
         var bigStr = "<div class='row'><div class='col-sm-10 left-side'>"


         collInstance.models.forEach(function(bookObj){

            bigStr += "<div class='col-sm-3'>"
            bigStr += "<div class='thumbnail'>"
            bigStr += "<img src=" + bookObj.get('imageLinks').thumbnail + ">"
            bigStr += "<div class='caption'>"
            bigStr += "<p>" + bookObj.get('title') + "</p>"
            bigStr += "</div>"
            bigStr += "</div>"
            bigStr += "</div>"
         })

         bigStr += "</div><div class='col-sm-2 right-side'>"
         bigStr += "<h4>Side Menu Here</h4>"
         bigStr += "</div>"

         contentArea.innerHTML = bigStr
      })
   },

   showSubCategory: function(subCat){
      var collInstance = new BookCollection(subCat)
      console.log(subCat)
      collInstance.fetch().then(function(){
         var bigStr = "<div class='row'><div class='col-sm-10 left-side'>"


         collInstance.models.forEach(function(bookObj){

            var imageLinks = bookObj.get('imageLinks')

            if (typeof imageLinks === "undefined"){
               var bookImg = './images/file-not-found.png'
            } else {
               var bookImg = imageLinks.thumbnail
            }

            bigStr += "<div class='col-sm-3'>"
            bigStr += "<div class='thumbnail'>"
            bigStr += "<img src=" + bookImg + ">"
            bigStr += "<div class='caption'>"
            bigStr += "<p>" + bookObj.get('title') + "</p>"
            bigStr += "</div>"
            bigStr += "</div>"
            bigStr += "</div>"
         })

         bigStr += "</div><div class='col-sm-2 right-side'>"
         bigStr += "<h4>Side Menu Here</h4>"
         bigStr += "</div>"

         contentArea.innerHTML = bigStr
      })
   },


   initialize: function(){
      Backbone.history.start()
   }
})


var booksContainer = document.querySelector('.books-container')

var app = new AppRouter()
