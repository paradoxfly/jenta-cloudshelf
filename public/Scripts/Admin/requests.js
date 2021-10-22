fetch('/admin/request')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        var uploadRow = document.getElementById('upload-row')
        if(data.data.length == 0 ){
            document.getElementById('upload-container').style.display = 'none'
            document.getElementById('no-upload-container').style.display = 'block'
        }
        for (let obj of data.data){
            renderRequestCard(obj, uploadRow)
        }
    })
    .catch(error => console.log(error))

function renderRequestCard(requestObject, uploadRow){
    //Draw card 
    var cardContainer = document.createElement('div')
    cardContainer.className = "col-md-3 col-sm-6 col-xs-6 show"
    var card = document.createElement('div')
    card.className = "card"
    var thumbnail = document.createElement('img')
    thumbnail.className = "card-img-top book-thumbnail"
    thumbnail.src = requestObject.Thumb
    var cardBase = document.createElement('div')
    cardBase.className = "card-body"
    var readButton = document.createElement('button')
    readButton.className = "btn btn-outline-dark btn-sm"
    readButton.innerText = 'Read'
    readButton.addEventListener('click', event=>{
        location.replace(`http://localhost:3000/pdf-reader.html?${requestObject.Book}**${location.href}`)
    })

    cardBase.append(readButton)
    card.append(thumbnail, cardBase)
    // card.appendChild(cardBase)
    cardContainer.append(card)
    uploadRow.append(cardContainer)


    //Draw data section top to bottom
    var dataContainer = document.createElement('div')
    dataContainer.className = "col-md-3 col-sm-6 col-xs-6 show"

        var uploadClass = "display-5 upload-text"

        var uploader = document.createElement('h6')
        uploader.className = uploadClass
        uploaderName = requestObject.Uploader
        uploader.innerText = "Uploaded By: " + uploaderName 

        var title = document.createElement('h6')
        title.className = uploadClass
        titleName = requestObject.Title
        title.innerText = "Title of Book: " + titleName 

        var category = document.createElement('h6')
        category.className = uploadClass
        categoryName = requestObject.Category
        category.innerText = "Suggested Category: " + categoryName 

        var description = document.createElement('h6')
        description.className = uploadClass
        descriptionName = requestObject.Description
        description.innerText = "Description: " + descriptionName 

        var adjustParameters = document.createElement('h6')
        adjustParameters.className = uploadClass
        adjustParameters.innerText = "Adjust Parameters?"

            var radioContainer = document.createElement('div')
                var radioYes = document.createElement('input')
                radioYes.type = 'radio'
                let ran = Math.random()
                radioYes.name = 'id' + ran
                var yesLabel = document.createElement('label')
                yesLabel.innerText = 'Yes  '

                var radioNo = document.createElement('input')
                radioNo.type = 'radio'
                radioNo.name = 'id' + ran            
                radioNo.checked = true
                var noLabel = document.createElement('label')
                noLabel.innerText = 'No  '            
            radioContainer.append(radioYes, yesLabel, radioNo, noLabel)

            adjustClass = 'upload'

            var newTitle = document.createElement('input')
            newTitle.type = 'text'
            newTitle.placeholder = 'New Title'
            newTitle.className = adjustClass
            newTitle.disabled = true

            var newAuthor = document.createElement('input')
            newAuthor.type = 'text'
            newAuthor.placeholder = 'New Author Name'
            newAuthor.className = adjustClass
            newAuthor.disabled = true

            var newDescription = document.createElement('input')
            newDescription.type = 'text'
            newDescription.placeholder = 'New Description'
            newDescription.className = adjustClass
            newDescription.disabled = true

            var newCategory = document.createElement('select')
            newCategory.size = 1
            newCategory.className = adjustClass
            newCategory.disabled = true
            newCategory.innerHTML = "<option>Art</option><option>Science</option><option>Health</option><option>Romance</option><option>Fantasy</option><option>Religion</option><option>Others</option>"
        
            var btnContainer = document.createElement('div')
            btnContainer.className = 'btn-container'
                acceptButton = document.createElement('button')
                acceptButton.className = "btn btn-primary btn-sm"
                acceptButton.innerHTML = "Accept"

                rejectButton = document.createElement('button')
                rejectButton.className = "btn btn-danger btn-sm"
                rejectButton.innerHTML = "Reject"
            btnContainer.append(acceptButton, rejectButton)

        adjustParameters.append(radioContainer, newTitle, newAuthor, newDescription, newCategory, btnContainer)

        
        radioYes.addEventListener('change', event => {
            console.log('checked? ' + radioYes.checked)
            
            //Implement strike-through on data provided by uploader
            uploader.className += ' strike-through'
            title.className += ' strike-through'
            category.className += ' strike-through'
            description.className += ' strike-through'

            //Activate form for adjusting the book's data
            newTitle.disabled = false
            newAuthor.disabled = false
            newDescription.disabled = false
            newCategory.disabled = false
        })
        radioNo.addEventListener('change', event => {
            console.log('unchecked? ' + radioNo.checked)

            //Reactivate struck-through data provided by uploader
            uploader.className = uploadClass
            title.className = uploadClass
            category.className = uploadClass
            description.className = uploadClass

            //Disable form for adjusting the book's data
            newTitle.disabled = true
            newAuthor.disabled = true
            newDescription.disabled = true
            newCategory.disabled = true
        })

        acceptButton.addEventListener('click', (event)=>{
            if(radioYes.checked){
                clearRedBorder()
                first: if(noEmptyField()){
                    // location.reload()
                    let newBookData = {
                        Uploader: requestObject.Uploader,
                        Title: newTitle.value,
                        Author: newAuthor.value,
                        Description: newDescription.value,
                        Category: newCategory.value,
                        oldBookPath: requestObject['server-Book'],
                        oldThumbPath: requestObject['server-Thumb'],
                        adjusted: true,
                        _id: requestObject._id
                    }
                    console.log(newBookData)
                    options = {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newBookData)
                    }
                    fetch('/admin/request', options)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            if(data.status == "successful"){
                                cardContainer.remove()
                                dataContainer.remove()
                            }
                        })
                        .catch(error => console.log(error))	
                }
            }
            else{
                let oldData = {
                    _id: requestObject._id,
                    adjusted: false
                }
                options = {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(oldData)
                }
                fetch('/admin/request', options)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            if(data.status == "successful"){
                                cardContainer.remove()
                                dataContainer.remove()
                            }
                        })
                        .catch(error => console.log(error))		
            }
            
        })
        rejectButton.addEventListener('click', (event)=>{
            let oldData = {
                _id: requestObject._id,
                oldBookPath: requestObject['server-Book'],
                oldThumbPath: requestObject['server-Thumb'],
            }
            options = {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oldData)
            }
            fetch('/admin/request', options)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data.status == "successful"){
                        cardContainer.remove()
                        dataContainer.remove()
                    }
                })
                .catch(error => console.log(error))	
        })
    
        dataContainer.append(uploader, title, category, description, adjustParameters)
    uploadRow.append(dataContainer)

    function noEmptyField(){
        let x = 0
        if (newTitle.value === ''){
            newTitle.className += ' red-border'
            x++
        }
        if (newAuthor.value === ''){
            newAuthor.className += ' red-border'
            x++
        }
        if (newDescription.value === ''){
            newDescription.className += ' red-border'
            x++
        }
        if ( x > 0) return false
        else return true
    }
    function clearRedBorder(){
        newTitle.className = adjustClass
        newAuthor.className = adjustClass
        newDescription.className = adjustClass
    }
}