
function ajouter_reponse(id){
    numReponses=parseInt(document.getElementById('reponses'+id).value);
    document.getElementById('reponses'+id).value=(numReponses+1);
    alert(document.getElementById('reponses'+id).value);


    var reponse = document.createElement("input");
    reponse.id = "q"+id+"reponse"+(numReponses+1);
    reponse.name = "q"+id+"reponse"+(numReponses+1);
    reponse.className = "reponse_qcm";
    reponse.type = "text";
    reponse.placeholder = "Tapez la reponse";
    reponse.required = true; 


    var nuevoCheckbox = document.createElement("input");
    nuevoCheckbox.id = "q"+id+"cb"+(numReponses+1);
    nuevoCheckbox.name = "q"+id+"reponse"+(numReponses+1);
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

            var h6=document.createElement("h6");
            h6.innerHTML+="Question " +tipo+" : "+ espacios+ "Taux : ";

            var inputTaux=document.createElement("input");
            inputTaux.type="number";
            inputTaux.id = "taux"+(numq+1);
            inputTaux.name= "taux"+(numq+1);
            inputTaux.className= "taux";
            inputTaux.value="10";
            inputTaux.max="100";
            inputTaux.min="2";
            inputTaux.step="2";

            var inputDuree=document.createElement("input");
            inputDuree.id = "duree"+(numq+1);
            inputDuree.name= "duree"+(numq+1);
            inputDuree.className= "taux";
            inputDuree.type="number";
            inputDuree.value="60";
            inputDuree.max="1800";
            inputDuree.min="30";
            inputDuree.step="10";

            var selectF=document.createElement("select");
            selectF.id = "select"+(numq+1);
            selectF.name= "select"+(numq+1);
            selectF.className= "fichier";
            selectF.type="number";

            const options = [
                { value: 'none', text: '+ fichier', selected: true },
                { value: 'audio', text: 'Audio' },
                { value: 'image', text: 'Image' },
                { value: 'video', text: 'Video' }
            ];

        options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.selected) option.selected = true;
        selectF.appendChild(option);
        });
        selectF.onchange = function () {
            select_fichier(numq + 1); // Call your function with the current number
        };

        const label = document.createElement('label');
        label.className = 'label_fichier';
        label.setAttribute('for', 'fichier' + (numq + 1));
        label.id = 'label_fichier' + (numq + 1);
        label.textContent = ' Choisir';

        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.name = 'fichier' + (numq + 1);
        inputFile.id = 'fichier' + (numq + 1);
        inputFile.disabled = true;

        const bSupprimer = document.createElement('button');
        bSupprimer.type = 'button';
        bSupprimer.className = 'button_supprimer';
        bSupprimer.textContent = 'Supprimer';
        bSupprimer.onclick = function () {
            supprimer_question(numq + 1);
        };

        var question = document.createElement("textarea");
        question.id = "ennonce" +(numq+1);
        question.name = "ennonce" +(numq+1);
        question.className = "question";
        question.type = "text";
        question.placeholder = "Tapez l'énoncé de la question";
        question.required = true;


            var divR="";
           if(tipo=="Directe"){
                divR="<h6>Reponse</h6>" +
               "<input class='reponse' type='text' id='reponse" +(numq+1) + "' " +
               "name='reponse" +(numq+1) + "' " +
               "placeholder='Tapez la reponse' required/>";
           }else{
                divR="<h6>Reponses : " + 
                "<button type='button' class='button_ajouter' onclick='ajouter_reponse(" +(numq+1) + 
                ")'>Reponse&nbsp;+</button> </h6>" +

                "<input type='hidden' name='reponses" +(numq+1) + "' id='reponses" +(numq+1) + "' value='2' />"+

                "<input class='reponse_qcm' type='text' id='q" +(numq+1) + "reponse1' " +
                "name='reponse" +(numq+1) + "' " +
                "placeholder='Tapez la reponse' required />"+
                "<input class='checkbox' type='checkbox' checked='true' "+
                "id='q"+(numq+1)+"cb1'/> correcte"+

                "<input class='reponse_qcm' type='text' id='q" +(numq+1) + "reponse2' " +
                "name='reponse" +(numq+1) + "' " +
                "placeholder='Tapez la reponse' required />"+
                "<input class='checkbox' type='checkbox' "+
                "id='q"+(numq+1)+"cb2'/> correcte";
        }
    
            h6.appendChild(inputTaux);
            h6.innerHTML+="%"+espacios+"Duree : ";
            h6.appendChild(inputDuree);
            h6.innerHTML+=" sec."+espacios;
            h6.appendChild(selectF);
            h6.appendChild(label);
            h6.appendChild(inputFile);
            h6.appendChild(bSupprimer);
            h6.appendChild(question);

            nuevoDiv.appendChild(h6);
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

