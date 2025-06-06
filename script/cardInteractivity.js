let card = document.querySelectorAll('.card-professor')
for(let i = 0; i < card.length; i++){
    card[i].addEventListener('mouseout', function animation(){
        card[i].classList.add('classAnimation')
})
}