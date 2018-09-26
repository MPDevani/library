class User {
	constructor(name, id) {
		this.name = name;
		this.id = id;
		
	}

	checkoutBook(book, callback){
	$.post('/user/' + this.id + '/book/' + book.id, function(data) {
			if (data.error) {
				console.log("Checkout failed: " + data.error)
				callback(false);
			} else {
				console.log("Checkout succeeded: " + data.success)
				callback(true);
			}
		})
	}


	returnBook(book, callback){ //explain ajax
		$.ajax({
			url: '/user/' + this.id + '/book/' + book.idNumber,
			type: 'DELETE',
			success: callback
		})
	}
	
	getAllBooksByUser(callback){ //explain why this is so different from checkoutBook
	$.get('/user/' + this.id + '/book', function(data){
		if(data.error){
			console.log(data.error)
		} 
			callback(data.books)
	})
	
}

	// This function will retrieve the user with the given name from the server.
	// If the user is not stored on the server, it will create a new user.
	// Once the user is retrieved, we will create an instance of User and
	// pass it into the callback function.
	// Usage: User.getUserByName("Maria", function(user) {
	//    console.log(user.name);
	// })
	static getUserByName(name, callback){
		$.post('/user',{userName: name},function(data){
			callback(new User(data.name, data.id))
		})
	}
}

