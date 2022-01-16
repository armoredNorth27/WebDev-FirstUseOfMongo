let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];

userNames.forEach(name =>{
	let u = {};
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

//==================================================================================================//
//                              Old Database initializer information                                //
//==================================================================================================//

// let mongo = require('mongodb');
// let MongoClient = mongo.MongoClient;

//==================================================================================================//
//                                     New Database initializer                                     //
//==================================================================================================//

// Used for modified way of generating database
let mongoose = require('mongoose');
let User = require('./models/UserModel');
let db;

mongoose.connect('mongodb://localhost/a4', {useNewUrlParser: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log('Error dropping database:');
			console.log(err);
			return;
		}
		console.log('Dropped database. Starting re-creation.');

		// Ensures all user indices are initialized before any
		// users are added. This way the usernames can stay unique
		User.init((err) => {
			if(err) throw err;
			
			// Insert all users into the database
			User.insertMany(users, (err) => {
				if(err){
					console.log('Error inserting users.');
					throw err;
				}
				
				console.log(`${users.length} users added`);
				db.close();
			});
		})
	});
});

//==================================================================================================//
//                                     Old Database initializer                                     //
//==================================================================================================//

// MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
//   if(err) throw err;	

//   db = client.db('a4');
  
//   db.listCollections().toArray(function(err, result){
// 	if(result.length == 0){
// 		db.collection("users").insertMany(users, function(err, result){
// 		if(err){
// 			throw err;
// 		}
		
// 		console.log(result.insertedCount + " users successfully added (should be 10).");
// 		client.close();
// 	});
	
// 	return;
// 	}
	
// 	let numDropped = 0;
// 	let toDrop = result.length;
// 	result.forEach(collection => {
// 	db.collection(collection.name).drop(function(err, delOK){
// 		if(err){
// 			throw err;
// 		}
		
// 		console.log("Dropped collection: " + collection.name);
// 		numDropped++;
		
// 		if(numDropped == toDrop){
// 			db.collection("users").insertMany(users, function(err, result){
// 				if(err){
// 					throw err;
// 				}
				
// 				console.log(result.insertedCount + " users successfully added (should be 10).");
// 				client.close();
// 			});
// 		}
// 	});		
// 	});
//   });
// });