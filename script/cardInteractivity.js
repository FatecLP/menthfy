let card = document.querySelectorAll('.card-professor')
for(let i = 0; i < card.length; i++){
    card[i].addEventListener('mouseout', function animation(){
        card[i].classList.add('classAnimation')
})
}
let subject = document.querySelectorAll('.subject-component')
for(let i = 0; i < subject.length; i++){
    subject[i].addEventListener('mouseout', function animation(){
        subject[i].classList.add('classAnimationSubject')
})
}