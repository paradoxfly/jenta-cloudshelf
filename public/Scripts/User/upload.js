// Fetch user's name
const profileName = document.getElementById("profile-name")
const profileID = location.search.slice(1)
var profilename = ""
let data = {_id: profileID}
options = {
	method: 'POST',
	headers:{
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
}	
fetch('/profile', options)
	.then(response => response.json())
	.then(data => {
        profileName.innerHTML = data.username
        profilename = data.username
	})
	.catch(error => console.log(error))

//Initialize back button
const backButton = document.getElementById("back-button")
backButton.addEventListener("click", event =>{
    location.replace("http://localhost:3000/user/profile.html?" + profileID)
})

const Title = document.getElementById("title")
const Author = document.getElementById("author")
const Description = document.getElementById("description")
const Category = document.getElementsByName("category")
const Book = document.getElementById("inputfile")
const Submit = document.getElementById("submit")

const importantElements = ["title", "author", "description", "inputfile"]

Submit.addEventListener("click", event =>{
    event.preventDefault()
    clearWarnings()
    first: if (noFieldIsEmpty()){
        // console.log(Title.value)
        // console.log(Author.value)
        // console.log(Description.value)
        // console.log(fetchChecked(Category))
        console.log(Book.files[0])
        let file = Book.files[0]
        let sections = file.name.split('.');
        let file_extension = sections[sections.length - 1];

        //ensures that the cv is in pdf, doc or docx format
        if(!/pdf/i.test(file_extension)){
            document.getElementById("uploadErrorText").innerHTML = "Only files in pdf format are supported*";
            break first
        }

        //Attach all of the form data to a "formData" object
        var bookTitle = Title.value + ".pdf"
        const formData = new FormData()
        formData.append("Uploader", profilename)
        formData.append("Title", Title.value)
        formData.append("Author", Author.value)
        formData.append("Description", Description.value)
        formData.append("Category", fetchChecked(Category))
        formData.append("upload request", file, bookTitle)

        for (let name of formData.keys()){
            console.log(formData.get(name))
        }
        options = {
            method: 'POST',
            body: formData
        }	
        fetch('/upload', options)
            .then(response => response.json())
            .then(data => {
                console.log(data.status)
                if (data.status == 'OK'){
                    document.getElementById('upload-box').style.display = 'none'
                    document.getElementById('success-box').style.display = 'block'
                    document.getElementById('upload-again').addEventListener('click', event => location.reload())
                }
            })
            .catch(error => console.log(error))   
    }
})

function noFieldIsEmpty() {
    let x = 0
    for(let id of importantElements){
      let element = document.getElementById(id);

      //Makes sure the user uploaded a book
      if(id === "inputfile"){
        if('files' in element) {
          if(element.files.length === 0){
            document.getElementById("uploadErrorText").innerHTML = "Must upload file*";
            element.focus();
            x++
          }
        }
      }

      //checks for the other fields
      else{
        if(element.value === ""){
          document.getElementById(id + "ErrorText").innerHTML = "This field cannot be left empty.*";
          element.focus();
          x++
        }
      }
    }
    if (x != 0){
        return false
    }
    return true;
}
function clearWarnings(){
    for(let id of importantElements){
        let element = document.getElementById(id)
        if(id == "inputfile"){
            document.getElementById("uploadErrorText").innerHTML = "";
        }
        else{
            document.getElementById(id + "ErrorText").innerHTML = ""
        }
    }
}
function fetchChecked(radio){
    for(let element of radio){
        if(element.checked){
            return element.value
        }
    }
}