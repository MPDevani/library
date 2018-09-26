class Directory extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this)
		this.returnBook = this.returnBook.bind(this)
		this.updateInputName = this.updateInputName.bind(this)
		this.updateInputTitle = this.updateInputTitle.bind(this)
		this.updateInputDescription = this.updateInputDescription.bind(this)
		this.updateInputQuantity = this.updateInputQuantity.bind(this)
		this.donateBook = this.donateBook.bind(this)
		this.bookEdit = this.bookEdit.bind(this)
		let view = this
		this.state = {
			returnUserForm: {
				returnUserName:'insert your name here'
			},

			donateBookForm: { 
				title: 'insert title here',
				description: 'insert description here',
				quantity: 'insert quantity here'

			},

			books: []

		}
		Book.getAllBooks(function(books){
			view.state.books = books
			// TODO(maria): uncomment this line once we use server side.
			view.setState(view.state)
		})
		
	}

	handleClick(event) {
		let element = event.target;
		let id = Number(element.dataset.index);
		let book = this.state.books[id];
		console.log(book);
		// 1) We need to find the element that the person clicked
		// 2) We need to find the book that the element represents
		// 3) We need to pass the book to the checkout component

		ReactDOM.render(<Checkout book={book}/>, document.getElementById('app'))
	}

	returnBook(event){
		event.preventDefault();
		User.getUserByName(this.state.returnUserForm.returnUserName, function(user) {
			user.getAllBooksByUser(function(books) {
				ReactDOM.render(<Return user={user} books={books}/>, document.getElementById('app'))
			})
		})
	}

	updateInputName(event){
		this.state.returnUserForm.returnUserName = event.target.value
		this.setState(this.state)
	}

	updateInputTitle(event){
		this.state.donateBookForm.title = event.target.value
		this.setState(this.state)
	}

	updateInputDescription(event){
		this.state.donateBookForm.description = event.target.value
		this.setState(this.state)
	}

	updateInputQuantity(event){
		this.state.donateBookForm.quantity = event.target.value
		this.setState(this.state)
	}

	bookEdit(event){
		let element = event.target;
		let id = Number(element.dataset.index);
		let book = this.state.books[id];
		ReactDOM.render(<EditedBooks book={book}/>, document.getElementById('app'))
	}

	donateBook(event){
		event.preventDefault();
		let donateBookForm = new Book(this.state.donateBookForm.title, this.state.donateBookForm.description, 0, Number(this.state.donateBookForm.quantity))
		let view = this
		for(let i = 0; i < this.state.books.length; i++){
			if(this.state.books[i].title === this.state.donateBookForm.title){
				this.state.books[i].quantity += donateBookForm.quantity;
				this.state.books[i].update(function(){
					view.setState(view.state)
				})
				this.state.donateBookForm = {
					title: "",
					description: "",
					quantity: ""
				}
				this.setState(this.state)
				return;
			}
		}	 

		donateBookForm.save(function(book){
			view.setState(view.state);
		})
		this.state.donateBookForm = {
			title: "",
			description: "",
			quantity: ""
		}
		this.setState(this.state)
	}

	render(){
		let clickHandler = this.handleClick
		let bookEdits = this.bookEdit
		let returns = this.returnBook
		let donateBook = this.donateBook
		console.log(this.state.books)
		let bookList = this.state.books.map(function(list, index){
			if(list.checkedOut == list.quantity){
				return(
				<div key ={'list_' + index}> </div>)
			} else {
			return( 
			 <div key = {'list_' + index}>
              <h2>{list.title}</h2>
              <p>{list.description}</p>
              <p>Qty: {list.quantity}</p>
              <button onClick= {clickHandler} data-index={index}>
              Check Out
              </button>
               <button onClick= {bookEdits} data-index={index}>
              Edit Book Information
              </button>
            </div> 
			)}})



		return(
		<div>	
			<h1>Library Directory</h1>
			{bookList}
			<form onSubmit = {returns}>
              <br/>
				Returns (enter your name): <input type = 'text' value= {this.state.returnUserForm.returnUserName} onChange={event => this.updateInputName(event)}/>
				<input type = 'Submit'/>
			</form>
			<br/>
			<form onSubmit = {donateBook}>
              <br/>
				Donate Book: 
				<br/>
				Title <input type = 'text' value= {this.state.donateBookForm.title} onChange={event => this.updateInputTitle(event)}/>
				<br/>
				Description <input type = 'text' value= {this.state.donateBookForm.description} onChange={event => this.updateInputDescription(event)}/>
				<br/>
				Quantity <input type = 'text' value= {this.state.donateBookForm.quantity} onChange={event => this.updateInputQuantity(event)}/>
				<br/><br/><input type = 'Submit'/>
			</form>
		</div>	
	)}
}