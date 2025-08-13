let board = null;
let context = null;


let player = null;
let controls = new Map();


let enemies = [];


let spawn_counter = 0;


window.onload = function() {
	board = document.getElementById("board");

	board.width = 800;
	board.height = 600;

	context = board.getContext("2d");


	player = {
		x: board.width / 6,
		y: board.height - 110,
	
	
		speed_x: 0,
		speed_y: 0,
		
	
		width: 65,
		height: 110,
	};


	requestAnimationFrame(game_loop);
}

function game_loop() {
	// handle input events
	document.addEventListener("keydown", function(event) {
		controls.set(event.key, true);
	});
	document.addEventListener("keyup", function(event) {
		controls.set(event.key, false);
	});


	// for player/enemies
	let gravity = 0.5;

	{ // control player
		// moving
		player.speed_x = 0;
		let move_speed = 6;
		
		if (controls.get("ArrowLeft")) {
			player.speed_x -= move_speed;
		}
		if (controls.get("ArrowRight")) {
			player.speed_x += move_speed;
		}


		// jumping
		let jump_force = -14;
		
		if (player.y >= board.height - player.height) {
			player.y = board.height - player.height;
			player.speed_y = 0;

			if (controls.get(" ")) {
				player.speed_y = jump_force;
			}
		} else { // apply gravity
			player.speed_y += gravity;
		}
	}


	player.x += player.speed_x;
	player.y += player.speed_y;


	if (player.x < 0) {
		player.speed_x = 0;
		player.x = 0;
	}
	if (player.x > board.width - player.width) {
		player.speed_x = 0;
		player.x = board.width - player.width;
	}



	spawn_counter --;
	if (spawn_counter <= 0) {
		spawn_counter = 120;


		let walk_speed = -7;

		let enemy = {
			x: board.width,
			y: board.height - 65,
		
		
			speed_x: walk_speed,
			speed_y: 0,
			
		
			width: 55,
			height: 65,
		};

		enemies.push(enemy);
	}


	for (let enemy of enemies) {
		if (enemy.y >= board.height - enemy.height) {
			enemy.y = board.height - enemy.height;
			enemy.speed_y = 0;

		} else { // apply gravity
			enemy.speed_y += gravity;
		}


		if (enemy.x < -enemy.width) {
			enemies.splice(enemies.indexOf(enemy), 1);
		}


		if (collide(player, enemy)) {
			window.location.reload();
		}


		enemy.x += enemy.speed_x;
		enemy.y += enemy.speed_y;
	}



	// drawing 
	context.beginPath();
	context.clearRect(0, 0, board.width, board.height);
	context.fill();



	// draw enemies
	for (let enemy of enemies) {
		context.beginPath();
		context.rect(
			enemy.x, enemy.y,
			enemy.width, enemy.height
		);
		
		context.fillStyle = "#FFA0A0";
		context.fill();
	}


	// draw player
	context.beginPath();
	context.rect(
		player.x, player.y,
		player.width, player.height
	);
	
	context.fillStyle = "#A0A0FF";
	context.fill();

	console.log(enemies.length)	
	requestAnimationFrame(game_loop);
}



function collide(object1, object2) {
	if (object1.x + object1.width < object2.x ||
		object2.x + object2.width < object1.x) {
		return false;
	}

	if (object1.y + object1.height < object2.y ||
		object2.y + object2.height < object1.y) {
		return false;
	}

	return true;
}
