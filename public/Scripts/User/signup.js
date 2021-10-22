const usrnme = document.getElementById("username")
const psswrd = document.getElementById("password")
const confrm = document.getElementById("confirm-password")
const usernameErrorText = document.getElementById("usernameErrorText")
const passwordErrorText = document.getElementById("passwordErrorText")
const confirmPasswordErrorText = document.getElementById("confirmPasswordErrorText")
const formContainer = document.getElementById("formContainer")
const successText = document.getElementById("successText")

let username = ","
let password = ","
let confirm = ","
let signup = document.getElementById("signup")

usrnme.addEventListener("input", event=>{
	username = event.target.value
})
psswrd.addEventListener("input", event=>{
	password = event.target.value
})
confrm.addEventListener("input", event=>{
    confirm = event.target.value
})


signup.addEventListener("click", event =>{
	event.preventDefault()
	if(isEmpty(username)&&isEmpty(password)&&isEmpty(confirm)){
		console.log("All fields are empty")
		usernameErrorText.innerHTML = "All three fields must be filled"
        passwordErrorText.innerHTML = ""
        confirmPasswordErrorText.innerHTML = ""
    }
    else if(isEmpty(username)){
		console.log("Username field empty")
		usernameErrorText.innerHTML = "Username field can't be left empty"
        passwordErrorText.innerHTML = ""
        confirmPasswordErrorText = ""
    }
    else if(isEmpty(password)){
		console.log("Password field empty")
		usernameErrorText.innerHTML = ""
        passwordErrorText.innerHTML = "Password field can't be left empty"
        confirmPasswordErrorText.innerHTML = ""
	} 
    else if(isEmpty(confirm)){
        console.log("Confirm password field is empty")
        confirmPasswordErrorText.innerHTML = "This field must be filled"
        passwordErrorText.innerHTML = ""
        usernameErrorText.innerHTML = ""
    }
    else if(password != confirm){
        console.log("Password field doesnt match with confirm-password field")
        confirmPasswordErrorText.innerHTML = "This field must match the password field"
        passwordErrorText.innerHTML = ""
        usernameErrorText.innerHTML = ""
    }
	else{
		data = {username, password, type: 'signup'}
			options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}	
		fetch('/signup', options)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if (!data.successful){
                    passwordErrorText.innerHTML = ""
                    confirmPasswordErrorText.innerHTML = ""
					usernameErrorText.innerHTML = "The username has already been taken by a user"
				}
				else{
					formContainer.style.display = "none"
					successText.style.display = "block"
				}
			})
	}
})
