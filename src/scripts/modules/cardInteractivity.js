// script para adicionar interatividade aos cards de professores e matérias

// selecionar todos os cards de professores
let card = document.querySelectorAll('.card-professor')

// adicionar evento de click no primeiro card para ir ao perfil
card[0].addEventListener('click', function perfil(){
    window.location.href = 'Alberto.html'
})

// animação ao tirar o mouse dos cards de professores
for(let i = 0; i < card.length; i++){
    card[i].addEventListener('mouseout', function animation(){
        card[i].classList.add('classAnimation')
})
}

// selecionar todos os componentes de matérias
let subject = document.querySelectorAll('.subject-component')

// animação ao tirar o mouse dos cards de matérias
for(let i = 0; i < subject.length; i++){
    subject[i].addEventListener('mouseout', function animation(){
        subject[i].classList.add('classAnimationSubject')
})
}