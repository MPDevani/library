class Book {
	constructor(title, description,checkedOut, id, quantity) {
		this.title = title;
		this.description = description
		this.checkedOut =  checkedOut
		this.id = id
		this.quantity = quantity
	}

	save(callback){
		$.post('/book', function(data){
			data: this
		}, callback); 
	} // explain what data:this would do..

	update(callback) {
		callback(this);
	}


	static getAllBooks(callback){
		$.get('/books',function(data){
			let books = data.map(function(book){
				return new Book(
					book.title,
					book.description,
					Number(book.checkedOut),
					Number(book.idNumber),
					Number(book.quantity)
					)
			})
			callback(books)	
		})
	}
}



