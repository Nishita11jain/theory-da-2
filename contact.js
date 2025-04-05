// // DOM Elements
// const contactForm = document.getElementById('contact-form');
// const formSuccess = document.getElementById('form-success');
// const nameInput = document.getElementById('name');
// const emailInput = document.getElementById('email');
// const phoneInput = document.getElementById('phone');
// const subjectInput = document.getElementById('subject');
// const messageInput = document.getElementById('message');
// const nameError = document.getElementById('name-error');
// const emailError = document.getElementById('email-error');
// const phoneError = document.getElementById('phone-error');
// const subjectError = document.getElementById('subject-error');
// const messageError = document.getElementById('message-error');
// const faqItems = document.querySelectorAll('.faq-item');

// // Event Listeners
// document.addEventListener('DOMContentLoaded', function() {
//     // Form submission
//     contactForm.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // Validate form
//         if (validateForm()) {
//             // Simulate form submission
//             submitForm();
//         }
//     });
    
//     // Input validation on blur
//     nameInput.addEventListener('blur', function() {
//         validateName();
//     });
    
//     emailInput.addEventListener('blur', function() {
//         validateEmail();
//     });
    
//     phoneInput.addEventListener('blur', function() {
//         validatePhone();
//     });
    
//     subjectInput.addEventListener('blur', function() {
//         validateSubject();
//     });
    
//     messageInput.addEventListener('blur', function() {
//         validateMessage();
//     });
    
//     // FAQ toggle
//     faqItems.forEach(item => {
//         const question = item.querySelector('.faq-question');
        
//         question.addEventListener('click', function() {
//             // Toggle active class
//             item.classList.toggle('active');
            
//             // Close other FAQs
//             faqItems.forEach(otherItem => {
//                 if (otherItem !== item) {
//                     otherItem.classList.remove('active');
//                 }
//             });
//         });
//     });
// });

// // Form validation
// function validateForm() {
//     let isValid = true;
    
//     // Validate each field
//     if (!validateName()) isValid = false;
//     if (!validateEmail()) isValid = false;
//     if (!validatePhone()) isValid = false;
//     if (!validateSubject()) isValid = false;
//     if (!validateMessage()) isValid = false;
    
//     return isValid;
// }

// function validateName() {
//     const name = nameInput.value.trim();
    
//     if (name === '') {
//         nameError.textContent = 'Please enter your name';
//         nameInput.classList.add('error');
//         return false;
//     } else if (name.length < 2) {
//         nameError.textContent = 'Name must be at least 2 characters';
//         nameInput.classList.add('error');
//         return false;
//     } else {
//         nameError.textContent = '';
//         nameInput.classList.remove('error');
//         return true;
//     }
// }

// function validateEmail() {
//     const email = emailInput.value.trim();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
//     if (email === '') {
//         emailError.textContent = 'Please enter your email address';
//         emailInput.classList.add('error');
//         return false;
//     } else if (!emailRegex.test(email)) {
//         emailError.textContent = 'Please enter a valid email address';
//         emailInput.classList.add('error');
//         return false;
//     } else {
//         emailError.textContent = '';
//         emailInput.classList.remove('error');
//         return true;
//     }
// }

// function validatePhone() {
//     const phone = phoneInput.value.trim();
//     const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    
//     if (phone !== '' && !phoneRegex.test(phone)) {
//         phoneError.textContent = 'Please enter a valid phone number';
//         phoneInput.classList.add('error');
//         return false;
//     } else {
//         phoneError.textContent = '';
//         phoneInput.classList.remove('error');
//         return true;
//     }
// }

// function validateSubject() {
//     const subject = subjectInput.value;
    
//     if (subject === '') {
//         subjectError.textContent = 'Please select a subject';
//         subjectInput.classList.add('error');
//         return false;
//     } else {
//         subjectError.textContent = '';
//         subjectInput.classList.remove('error');
//         return true;
//     }
// }

// function validateMessage() {
//     const message = messageInput.value.trim();
    
//     if (message === '') {
//         messageError.textContent = 'Please enter your message';
//         messageInput.classList.add('error');
//         return false;
//     } else if (message.length < 10) {
//         messageError.textContent = 'Message must be at least 10 characters';
//         messageInput.classList.add('error');
//         return false;
//     } else {
//         messageError.textContent = '';
//         messageInput.classList.remove('error');
//         return true;
//     }
// }

// // Form submission
// function submitForm() {
//     // Get form data
//     const formData = {
//         name: nameInput.value.trim(),
//         email: emailInput.value.trim(),
//         phone: phoneInput.value.trim(),
//         subject: subjectInput.value,
//         message: messageInput.value.trim(),
//         newsletter: document.getElementById('newsletter').checked
//     };
    
//     // In a real application, you would send this data to a server
//     console.log('Form submitted:', formData);
    
//     // Simulate loading
//     const submitButton = contactForm.querySelector('button[type="submit"]');
//     submitButton.disabled = true;
//     submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
//     // Simulate server response (after 2 seconds)
//     setTimeout(() => {
//         // Hide form and show success message
//         contactForm.style.display = 'none';
//         formSuccess.style.display = 'block';
        
//         // Reset form for future submissions
//         contactForm.reset();
//         submitButton.disabled = false;
//         submitButton.innerHTML = 'Send Message';
//     }, 2000);
// }

// // Add form styles
// const formStyles = document.createElement('style');
// formStyles.textContent = `
//     .form-group input.error,
//     .form-group select.error,
//     .form-group textarea.error {
//         border-color: #e74c3c;
//     }
    
//     @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//     }
    
//     .fa-spinner {
//         animation: spin 1s linear infinite;
//     }
// `;
// document.head.appendChild(formStyles);