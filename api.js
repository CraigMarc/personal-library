/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String],
  commentcount: Number
});

const Book = mongoose.model("Books", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, data) => {
        if (err) console.log(err);
        else res.send(data);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      console.log("post title:", title, "EOL");
      if (!title) {
        console.log("here")
        res.send("missing required field title");
      }
      else {
        console.log("or here?")
        let newBook = new Book({
          title: title,
          comments: [],
          commentcount: 0
        });
        newBook.save((err, data) => {
          if (err) console.log(err);
          else res.send({
            _id: data._id,
            title: data.title
          });
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if (err) console.log(err);
        else res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.find({_id: bookid}, (err, data) => {
        if (err) console.log(err);
        else if (!!data[0]) res.send(data[0]);
        else res.send("no book exists");
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) res.send("missing required field comment");
      else {
        Book.findById(bookid, (err, data) => {
          if (err || data === null) res.send("no book exists");
          else {
            data.comments.push(comment);
            data.commentcount += 1;
            data.save((err, data) => {
              if (err) console.log(err);
              else res.send(data);
            });
          }
        });
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({_id: bookid}, (err, data) => {
        if (err) console.log(err);
        else if (data.deletedCount === 0) res.send("no book exists")
        else res.send("delete successful");
      });
    });
  
};
