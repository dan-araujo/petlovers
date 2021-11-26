$(document).ready(function(){

    const menuLinkCadPet = document.querySelector('#menu_link_cad_pet');
    const btnDeletePet = document.querySelectorAll('.btn_delete_pet');
    const btnEditPet = document.querySelectorAll('.btn_edit_pet');

    menuLinkCadPet.addEventListener('click', configFormPetForNewCadPet);

    btnDeletePet.forEach(function(btn){

        btn.addEventListener('click', function(evt){

            const idPet = evt.target.dataset.idPet;
            window.open(`/pets/delete/${idPet}`, '_self');

        })

    })

    btnEditPet.forEach(function(btn){

        btn.addEventListener('click', configFormPetForEditPet);
        btn.addEventListener('click', putPetDataInFormPet);

    });

})

function configFormPetForEditPet(evt){

    const idPet = evt.target.dataset.idPet;
    const modalCadPetLabel = document.querySelector('#modalCadPetLabel');
    const formPet = document.querySelector('#form_pet');
    const ctnInputsFile = document.querySelector('#ctn_input_file');
    const inputsFile = document.querySelectorAll('.form-control-file');
    const btnCadPet = document.querySelector('#btn_cad_pet');
    const btnUpdatePet = document.querySelector('#btn_update_pet');
    /*
    inputsFile.forEach(function(input){
        input.disabled = true;
    })
    */
    modalCadPetLabel.textContent = 'Editando seu Pet...';
    formPet.reset();
    //formPet.setAttribute('enctype', 'application/x-www-form-urlencoded');
    formPet.setAttribute('action', `/pets/update/${idPet}`);
    //ctnInputsFile.style.display = 'none';
    btnCadPet.style.display = 'none';
    btnUpdatePet.classList.remove('d-none');
    btnUpdatePet.style.display = 'block';

    btnUpdatePet.addEventListener('click', function(){
        formPet.submit();
    })

}

function configFormPetForNewCadPet(){

    const modalCadPetLabel = document.querySelector('#modalCadPetLabel');
    const formPet = document.querySelector('#form_pet');
    const ctnInputsFile = document.querySelector('#ctn_input_file');
    const inputsFile = document.querySelectorAll('.form-control-file');
    const btnCadPet = document.querySelector('#btn_cad_pet');
    const btnUpdatePet = document.querySelector('#btn_update_pet');

    inputsFile.forEach(function(input){
        input.disabled = false;
    })

    modalCadPetLabel.textContent = 'Cadastro de Pets';
    formPet.reset();
    formPet.setAttribute('enctype', 'multipart/form-data');
    formPet.setAttribute('action', `/pets/cadastrar`);
    ctnInputsFile.style.display = 'block';
    btnCadPet.style.display = 'block';
    btnUpdatePet.style.display = 'none';

}

function putPetDataInFormPet(evt){

    const idPet = evt.target.dataset.idPet;
    const formPet = document.querySelector('#form_pet');

    $.ajax({

        url: `/pets/${idPet}`,
        method: 'GET',
        cache: false

    }).done(function(petData){

        formPet.nome_pet.value = petData.nome_pet;
        formPet.especie.value = petData.especie;
        formPet.raca.value = petData.raca;

        if(petData.sexo === 'Macho'){
            document.querySelector('#macho').checked = true;
        } else {
            document.querySelector('#femea').checked = true;
        }

        if(petData.disp === 'pretendentes'){
            document.querySelector('#pretendentes').checked = true;
        } else {
            document.querySelector('#adocoes').checked = true;
        }

        formPet.bairro_pet.value = petData.bairro_pet;
        formPet.cidade_pet.value = petData.cidade_pet;

        for(let i = 0; i < formPet.uf_pet.options.length; i++){

            if(formPet.uf_pet.options[i].text === petData.uf_pet){

                formPet.uf_pet.selectedIndex = i;
                break;

            }

        }

    })

}
