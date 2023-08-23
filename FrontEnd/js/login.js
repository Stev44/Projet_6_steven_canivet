
sessionStorage.clear();

const form = document.getElementById('loginForm');

form.addEventListener('submit', event => {

   event.preventDefault();
 
 const email = document.getElementById('email').value;
 const password = document.getElementById('password').value;
 
 fetch('http://localhost:5678/api/users/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({email, password})
 })
 .then(response => response.json())
 .then(data => {
   
   let userId = data.userId;
   if (userId === 1){
     let token = data.token;
     sessionStorage.setItem('token', token);
     document.location.href="index.html";
   }else{
     let error = document.getElementById('error');
     error.textContent="Erreur dans l’identifiant ou le mot de passe !";
   }

 })
});
