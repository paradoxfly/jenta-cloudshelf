const express = require('express');
const user = express.Router()
const path = require('path')
const   { requestStore }  = require('../database/database')
const { profileStore } = require('../database/database')
const pdf = require('pdf-thumbnail')
const fs = require('fs')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/Upload Requests/")
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
var upload = multer({storage: storage})

//This handles the logging in of the user
user.post('/login', (request, response)=>{
	console.log(request.body)
	let u = request.body.username
	let p = request.body.password
	profileStore.find({username: u}, (error, data) =>{		//Checks if username exists
		if(data.length == 0){			//Username doesnt exist
			response.json({
				successful: false,
				error: "username",
				comment: "Username does not exist"
			})
		}
		else{ 			//Username exists
			profileStore.find({username: u, password: p}, (error, data)=>{			//Checks if password matches username
				if(data.length == 0){				//Password doesnt match username
					response.json({
						successful: false,
						error: "password",
						comment: "Invalid Password"
					})
				}
				else{
					//console.log(data)
					response.json({
						username: u,
						successful: true,
						id: data[0]["_id"]
					})
				}
			})
		}
	})
})

//This handles the creation of a new user profile
user.post('/signup', (request, response)=>{
	console.log(request.body)
	let u = request.body.username
	profileStore.find({username: u}, (error, data) =>{		//Checks if username already exists
		if(data.length == 0){					//Username doesn't exist and hence, profile can be created
			profileStore.insert({
				username: request.body.username,
				password: request.body.password
			})
			response.json({
				username: request.body.username,
				password: request.body.password,
				successful: true
			})
		}
		else{ 												//Username already exists
			console.log("Username already exists")
			response.json({
				successful: false,
				comment: "Username already exists"
			})
		}
	})
})

//Handle data from client-side profile page
user.post('/profile', (request, response)=>{
	// console.log(request.body)
	profileStore.find(request.body, (error, data)=>{
		if(data.length == 0){
			console.log("Not found")
			response.end()
		}
		else{
			console.log(data)
			response.json({
				username: data[0]["username"]
			})
		}
	})
})

//This handles book upload requests made by the user
user.post('/upload', upload.single('upload request'), (request, response)=>{
    // request.body.cv = `https://oztekoil-api.herokuapp.com/download/${request.file.originalname}`
    // request.body.cv = `http://localhost:3000/download/books/${request.body.category}/${request.file.originalname}`
	var fileNameNoExtension = request.file.originalname.slice(0, request.file.originalname.length-4)
	request.body['Book'] = `http://localhost:3000/Upload Requests/${request.file.originalname}`
	request.body['Thumb'] = `http://localhost:3000/Upload Requests/_thumbs/${fileNameNoExtension}.jpg`
	request.body['server_Book'] = `./public/Upload Requests/${request.file.originalname}`
	request.body['server_Thumb'] = `./public/Upload Requests/_thumbs/${fileNameNoExtension}.jpg`
	console.log(request.body)
	// console.log(request.file)
	const pdfBuffer = fs.readFileSync(`./public/Upload Requests/${request.file.originalname}`)
	pdf(pdfBuffer, {
		resize: {
			width: 612,
			height: 792
		}
	}).then( data => {
		data.pipe(fs.createWriteStream(`./public/Upload Requests/_thumbs/${fileNameNoExtension}.jpg`))
	}).catch(error => console.log(error))
	requestStore.insert(request.body)
    response.json({status: "OK"})
})


module.exports = user