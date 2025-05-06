function ajouter_reponse(id){

    var nuevoReponse = document.createElement("input");
    nuevoReponse.id = "reponse"+5;
    nuevoReponse.name = "reponse5";
    nuevoReponse.className = "reponse_qcm";
    nuevoReponse.type = "text";
    nuevoReponse.placeholder = "Tapez la reponse";

    var nuevoCheckbox = document.createElement("input");
    nuevoCheckbox.id = "cb"+5;
    nuevoCheckbox.name = "cb5";
    nuevoCheckbox.className = "checkbox";
    nuevoCheckbox.type = "checkbox";

    document.getElementById('question'+id).appendChild(nuevoReponse);
    document.getElementById('question'+id).appendChild(nuevoCheckbox);
    document.getElementById('question'+id).innerHTML += " correcte";

}
function ajouter_question(tipo){
            numq=parseInt(document.getElementById('numeroq').value);
            var espacios="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            var nuevoDiv = document.createElement("div");
            nuevoDiv.id = "question"+(numq+1);
            nuevoDiv.name = "question";
            nuevoDiv.className = "inputbox2";

            var divQ = "<h6>Question #" +(numq+1)+ espacios+
            "Taux : <input type='number' class='taux' value='10' max='100' min='2' step='2' "+
            " id='taux" +(numq+1) + "' name='taux" +(numq+1)+"' />%"+espacios+

            "Duree : <input type='number' class='taux' value='60' max='1800' min='30' step='30' "+
            " id='duree" +(numq+1) + "' name='duree" +(numq+1)+"' /> sec."+espacios+

            "<select class='fichier' name='select" +(numq+1)+ "' id='select" +(numq+1)+ "'"+
            " onchange='select_fichier(" +(numq+1) +")'>"+
                "<option value='none' selected > + fichier </option>"+
                "<option value='audio'> Audio </option>"+
                "<option value='image'> Image </option>"+
                "<option value='video'> Video </option></select> "+
             "<label class='label_fichier' for='fichier" +(numq+1)+ "' id='label_fichier" +(numq+1)+ "'> Choisir</label>"+
            "<input type='file' accept='image/*' name='fichier" +(numq+1)+ "' id='fichier" +(numq+1)+ "' disabled />"+

            "<button type='button' class='button_supprimer' onclick='supprimer_question(" +(numq+1) + 
            ")'>Supprimer</button> </h6>"+

           "<textarea class='question' id='ennonce" +(numq+1) + "' " +
           "name='ennonce" +(numq+1) + "' " +
           "placeholder=\"Tapez l'énoncé de la question\">" +
           "</textarea>";   

           if(tipo=="D"){
                divQ=divQ+"<h6>Reponses #" +(numq+1) + "</h6>" +
           "<input class='reponse' type='text' id='reponse" +(numq+1) + "' " +
           "name='reponse" +(numq+1) + "' " +
           "placeholder='Tapez la reponse'/>";
           }else{
             divQ=divQ+"<h6>Reponses Question #" +(numq+1) + 
        "<button type='button' class='button_ajouter' onclick='ajouter_reponse(" +(numq+1) + 
           ")'>+Reponse</button> </h6>" +
           "<input class='reponse_qcm' type='text' id='reponse" +(numq+1) + "' " +
           "name='reponse" +(numq+1) + "' " +
           "placeholder='Tapez la reponse'/>"+
           "<input class='checkbox' type='checkbox' checked='true'/> correcte"+
           "<input class='reponse_qcm' type='text' id='reponse" +(numq+1) + "' " +
           "name='reponse" +(numq+1) + "' " +
           "placeholder='Tapez la reponse'/>"+
           "<input class='checkbox' type='checkbox'/> correcte";

           }
            nuevoDiv.innerHTML = divQ;

            document.getElementById('numeroq').value=(numq+1);
            document.getElementById('questions').appendChild(nuevoDiv);
                  window.scrollTo(0, document.body.scrollHeight);
            }
function select_fichier(id){
    var valor=document.getElementById('select'+id).value;
    var milabel=document.getElementById('label_fichier'+id);
    var mifile=document.getElementById('fichier'+id);

    if(valor=="none"){
        mifile.disabled = true;
        mifile.accept = '';
        mifile.required = false;
        milabel.style.backgroundColor="lightgrey";
    }else{
        mifile.disabled = false;
        mifile.required = true;
        milabel.style.backgroundColor="green";
        mifile.accept=valor+"/*"
    }
}
function supprimer_question(num){
    document.getElementById("question"+num).remove();
    }

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

