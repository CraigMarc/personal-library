/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const badId = '5871dda29faedc3491ff93bb'


chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

  const testBook = {
      _id: null,
      title: "Test",
      comments: []
    };


    suite('POST /api/books with title => create book object/expect book object', function() {
     /*1*/ 
      test('Test POST /api/books with title', function(done) {

chai
.request(server)
.keepOpen()
.post('/api/books')
.send({title: 'title'})
    .end(function(err, res) {
      testBook._id = res.body._id;
      assert.equal(res.status, 200)
      assert.equal(res.body.title, 'title')
     
      
    done()
    })
  
        //done();
      });
     /*2*/ 
      test('Test POST /api/books with no title given', function(done) {

chai
.request(server)
.keepOpen()
.post('/api/books')
.send({title: ''})
    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'missing required field title')
     
      
    done()
    })




        
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      /*3*/
      test('Test GET /api/books',  function(done){

chai
.request(server)
.keepOpen()
.get('/api/books')

    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.isArray(res.body)
    done()
    })



        
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      /*4*/
      test('Test GET /api/books/[id] with id not in db',  function(done){
chai
.request(server)
.keepOpen()
.get('/api/books/' + badId)

    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'no book exists')
    done()
    })


        
        //done();
      });
      /*5*/
      test('Test GET /api/books/[id] with valid id in db',  function(done){
    const validId = testBook._id;

chai
.request(server)
.keepOpen()
.get('/api/books/' + validId)

    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments', 'Book should contain comments array');
    done()
    })
        
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      /*6*/
      test('Test POST /api/books/[id] with comment', function(done){
const validId = testBook._id;
chai
.request(server)
.keepOpen()
.post('/api/books/' + validId)
.send({comment: 'comment'})
    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, 'comments', 'Book should contain comments array');
      
    done()
    })



        
        //done();
      });
/*7*/
      test('Test POST /api/books/[id] without comment field', function(done){
const validId = testBook._id;
chai
.request(server)
.keepOpen()
.post('/api/books/' + validId)
  /*
.send({comments: ''})*/
    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'missing required field comment')
     
      
    done()
    })



        
        //done();
      });
/*8*/
      test('Test POST /api/books/[id] with comment, id not in db', function(done){

chai
.request(server)
.keepOpen()
.post('/api/books/' + badId)
.send({comment: 'comment'})
    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'no book exists')
     
      
    done()
    })


        
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
/*9*/
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
 const validId = testBook._id;
chai
.request(server)
.keepOpen()
.delete('/api/books/' + validId)

    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'delete successful')
     
      
    done()
    })



        
        //done();
      });
/*10*/
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
chai
.request(server)
.keepOpen()
.delete('/api/books/' + badId)

    .end(function(err, res) {
      assert.equal(res.status, 200)
      assert.equal(res.text, 'no book exists')
     
      
    done()
    })





        
        //done();
      });

    });

  });

});
