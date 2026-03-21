document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const description = document.getElementById('description').value.trim();

            if (!email || !subject || !description) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Por favor, preencha todos os campos.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Por favor, insira um e-mail válido.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            if (subject.length > 100) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'O assunto não pode ultrapassar 100 caracteres.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            if (description.length > 1000) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'A descrição não pode ultrapassar 1000 caracteres.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            Swal.fire({
                title: 'Sucesso!',
                text: 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
        });
    }
});