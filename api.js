/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const express = require('express')
let bodyParser = require('body-parser');
let mongoose = require('mongoose')
const mySecret = process.env['DB']
mongoose.connect(mySecret , { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

module.exports = function (app) {

const bookSchema = new mongoose.Schema({

  title: {
    type: String,
     
  },

  commentcount: {
  type: Number,
   default: 0
},
  
  comments: {
    type: [String]
   
  }

  
})

let bookData = mongoose.model("bookData", bookSchema);
  

  app.route('/api/books')
    .get(async (req, res) => {
  try {

       const data = await bookData.find({});

  let dataArr = []
    
    
for (let i=0; i < data.length; i++) {
  dataArr.push(data[i])
}
 res.json(dataArr);

 
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
  }
     catch (err) {
    console.log(err);
  }   
    })
    
    .post(async (req, res) => {
  try {
      let title = req.body.title;
console.log(title)

if (!title) {
  res.send('missing required field title')
  return
}


    
const newBook = new bookData({
        title: title  
      });
 
    newBook.save().then(()=>{
       console.log("Document inserted succussfully :" + newBook);
return res.json({
             _id: newBook._id,
             title: newBook.title
                  
}) 
 }).catch((err)=>{
        console.log(err);
       res.json({ error: 'required field(s) missing' })
    })


      //response will contain new book object including atleast _id and title
  }
     catch (err) {
    console.log(err);
  } 
    })
    
    .delete(async (req, res) => {
  try {
bookData.deleteMany({})
.then(()=>{
       
res.send('complete delete successful')
    
  })
    
    
      //if successful response will be 'complete delete successful'
  }
  catch (err) {
    console.log(err);
  }     
    });



  app.route('/api/books/:id')
    
    .get(async (req, res) => {
  try {
      let bookid = req.params.id;
if (mongoose.isValidObjectId(bookid) == false) {
 res.send('no book exists')
  
  return
}
    
const bookById = await bookData.findOne({_id: bookid}) 
if (!bookById) {
  res.send('no book exists')
}
else {   
res.json ({_id: req.params.id, title: bookById.title, comments: bookById.comments})
}
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
  }
    catch (err) {
    console.log(err);
  }       
    })
    
    .post(async (req, res) => {
  try {
      let bookid = req.params.id;
      let comment = req.body.comment;
console.log(req.body)
if (!comment) {
  res.send('missing required field comment')
  return
}

if (mongoose.isValidObjectId(bookid) == false) {
 res.send('no book exists')
  
  return
}

const data = await bookData.findById(bookid);
if (!data) {
res.send('no book exists')
    return
}
const bookById = await bookData.findOne({_id: bookid})
  let count = bookById.commentcount + 1
  bookById.comments.push(comment)

  bookData.findOneAndUpdate({_id: bookid}, {commentcount: count, comments: bookById.comments}, { new: true })

 .then(()=>{
   res.json ({_id: bookid, title: bookById.title, comments: bookById.comments})

       console.log('successfully updated:' + bookById); 
 
  })
    .catch((err)=>{
  return res.json({ error: 'could not update', '_id': req.body._id });
        console.log(err);
      
    })                    


      //json res format same as .get
  }
    catch (err) {
    console.log(err);
  }         
    })
    
    .delete(async (req, res) => {
  try {
      let bookid = req.params.id;

if (mongoose.isValidObjectId(bookid) == false) {
 res.send('no book exists')
  
  return
}


const bookById = await bookData.findOne({_id: bookid}) 
if (!bookById) {
  res.send('no book exists')
}

bookData.findByIdAndRemove(bookid)
.then(()=>{
       
res.send('delete successful')
    
  })
 

    
      //if successful response will be 'delete successful'
  }
  catch (err) {
    console.log(err);
  }             
    });









  
};
