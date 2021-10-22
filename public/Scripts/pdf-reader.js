var bookLink = location.search.slice(1).split('**')[0]
var oldUrl = location.search.slice(1).split('**')[1]
const viewerEle = document.getElementById('viewer')
viewerEle.innerHTML = ''  //Destroy the old instance of PDF.js (if it exists)
// var filepath = 'http://localhost:3000/books/_temp/book.pdf'
//Create an iframe that points to our pdf.js viewer, and tell pdf.js to open the file whose path is provided
const iframe = document.createElement('iframe')
iframe.src = `http://localhost:3000/pdfjs/web/viewer.html?file=${bookLink}`
viewerEle.appendChild(iframe)

document.getElementById('back-button').addEventListener('click', ()=>{
    location.replace(oldUrl)
})
