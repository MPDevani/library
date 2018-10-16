class Unbook extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}


	handleClick(event){
		event.preventDefault();
		let element = event.target;
		let id = Number(element.dataset.index);
		let room = this.props.rooms;
		let user = this.props.user
		user.unbookRoom(room, function(roomRented){
			ReactDOM.render(<Directory/>,
		 		document.getElementById('app'))
		})
	}

	render(){
		let clickHandler = this.handleClick
		let user = this.props.user;
		let room = this.props.rooms
		let listOfRooms = room.map(function(room, index){
			return( 	
			 <div key = {'room_' + index}>
              <h2>{room.description}</h2>
              <button onClick = {clickHandler} data-index={index}>
              UnBook
              </button>
            </div> 
		)})

		return(
		<div>
			{listOfRooms}		
		</div>	
	)}
}