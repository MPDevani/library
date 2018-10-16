class Rooms {
	constructor(description,availability, id) {
		this.description = description;
		this.availability = availability
		this.id = id;
		
	}


	static getAllRooms(callback){
		$.get('/rooms', function(data){
			let rooms = data.map(function(room){
				return new Rooms(
				room.description,
				room.availability,
				Number(room.id)
				)
			})
			callback(rooms)
		})
	}

}