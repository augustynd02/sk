document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const sendButton = form.querySelector('button');

    sendButton.addEventListener('click', function(event) {
        event.preventDefault();

        const senderEmail = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!senderEmail || !isValidEmail(senderEmail)) {
            alert('Proszę wprowadzić poprawny adres e-mail.');
            return;
        }

        const recipientEmail = 'so.kozlowska@gmail.com';
        const subject = 'Kontakt ze strony internetowej';
        const body = `Od: ${senderEmail}\n\n${message}`;
        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
