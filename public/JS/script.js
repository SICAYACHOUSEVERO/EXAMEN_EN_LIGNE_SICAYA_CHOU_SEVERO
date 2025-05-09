function ajouter_reponse(id){
    numReponses=parseInt(document.getElementById('reponses'+id).value);
    document.getElementById('reponses'+id).value=(numReponses+1);

    var reponse = document.createElement("input");      reponse.name = "q"+id+"reponse"+(numReponses+1);
    reponse.className = "reponse_qcm";                  reponse.type = "text";
    reponse.placeholder = "Tapez la reponse";           reponse.required = true; 

    var nuevoCheckbox = document.createElement("input");    nuevoCheckbox.name = "q"+id+"cb"+(numReponses+1);
    nuevoCheckbox.className = "checkbox";                   nuevoCheckbox.type = "checkbox";

    document.getElementById('question'+id).appendChild(reponse);
    document.getElementById('question'+id).appendChild(nuevoCheckbox);
    document.getElementById('question'+id).innerHTML += " correcte";
}
function ajouter_question(tipo){
    numq=parseInt(document.getElementById('numeroq').value);
    var espacios="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    var nuevoDiv = document.createElement("div");
    nuevoDiv.id = "question"+(numq+1);      nuevoDiv.className = "inputbox2";

    var h6=document.createElement("h6");
    h6.innerHTML+="Question " +tipo+" : "+ espacios+ "Taux : ";

    var inputQuestion=document.createElement("input");
    inputQuestion.type="hidden";        inputQuestion.name="question"+(numq+1);   inputQuestion.value=(numq+1); 

    var inputTipe=document.createElement("input");
    inputTipe.type="hidden";        inputTipe.name="tipe"+(numq+1);   inputTipe.value=tipo;               

    const label = document.createElement('label');
    label.className = 'label_fichier';      label.setAttribute('for', 'fichier' + (numq + 1));
    label.id = 'label_fichier' + (numq + 1);label.textContent = ' Choisir';

    const inputFile = document.createElement('input');
    inputFile.type = 'file';        inputFile.name = 'fichier' + (numq + 1);    inputFile.id = 'fichier' + (numq + 1);
    inputFile.disabled = true;

    var question = document.createElement("textarea");
    question.id = "ennonce" +(numq+1);      question.name = "ennonce" +(numq+1);    question.className = "question";
    question.type = "text";   question.placeholder = "Tapez l'énoncé de la question";question.required = true;


    var hijos="<input id='taux"+(numq+1)+"' name='taux"+(numq+1)+"' "+
    "type='number' class='taux' value='10' max='100' min='2' step='100' />%"+espacios+"Duree : "+

    "<input id='duree"+(numq+1)+"' name='duree"+(numq+1)+"' "+
    "type='number' class='taux' value='60' max='1800' min='30' step='10' /> sec."+espacios+

    "<select id='select"+(numq+1)+"' name='t_fichier"+(numq+1)+"' class='fichier' onchange='select_fichier("+(numq+1)+")' >"+
        "<option value='none' selected> + Fichier</option>"+
        "<option value='audio' >Audio</option>"+
        "<option value='image' >Image</option>"+
        "<option value='video' >Video</option></select>";

    var bSupprimer="<button class='button_supprimer' onclick='supprimer_question("+(numq+1)+")' >Supprimer</button>";
            
    var divR="";
    if(tipo=="Directe"){
        divR="<h6>Reponse</h6>" +
       "<input class='reponse' type='text' name='reponse" +(numq+1) + "' " +
       "placeholder='Tapez la reponse' required/>";
    }else{
        divR="<h6>Reponses : " + 
        "<button type='button' class='button_ajouter' onclick='ajouter_reponse(" +(numq+1) + 
        ")'>Reponse&nbsp;+</button> </h6>" +

        "<input type='hidden' name='reponses" +(numq+1) + "' id='reponses" +(numq+1) + "' value='2' />"+

        "<input class='reponse_qcm' type='text' name='q" +(numq+1) + "reponse1' " +
        "placeholder='Tapez la reponse' required />"+
        "<input class='checkbox' type='checkbox' checked='true' name='q"+(numq+1)+"cb1'/> correcte"+

        "<input class='reponse_qcm' type='text' name='q" +(numq+1) + "reponse2' " +
        "placeholder='Tapez la reponse' required />"+
        "<input class='checkbox' type='checkbox' name='q"+(numq+1)+"cb2'/> correcte";
    }
    
            
            h6.innerHTML+=hijos;
            h6.appendChild(label);
            h6.appendChild(inputFile);
            h6.innerHTML+=bSupprimer;
            h6.appendChild(inputTipe);

            nuevoDiv.appendChild(h6);
            nuevoDiv.appendChild(question);
            nuevoDiv.appendChild(inputQuestion);
            nuevoDiv.innerHTML+=(divR);
            

            document.getElementById('numeroq').value=(numq+1);
            document.getElementById('maxq').value=(numq+1);
            document.getElementById('nombreq').innerHTML="Questions #"+(numq+1);
            document.getElementById('questions').appendChild(nuevoDiv);
                  window.scrollTo(0, document.body.scrollHeight);
            }

function verifier_questions(){
    numq=parseInt(document.getElementById('numeroq').value);
    maxq=parseInt(document.getElementById('maxq').value);

    var sum_taux=0;
    for (var i = 1; i <= maxq; i++) {
        var input_taux= document.getElementById('taux'+i);
        if(input_taux)
            sum_taux+=parseInt(input_taux.value);
    }

    var valid = numq!=0 && sum_taux==100;

    if(numq==0){
        alert("Veillez ajouter au moins une question");
    }else if(sum_taux!=100){
        alert("La somme des taux doit etre 100%");
    }

    return valid;
}

function select_fichier(id){
    var valor=document.getElementById('select'+id).value;
    var milabel=document.getElementById('label_fichier'+id);
    var mifile=document.getElementById('fichier'+id);

    mifile.disabled = valor=="none";
    mifile.required = valor!="none";
    mifile.accept = valor=="none" ? '' : valor+"/*";
    milabel.style.backgroundColor= valor=="none" ? "lightgrey" : "green";
}

function supprimer_question(num){
    document.getElementById("question"+num).remove();
    numq=parseInt(document.getElementById('numeroq').value);
    document.getElementById("numeroq").value=numq-1;
    document.getElementById('nombreq').innerHTML="Questions #"+(numq-1);
    }

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

