const express = require('express')
const app = express()
const {Book} = require('./book.js')
const {Users} = require('./users.js')
const {History} = require('./userhistory.js')
const {Rooms} = require('./rooms.js')
const {Booking} = require('./booking.js')

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    database : 'myapp_test'
  }
});

let books = [
new Book('Harry Potter','Boy Wizard', 0,1, 1),
new Book('Lord of the Rings','stupid ring', 0,2, 1),
new Book('Pride and Prejudice', 'annoying guy', 0,3, 1)
]

let roomRental = [
	new Rooms('Room One',false, 1),
	new Rooms('Room Two',false, 2),
	new Rooms('Room Three',false, 3)
]
let nextRoomId = 4
let nextIdNumber = 4

let users = {
	'Shehzan': new Users('Shehzan', 1),
	'Maria': new Users('Maria', 2)
}

let nextUserId = 3

let checkoutHistory = []
let bookRoom = []
let nextBookingId = 0
nextCheckoutID = 0

app.get('/books', function(req,res){
	knex.select().table('books').then(function(bookData){
		let allBooks = bookData.map(function(bookData){
			return new Book(bookData.title,
							bookData.description,
							bookData.checkedout,
							bookData.id,
							bookData,quantity);
		}
	}
	res.json(books)
})

app.get('/rooms', function(req,res){
	res.json(roomRental)
})

app.post('/user/:user_id/room/:room_id', function(req,res){
	let user
	let room

	for(let userName in users){
		let userElem = users[userName]
		if(userElem.id === Number(req.params.user_id)){
			user = userElem
		}
	}
	if(!user) {
		res.json({error:'User not found'})
			return;
	}

	roomRental.map(function(roomElem){
		if(roomElem.id === Number(req.params.room_id)){
			room = roomElem
		}
	})

	if(!room){
		res.json({error:'Room not found'})
		return;
	}
	room.availability = true
	let roomBooking = new Booking(nextBookingId++,user.id,room.id)
	bookRoom.push(roomBooking)
	res.json({success:'success'})
})

app.get('/user/:user_id/rooms', function(req,res){
	let user
	for(let userName in users){
		let userElem = users[userName]
		if(userElem.id = Number(req.params.user_id)){
			user = userElem
		}
	}

	if(!user){
		res.json({error: "User is not found"})
		return;
	}

	let bookedRooms = bookRoom.filter(function(record){
		return record.userId === user.id
	}).map(function(record){
		let room;
		roomRental.forEach(function(roomElem){
			if(roomElem.id === record.roomId){
				room = roomElem;
			}
		})
		return room;
	}).filter(function(room){
		return room !== undefined;
	})
	res.json({
		success: 'Room was found',
		rooms: bookedRooms
	})

})

app.delete('/user/:user_id/room/:room_id', function(req,res){
	for(let i = 0; i < bookRoom.length; i++){
		let roomRented = bookRoom[i]
		if(roomRented.userId === Number(req.params.user_id) &&
			roomRented.roomId === Number(req.params.room_id)){
				bookRoom.splice(i, 1)
		}
	}
	roomRental.forEach(function(room){
		if(room.id === Number(req.params.room_id)){
			room.availability = false
			console.log(room.availability)
		}
		
	})
	res.json({success: "Deleted record."})
})


app.post('/book', function(req,res){
	let title = req.body.data.title
	let description = req.body.data.description
	let checkedOut = 0;
	let id = nextIdNumber
	nextIdNumber++
	let quantity = Number(req.body.data.quantity)
	let donatedBook = new Book(title, description, checkedOut, id, quantity)
	books.push(donatedBook)
	res.json(donatedBook)

})

app.post('/user', function(req,res){ //why not use get request?
	let userName = req.body.userName
	if(!users[userName]){
		users[userName] = new Users(userName,nextUserId)
		nextUserId++
	}
	res.json(users[userName])
})



app.post('/user/:user_id/book/:book_id', function(req,res){
	let user;
	let book;

	books.map(function(bookElem){
		if(bookElem.idNumber === Number(req.params.book_id)){
			book = bookElem
		}	
	})
	if(!book){
		res.json({error: "Book is not found"})
		return;
	}

	for(let userName in users){
		let userElem = users[userName]
		if(userElem.id === Number(req.params.user_id)){
			user = userElem
		}
	}

	if(!user){
		res.json({error: "User is not found"})
		return;
	}

	book.checkedOut++
	let checkOut = new History(nextCheckoutID++,user.id, book.idNumber)
	checkoutHistory.push(checkOut)
	res.json({success: "Book was checked out."});
})

app.get('/user/:user_id/book', function(req,res){//talk through this again
	let user;

	for(let userName in users){
		let userElem = users[userName]
		if(userElem.id === Number(req.params.user_id)){
			user = userElem
		}
	}

	if(!user){
		res.json({error: "User is not found"})
		return;
	}

	let userBooks = checkoutHistory.filter(function(record){
		return record.userID === user.id;
	}).map(function(record){
		let book;
		books.forEach(function(bookElem){
			if(bookElem.idNumber === record.bookID){
				book = bookElem;
			}
		})
		return book;
	}).filter(function(book){
		return book !== undefined;
	})
	res.json({
		success: 'Books were found',
		books: userBooks
	})
})

app.delete('/user/:user_id/book/:book_id', function(req, res) {

	for (let i = 0; i < checkoutHistory.length; i++) {
		let historyRecord = checkoutHistory[i];
		if (historyRecord.userID === Number(req.params.user_id)
			&& historyRecord.bookID === Number(req.params.book_id)) {
			checkoutHistory.splice(i, 1); //explain this
		}
	}

	books.forEach(function(bookElem) {
		if (bookElem.idNumber === Number(req.params.book_id)) {
			bookElem.checkedOut--;
		}
	})

	res.json({success: "Deleted history record."});
})


app.use(express.static('static'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))


