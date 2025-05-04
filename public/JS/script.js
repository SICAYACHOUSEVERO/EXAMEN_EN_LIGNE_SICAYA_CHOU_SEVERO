document.getElementById('register_form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const res = await fetch('/inserer_utilisateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);
    });

document.getElementById("switch-to-register").addEventListener('click', (event) =>{
    event.preventDefault();
    document.querySelector(".wrapper").classList.add("hidden")
    
})

document.getElementById("switch-to-login").addEventListener('click', (event) =>{
    event.preventDefault();
    document.querySelector(".wrapper").classList.remove("hidden")
})
    


/*document.querySelector('.register_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        ddns: document.getElementById('ddns').value,
        sexe: document.getElementById('sexe').value,
        etablissement: document.getElementById('etablissement').value,
        filiere: document.getElementById('filiere').value
    };

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const text = await response.text();
    alert(text);
});*/

