const express = require('express');
const admin = express.Router()
const path = require('path')
const pdf = require('pdf-thumbnail')
const fs = require('fs')
const { bookStore } = require('../database/database')
const { requestStore } = require('../database/database')
const multer = require('multer');
const { request } = require('http');
const { response } = require('express');



//Initialize file handling middleware for handling book uploads

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/books/_temp/")
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
var upload = multer({storage: storage})
//Hard-coded admin username and password
const AdminUsername = "jentacloud"
const AdminPassword = "jentacloud"

admin.post('/login', (request, response)=>{
	console.log(request.body)
	let u = request.body.username
	let p = request.body.password
	
		if(u != AdminUsername){			//Username doesnt match
			response.json({
				successful: false,
				error: "username",
				comment: "Username does not exist"
			})
		}
		else{ //Username exists
				if(p != AdminPassword){				//Password doesnt match username
					response.json({
						successful: false,
						error: "password",
						comment: "Invalid Password"
					})
				}
				else{ //Username and password are correct
					response.json({
						username: u,
						successful: true,
					})
				}
		}
})

//This handles book uploads made by admins
admin.post('/upload', upload.single('book upload'), (request, response)=>{
	var fileNameNoExtension = request.file.originalname.slice(0, request.file.originalname.length-4)
	request.body['Book'] = `http://localhost:3000/Books/${request.body.Category}/${request.file.originalname}`
	request.body['Thumb'] = `http://localhost:3000/Books/_thumbs/${fileNameNoExtension}.jpg`
	request.body.reads = 0
	request.body['server_Book'] = `./public/Books/${request.body.Category}/${request.file.originalname}`
	request.body['server_Thumb'] = `./public/Books/_thumbs/${fileNameNoExtension}.jpg`
	console.log(request.body)
	// console.log(request.file)
	const pdfBuffer = fs.readFileSync(`./public/Books/_temp/${request.file.originalname}`)
	pdf(pdfBuffer, {
		resize: {
			width: 612,
			height: 792
		}
	}).then( data => {
		data.pipe(fs.createWriteStream(`./public/Books/_thumbs/${fileNameNoExtension}.jpg`))
	}).catch(error => console.log(error))
	fs.rename(`./public/Books/_temp/${request.file.originalname}`, `./public/Books/${request.body.Category}/${request.file.originalname}`, error=>{
		if (error) throw error
		console.log("File successfully moved")
	})
	bookStore.insert(request.body)
    response.json({status: "OK"})
})

//This sends all the upload requests to the upload-request page for the admin to handle
admin.get('/request', (request, response) =>{
	requestStore.find({}, (error, docs)=>{
        if (!error){
            response.json({status: "OK", data: docs})
        }
        else {
           response.json({status: "fetch request acknowledged but unsuccessful. Database error"})
        }
    })
})

//This handles accepted upload requests made by normal users
admin.post('/request', (request, response) =>{
	console.log(request.body)
	if(request.body.adjusted){
		let data = {
			Uploader: request.body.Uploader,
			Title: request.body.Title,
			Author: request.body.Author,
			Description: request.body.Description,
			Category: request.body.Category,
			Book: `http://localhost:3000/Books/${request.body.Category}/${request.body.Title}.pdf`,
			Thumb: `http://localhost:3000/Books/_thumbs/${request.body.Title}.jpg`,
			server_Book: `./public/Books/${request.body.Category}/${request.body.Title}`,
			server_Thumb: `./public/Books/_thumbs/${request.body.Title}.jpg`,
			reads: 0 
		}
		requestStore.remove({_id: request.body._id}, (error, numRemoved)=>{
			if (error) {
				console.log(error)
				response.json({status: "failed"})
			} else{
				fs.rename(request.body.oldBookPath, data.server_Book, error=>{
					if (error) throw error
					console.log("Book File successfully moved")
				})
				fs.rename(request.body.oldThumbPath, data.server_Thumb, error=>{
					if (error) throw error
					console.log("Thumb File successfully moved")
				})
				bookStore.insert(data)
				response.json({status: "successful"})
			}
		})
	} else{
		requestStore.findOne({_id: request.body._id}, (error, doc) => {
			let data = {
				Uploader: doc.Uploader,
				Title: doc.Title,
				Author: doc.Author,
				Description: doc.Description,
				Category: doc.Category,
				Book: `http://localhost:3000/Books/${doc.Category}/${doc.Title}.pdf`,
				Thumb: `http://localhost:3000/Books/_thumbs/${doc.Title}.jpg`,
				server_Book: `./public/Books/${doc.Category}/${doc.Title}.pdf`,
				server_Thumb: `./public/Books/_thumbs/${doc.Title}.jpg`,
				reads: 0 
			}
			requestStore.remove({_id: request.body._id}, (error, numRemoved)=>{
				if (error) {
					console.log(error)
					response.json({status: "failed"})
				} else{
					fs.rename(doc.server_Book, data.server_Book, error=>{
						if (error) throw error
						console.log("Book File successfully moved")
					})
					fs.rename(doc.server_Thumb, data.server_Thumb, error=>{
						if (error) throw error
						console.log("Thumb File successfully moved")
					})
					bookStore.insert(data)
					response.json({status: "successful"})
				}
			})
		})
	}
})

//This handles declined upload requests made by normal users
admin.delete('/request', (request, response) =>{
	console.log(request.body)
	requestStore.remove({_id: request.body._id}, {}, (error, numRemoved) =>{
		if (error) {
			console.log(error)
			response.json({status: "failed"})
		}
		else{
			fs.unlink(request.body.oldBookPath, (error) =>{
				if (error) throw error
				else console.log("successfully deleted book from request list")
			})
			fs.unlink(request.body.oldThumbPath, error=>{
				if (error) throw error
				else console.log("successfully deleted book's thumb from thumbs folder")
			})
			response.json({status: "successful"})
		}
	})
})

//This sends all books to the main page
admin.get('/books', (request, response)=>{
	bookStore.find({}, (error, docs)=>{
        if (!error){
            response.json({status: "OK", data: docs})
        }
        else {
           response.json({status: "fetch request acknowledged but unsuccessful. Database error"})
        }
    })
})

//This adds +1 to the reads of a book everytime its opened
admin.post('/reads', (request, response)=>{
	bookStore.findOne({_id: request.body._id}, (error, doc)=>{
		if (error) console.log(error)
		else{
			var newRead = doc.reads + 1
			bookStore.update({_id: request.body._id}, {$set: {reads: newRead}}, (error, numReplaced)=>{
				if (error) console.log(error)
				else {
					console.log("number of reads successfully updated")
					response.send({status: "successful"})
				}
			})
		}
	})
})

//This deletes a book from the library
admin.delete('/book', (request, response)=>{
	console.log(request.body)
	bookStore.remove({_id: request.body._id}, {}, (error, numRemoved) =>{
		if (error) {
			console.log(error)
			response.json({status: "failed"})
		}
		else{
			fs.unlink(request.body.book, (error) =>{
				if (error) throw error
				else console.log("successfully deleted book from library")
			})
			fs.unlink(request.body.thumb, error=>{
				if (error) throw error
				else console.log("successfully deleted book's thumb from thumbs folder")
			})
			response.json({status: "successful"})
		}
	})
})
module.exports = admin