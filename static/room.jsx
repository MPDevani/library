class Room extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}


	handleClick(event){
		event.preventDefault();
		let element = event.target;
		let id = Number(element.dataset.index);
		let roomRented = this.props.rooms[id];
		let user = this.props.user
		user.bookRoom(roomRented, function(roomRented){
			ReactDOM.render(<Directory/>,
		 		document.getElementById('app'))
		})
	}

	render(){
		let clickHandler = this.handleClick
		let roomRental = this.props.rooms.map(function(room, index){
			if(room.availability === true){
				return(
				<div key ={'room_' + index}> </div>
			)} else {
			return( 
			 <div key = {'room_' + index}>
              <h2>{room.description}</h2>
              <button onClick= {clickHandler} data-index={index}>
              Book Room
              </button>
            </div> 
			)}
		})

		return(
		<div>	
			<h1>Room Rental</h1>
			{roomRental}
		</div>	
	)}
}