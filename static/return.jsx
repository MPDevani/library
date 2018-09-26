class Return extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		
	}

	handleClick(event) {
			event.preventDefault();
			let user = this.props.user;
			let element = event.target;
			let id = Number(element.dataset.index)
			let book = this.props.books[id]
			user.returnBook(book, function(book) {
				ReactDOM.render(<Directory/>,
		  			document.getElementById('app'))
			})
		}

	render(){
		let clickHandler = this.handleClick
		let user = this.props.user;
		let books = this.props.books
		console.log(user)
		console.log(books)
		let listOfBooks = books.map(function(book, index){
			return( 	
			 <div key = {'book_' + index}>
              <h2>{book.title}</h2>
              <button onClick = {clickHandler} data-index={index}>
              Return
              </button>
            </div> 
		)})

		return(
		<div>
			{listOfBooks}		
		</div>	
	)}
}