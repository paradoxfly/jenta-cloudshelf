const profileName = document.getElementById("profile-name")
const uploadPage = document.getElementById("upload-page")


const profileID = location.search.slice(1)
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
	})
	.catch(error => console.log(error))

uploadPage.addEventListener("click", event =>{
	location.replace("http://localhost:3000/user/upload.html?"+profileID)
})