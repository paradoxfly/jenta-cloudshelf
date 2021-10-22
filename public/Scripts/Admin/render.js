fetch('/admin/books')
    .then(response => response.json())
    .then(data => {
        console.log(data.data)
        var recentUploadContainer = document.getElementById('recent-upload-container')
        var allBookContainer = document.getElementById('all-book-container')
        var mostReadContainer = document.getElementById('most-read-container')
        var searchContainer = document.getElementById('search-container')
        var subjectContainer = document.getElementById('subject-container')

        renderRecent(data.data)
        renderAll(data.data)
        renderMostRead(data.data)
        
        renderSubjectNumbers(data.data)
        renderSubject(data.data, recentUploadContainer, allBookContainer, mostReadContainer, searchContainer)

        var searchBox = document.getElementById('search-box')
        var searchText = ','
        searchBox.addEventListener("input", event=>{ 
            console.log("fired")
            searchText = event.target.value
            console.log(searchText)
            if (searchText == ''){
                removeSearch(recentUploadContainer, allBookContainer, mostReadContainer)
            }
            else{
                renderSearch(data.data, searchText, recentUploadContainer, allBookContainer, mostReadContainer, subjectContainer)
                //render search using data already on clientside
            }
        })

    })
    .catch(error => console.log(error))

function renderAll(bookArray){  //Renders all books 
    var allBookRow = document.getElementById('all-book-row')
    for(let bookData of bookArray){
        var bookContainer = document.createElement('div')
        bookContainer.className = "col-xs-6 col-sm-4 col-md-3 col-lg-2 show"
            var bookCard = document.createElement('div')
            bookCard.className = "card"
                var bookThumb = document.createElement('img')
                bookThumb.className = "card-img-top book-thumbnail-all"
                bookThumb.src = bookData.Thumb
                bookThumb.addEventListener('click', event =>{
                    renderSingle(bookData)
                })
                var cardBody = document.createElement('div')
                cardBody.className = "card-body"
                    var bookTitle = document.createElement('h6')
                    bookTitle.className = "display-5 upload-text"
                    bookTitle.innerText = bookData.Title
                    var readButton = document.createElement('button')
                    readButton.className = "btn btn-outline-dark btn-sm"
                    readButton.innerText = 'Read'
                    readButton.addEventListener('click', event=>{
                        let data = {_id: bookData._id}
                        options = {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }	
                        fetch('/admin/reads', options)
                            .then(response => response.json())
                            .then(data =>  console.log(data) )
                            .catch(error => console.log(error))
                        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
                    })
                    var deleteButton = document.createElement('button')
                    deleteButton.className = "btn btn-outline-light btn-sm"
                    deleteButton.innerText = 'Delete'
                    var yesEvent = function(event){}
                    var noEvent = function(event){}
                    deleteButton.addEventListener('click', event =>{
                        var promptBox = document.getElementById('delete-prompt')
                        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
                        promptBox.children[1].removeEventListener('click', yesEvent)
                        yesEvent = function(event){
                            console.log("clicked yes for " + bookData.Title)
                            promptBox.style.display = "none"
                            let data = {
                                _id: bookData._id,
                                book: bookData.server_Book,
                                thumb: bookData.server_Thumb
                            }
                            options = {
                                method: 'DELETE',
                                headers:{
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            }
                            fetch('/admin/book', options)
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    if(data.status == 'successful'){
                                        location.reload()
                                    }
                                })
                                .catch(err => console.log(error))
                        }
                        promptBox.children[1].addEventListener('click', yesEvent)
                        promptBox.children[2].removeEventListener('click', noEvent)
                        noEvent = function(event){
                            console.log("clicked no for " + bookData.Title)
                            promptBox.style.display = "none"
                        }
                        promptBox.children[2].addEventListener('click', noEvent)
                        promptBox.style.display = 'block'
                    })
                    cardBody.append(bookTitle, readButton, deleteButton)
            bookCard.append(bookThumb, cardBody)
        bookContainer.append(bookCard)
        allBookRow.append(bookContainer)
    }
}

function renderRecent(bookArray){  //Renders 4 recently uploaded books
    var recentUploadRow = document.getElementById('recent-upload-row')
    let x = 0
    first: for(let bookData of bookArray){
        if(x > 3) break first
        var bookContainer = document.createElement('div')
        bookContainer.className = "col-xs-6 col-sm-4 col-md-3 show"
            var bookCard = document.createElement('div')
            bookCard.className = "card"
                var bookThumb = document.createElement('img')
                bookThumb.className = "card-img-top book-thumbnail"
                bookThumb.src = bookData.Thumb
                bookThumb.addEventListener('click', event =>{
                    renderSingle(bookData)
                })
                var cardBody = document.createElement('div')
                cardBody.className = "card-body"
                    var bookTitle = document.createElement('h6')
                    bookTitle.className = "display-5 upload-text"
                    bookTitle.innerText = bookData.Title
                    var readButton = document.createElement('button')
                    readButton.className = "btn btn-outline-dark btn-sm"
                    readButton.innerText = 'Read'
                    readButton.addEventListener('click', event=>{
                        let data = {_id: bookData._id}
                        options = {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }	
                        fetch('/admin/reads', options)
                            .then(response => response.json())
                            .then(data =>  console.log(data) )
                            .catch(error => console.log(error))
                        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
                    })
                    var deleteButton = document.createElement('button')
                    deleteButton.className = "btn btn-outline-light btn-sm"
                    deleteButton.innerText = 'Delete'
                    var yesEvent = function(event){}
                    var noEvent = function(event){}
                    deleteButton.addEventListener('click', event =>{
                        var promptBox = document.getElementById('delete-prompt')
                        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
                        promptBox.children[1].removeEventListener('click', yesEvent)
                        yesEvent = function(event){
                            console.log("clicked yes for " + bookData.Title)
                            promptBox.style.display = "none"
                            let data = {
                                _id: bookData._id,
                                book: bookData.server_Book,
                                thumb: bookData.server_Thumb
                            }
                            options = {
                                method: 'DELETE',
                                headers:{
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            }
                            fetch('/admin/book', options)
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    if(data.status == 'successful'){
                                        location.reload()
                                    }
                                })
                                .catch(err => console.log(error))
                        }
                        promptBox.children[1].addEventListener('click', yesEvent)
                        promptBox.children[2].removeEventListener('click', noEvent)
                        noEvent = function(event){
                            console.log("clicked no for " + bookData.Title)
                            promptBox.style.display = "none"
                        }
                        promptBox.children[2].addEventListener('click', noEvent)
                        promptBox.style.display = 'block'
                    })
                cardBody.append(bookTitle, readButton, deleteButton)
            bookCard.append(bookThumb, cardBody)
        bookContainer.append(bookCard)
        recentUploadRow.append(bookContainer)
        x++
    }
}
 
function renderMostRead(bookArray){    //Renders most read books
    var mostReadRow = document.getElementById('most-read-row')
    var updatedArray = []
    var number = 0
    for(let data of bookArray){
        if(data.reads >= number){
            updatedArray.unshift(data)
        } else{
            updatedArray.push(data)
        }
        number = data.reads
    }
    let x = 0
    first: for(let bookData of updatedArray){
        if(x > 3) break first
        var bookContainer = document.createElement('div')
        bookContainer.className = "col-xs-6 col-sm-4 col-md-3 show"
            var bookCard = document.createElement('div')
            bookCard.className = "card"
                var bookThumb = document.createElement('img')
                bookThumb.className = "card-img-top book-thumbnail"
                bookThumb.src = bookData.Thumb
                bookThumb.addEventListener('click', event =>{
                    renderSingle(bookData)
                })
                var cardBody = document.createElement('div')
                cardBody.className = "card-body"
                    var bookTitle = document.createElement('h6')
                    bookTitle.className = "display-5 upload-text"
                    bookTitle.innerText = bookData.Title
                    var readButton = document.createElement('button')
                    readButton.className = "btn btn-outline-dark btn-sm"
                    readButton.innerText = 'Read'
                    var yesEvent = function(event){}
                    var noEvent = function(event){}
                    readButton.addEventListener('click', event=>{
                        let data = {_id: bookData._id}
                        options = {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }	
                        fetch('/admin/reads', options)
                            .then(response => response.json())
                            .then(data =>  console.log(data) )
                            .catch(error => console.log(error))
                        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
                    })
                    var deleteButton = document.createElement('button')
                    deleteButton.className = "btn btn-outline-light btn-sm"
                    deleteButton.innerText = 'Delete'
                    deleteButton.addEventListener('click', event =>{
                        var promptBox = document.getElementById('delete-prompt')
                        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
                        promptBox.children[1].removeEventListener('click', yesEvent)
                        yesEvent = function(event){
                            console.log("clicked yes for " + bookData.Title)
                            promptBox.style.display = "none"
                            let data = {
                                _id: bookData._id,
                                book: bookData.server_Book,
                                thumb: bookData.server_Thumb
                            }
                            options = {
                                method: 'DELETE',
                                headers:{
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            }
                            fetch('/admin/book', options)
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    if(data.status == 'successful'){
                                        location.reload()
                                    }
                                })
                                .catch(err => console.log(error))
                        }
                        promptBox.children[1].addEventListener('click', yesEvent)
                        promptBox.children[2].removeEventListener('click', noEvent)
                        noEvent = function(event){
                            console.log("clicked no for " + bookData.Title)
                            promptBox.style.display = "none"
                        }
                        promptBox.children[2].addEventListener('click', noEvent)
                        promptBox.style.display = 'block'
                    })
                cardBody.append(bookTitle, readButton, deleteButton)
            bookCard.append(bookThumb, cardBody)
        bookContainer.append(bookCard)
        mostReadRow.append(bookContainer)
        x++
    }
}

function renderSubject(bookArray, ...container){  //container is an array of all the container divs on the page
    let subjects = ['art','science','health','romance','fantasy','religion']
    var subContainer = document.getElementById('subject-container')
    var subRow = document.getElementById('subject-row')
    var prevState = []
    for(let subject of subjects){
        const sub = document.getElementById(`toggle-${subject}`)
        sub.children[1].children[0].addEventListener('click', event=>{
            if(sub.dataset.toggle == "off"){
                for(let con of container){
                    prevState.push(con.style.display)
                    con.style.display = 'none'
                }
                sub.dataset.toggle = "on"
                sub.className += ' shadow'
                sub.children[2].innerHTML == "0 Books" ? document.getElementById('subject-header').innerHTML = `No ${subject.toUpperCase()} Books In Library Yet!! You Can Upload One To The Library Using The Upload Button Above` : document.getElementById('subject-header').innerHTML = subject.toUpperCase()
                // document.getElementById('subject-header').innerHTML = subject.toUpperCase()
                toggleOthersOff(subject)
                console.log(subject + " style = " + sub.className)
                for(let bookData of bookArray){
                    if(bookData.Category == subject){
                        var bookContainer = document.createElement('div')
                        bookContainer.className = "col-xs-6 col-sm-4 col-md-3 show"
                            var bookCard = document.createElement('div')
                            bookCard.className = "card"
                                var bookThumb = document.createElement('img')
                                bookThumb.className = "card-img-top book-thumbnail"
                                bookThumb.src = bookData.Thumb
                                bookThumb.addEventListener('click', event =>{
                                    renderSingle(bookData)
                                })
                                var cardBody = document.createElement('div')
                                cardBody.className = "card-body"
                                    var bookTitle = document.createElement('h6')
                                    bookTitle.className = "display-5 upload-text"
                                    bookTitle.innerText = bookData.Title
                                    var readButton = document.createElement('button')
                                    readButton.className = "btn btn-outline-dark btn-sm"
                                    readButton.innerText = 'Read'
                                    readButton.addEventListener('click', event=>{
                                        let data = {_id: bookData._id}
                                        options = {
                                            method: 'POST',
                                            headers:{
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(data)
                                        }	
                                        fetch('/admin/reads', options)
                                            .then(response => response.json())
                                            .then(data =>  console.log(data) )
                                            .catch(error => console.log(error))
                                        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
                                    })
                                    var deleteButton = document.createElement('button')
                                    deleteButton.className = "btn btn-outline-light btn-sm"
                                    deleteButton.innerText = 'Delete'
                                    var yesEvent = function(event){}
                                    var noEvent = function(event){}
                                    deleteButton.addEventListener('click', event =>{
                                        var promptBox = document.getElementById('delete-prompt')
                                        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
                                        promptBox.children[1].removeEventListener('click', yesEvent)
                                        yesEvent = function(event){
                                            console.log("clicked yes for " + bookData.Title)
                                            promptBox.style.display = "none"
                                            let data = {
                                                _id: bookData._id,
                                                book: bookData.server_Book,
                                                thumb: bookData.server_Thumb
                                            }
                                            options = {
                                                method: 'DELETE',
                                                headers:{
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(data)
                                            }
                                            fetch('/admin/book', options)
                                                .then(response => response.json())
                                                .then(data => {
                                                    console.log(data)
                                                    if(data.status == 'successful'){
                                                        location.reload()
                                                    }
                                                })
                                                .catch(err => console.log(error))
                                        }
                                        promptBox.children[1].addEventListener('click', yesEvent)
                                        promptBox.children[2].removeEventListener('click', noEvent)
                                        noEvent = function(event){
                                            console.log("clicked no for " + bookData.Title)
                                            promptBox.style.display = "none"
                                        }
                                        promptBox.children[2].addEventListener('click', noEvent)
                                        promptBox.style.display = 'block'
                                    })
                                cardBody.append(bookTitle, readButton, deleteButton)
                            bookCard.append(bookThumb, cardBody)
                        bookContainer.append(bookCard)
                        subRow.appendChild(bookContainer)
                    }
                    
                }
                subContainer.style.display = 'block'
                
            } else{
                for(let i = 0; i < container.length; i++){
                    container[i].style.display = prevState[i]
                }
                sub.dataset.toggle = "off"
                sub.className = "col-2"
                console.log(subject + " style = " + sub.className)
                subRow.innerHTML = ""
                subContainer.style.display = 'none'
            }
        })
    }
}

function toggleOthersOff(subject){      //Turns off the toggle of other subjects when the argument subject's toggle is fired
    let subjects = ['art','science','health','romance','fantasy','religion']
    var subRow = document.getElementById('subject-row')
    for(let sub of subjects){
        if(sub != subject){
            const element = document.getElementById(`toggle-${sub}`)
            if(element.dataset.toggle == "on"){
                element.dataset.toggle = "off"
                element.className += 'col-2'
            }
        }
    }
    subRow.innerHTML = ""
}

function toggleAllOff(){
    let subjects = ['art','science','health','romance','fantasy','religion']
    var subRow = document.getElementById('subject-row')
    for(let sub of subjects){
        const element = document.getElementById(`toggle-${sub}`)
        if(element.dataset.toggle == "on"){
            element.dataset.toggle = "off"
            element.className += 'col-2'
        }
    }
    subRow.innerHTML = ""
}

function renderSubjectNumbers(bookArray){  //Renders the number of books per subject
    let subjects = ['art','science','health','romance','fantasy','religion']
    let number = {}
    for(let sub of subjects){
        number[`${sub}`] = 0
    }
    for(let bookData of bookArray){
        first: for(key of Object.keys(number)){
            if(bookData.Category == key){
                number[`${key}`] ++
                break first
            }
        }
    }
    console.log(number)
    for(let sub of subjects){
        number[sub] == 1 ? document.getElementById(`no_${sub}`).innerHTML = `${number[`${sub}`]} Book` : document.getElementById(`no_${sub}`).innerHTML = `${number[`${sub}`]} Books`
    }
}

function removeSearch(...container){    //Removes search display container from screen 
    document.getElementById('search-container').style.display = 'none'
    document.getElementById('search-row').innerHTML = ""
    for(let containment of container){
        containment.style.display = 'block'
    }
}

function renderSearch(bookArray, searchText, ...container){
    for(let containment of container){
        containment.style.display = 'none'
    }
    toggleAllOff()
    document.getElementById('search-container').style.display = 'block'

    var searchArray = []
    var search = new RegExp(searchText.toUpperCase())
    var searchOption = document.getElementById('search-option').value
    if(searchOption != "both"){
        if(searchText.length == 1){
            for(let bookData of bookArray){
                if(searchText.toUpperCase()[0] == (bookData[searchOption].toUpperCase()[0])){
                    searchArray.push(bookData)
                }
            }
        } else{
            for(let bookData of bookArray){
                if(search.test(bookData[searchOption].toUpperCase())){
                    searchArray.push(bookData)
                }
            } 
        }
        
    } else{
        if(searchText.length == 1){
            for(let bookData of bookArray){
                if(searchText.toUpperCase()[0] == (bookData.Title.toUpperCase()[0])){
                    searchArray.push(bookData)
                }
            }
            for(let bookData of bookArray){
                if(searchText.toUpperCase()[0] == (bookData.Author.toUpperCase()[0])){
                    searchArray.push(bookData)
                }
            }
        } else{
            for(let bookData of bookArray){
                if(search.test(bookData.Title.toUpperCase())){
                    searchArray.push(bookData)
                }
            }
            for(let bookData of bookArray){
                if(search.test(bookData.Author.toUpperCase())){
                    searchArray.push(bookData)
                }
            }
        }
        
    }

    var searchRow = document.getElementById('search-row')
    searchRow.innerHTML = ""
    if(searchArray.length == 0){
        document.getElementById('search-result-text').innerHTML = "No Result To Display"
    } else{
        document.getElementById('search-result-text').innerHTML = "Search Results"
    }
    for (let bookData of searchArray){
        var bookContainer = document.createElement('div')
        bookContainer.className = "col-xs-6 col-sm-4 col-md-3 show"
            var bookCard = document.createElement('div')
            bookCard.className = "card"
                var bookThumb = document.createElement('img')
                bookThumb.className = "card-img-top book-thumbnail"
                bookThumb.src = bookData.Thumb
                bookThumb.addEventListener('click', event =>{
                    renderSingle(bookData)
                })
                var cardBody = document.createElement('div')
                cardBody.className = "card-body"
                    var bookTitle = document.createElement('h6')
                    bookTitle.className = "display-5 upload-text"
                    bookTitle.innerText = bookData.Title
                    var readButton = document.createElement('button')
                    readButton.className = "btn btn-outline-dark btn-sm"
                    readButton.innerText = 'Read'
                    readButton.addEventListener('click', event=>{
                        let data = {_id: bookData._id}
                        options = {
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }	
                        fetch('/admin/reads', options)
                            .then(response => response.json())
                            .then(data =>  console.log(data) )
                            .catch(error => console.log(error))
                        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
                    })
                    var deleteButton = document.createElement('button')
                    deleteButton.className = "btn btn-outline-light btn-sm"
                    deleteButton.innerText = 'Delete'
                    var yesEvent = function(event){}
                    var noEvent = function(event){}
                    deleteButton.addEventListener('click', event =>{
                        var promptBox = document.getElementById('delete-prompt')
                        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
                        promptBox.children[1].removeEventListener('click', yesEvent)
                        yesEvent = function(event){
                            console.log("clicked yes for " + bookData.Title)
                            promptBox.style.display = "none"
                            let data = {
                                _id: bookData._id,
                                book: bookData.server_Book,
                                thumb: bookData.server_Thumb
                            }
                            options = {
                                method: 'DELETE',
                                headers:{
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            }
                            fetch('/admin/book', options)
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    if(data.status == 'successful'){
                                        location.reload()
                                    }
                                })
                                .catch(err => console.log(error))
                        }
                        promptBox.children[1].addEventListener('click', yesEvent)
                        promptBox.children[2].removeEventListener('click', noEvent)
                        noEvent = function(event){
                            console.log("clicked no for " + bookData.Title)
                            promptBox.style.display = "none"
                        }
                        promptBox.children[2].addEventListener('click', noEvent)
                        promptBox.style.display = 'block'
                    })
                cardBody.append(bookTitle, readButton, deleteButton)
            bookCard.append(bookThumb, cardBody)
        bookContainer.append(bookCard)
        searchRow.append(bookContainer)
    }

}

function renderSingle(bookData){
    document.getElementById('single-book-container').style.display = 'block'
    var yesEvent = function(event){}
    var noEvent = function(event){}
    onClose = event =>{
        document.getElementById('single-book-container').style.display = 'none'
    }
    onRead = event =>{
        let data = {_id: bookData._id}
        options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }	
        fetch('/admin/reads', options)
            .then(response => response.json())
            .then(data =>  console.log(data) )
            .catch(error => console.log(error))
        location.replace(`http://localhost:3000/pdf-reader.html?${bookData.Book}**${location.href}`)
    }
    onDelete = event =>{
        var promptBox = document.getElementById('delete-prompt')
        promptBox.children[0].innerHTML = `Are you sure you want to delete ${bookData.Title}?`
        promptBox.children[1].removeEventListener('click', yesEvent)
        yesEvent = function(event){
            console.log("clicked yes for " + bookData.Title)
            promptBox.style.display = "none"
            let data = {
                _id: bookData._id,
                book: bookData.server_Book,
                thumb: bookData.server_Thumb
            }
            options = {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch('/admin/book', options)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data.status == 'successful'){
                        location.reload()
                    }
                })
                .catch(err => console.log(error))
        }
        promptBox.children[1].addEventListener('click', yesEvent)
        promptBox.children[2].removeEventListener('click', noEvent)
        noEvent = function(event){
            console.log("clicked no for " + bookData.Title)
            promptBox.style.display = "none"
        }
        promptBox.children[2].addEventListener('click', noEvent)
        promptBox.style.display = 'block'
    }
    document.getElementById('close-button').addEventListener('click', onClose)
    document.getElementById('single-book-read-button').addEventListener('click', onRead)
    document.getElementById('single-book-delete-button').addEventListener('click', onDelete)
    
    document.getElementById('single-book-thumb').src = bookData.Thumb
    document.getElementById('single-book-title').innerHTML = bookData.Title
    document.getElementById('single-book-author').innerHTML = bookData.Author
    document.getElementById('single-book-category').innerHTML = bookData.Category
    document.getElementById('single-book-description').innerHTML = bookData.Description
    document.getElementById('single-book-uploader').innerHTML = bookData.Uploader
}