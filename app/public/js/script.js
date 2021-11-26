$(document).ready(function(){

    updateMenuNomeUser();

    //const modalAreaRespostaPesquisaUsuario = document.querySelector('#modal_area_resposta_pesquisa_usuario');

    const menuLinkCadUser = document.querySelector('#menu_link_cad_user');
    const menuLinkMeusDadosPessoais = document.querySelector('#menu_link_meus_dados_pessoais');
    const menuLinkCancelarMinhaConta = document.querySelector('#menu_link_cancelar_minha_conta');
    const formUser = document.querySelector('#form_user');
    const btnCadUser = document.querySelector('#btn_cad_user');
    const btnUpdateUser = document.querySelector('#btn_update_user');
    const formLogin = document.querySelector('#form_login');
    const btnLogin = document.querySelector('#btn_login');
    const formPet = document.querySelector('#form_pet');
    const btnCadPet = document.querySelector('#btn_cad_pet');
    const formPesquisaUsuarioModalRedefSenha = document.querySelector('#form-pesquisa-usuario');
    const inputEmailModalRedefSenha = document.querySelector('#input_email_modal_redef_senha');
    const areaReplyModalRedefSenha = document.querySelector('#area_reply_modal_redef_senha');
    const btnPesquisarModalRedefSenha = document.querySelector('#btn_pesquisar_modal_redef_senha');
    const btnVoltarModalRedefSenha = document.querySelector('#btn_voltar_modal_redef_senha');

    if(menuLinkCadUser){
        menuLinkCadUser.addEventListener('click', configformUserForNewCadUser);
    }

    if(menuLinkMeusDadosPessoais){
        menuLinkMeusDadosPessoais.addEventListener('click', configFormUserForEditUser);
        menuLinkMeusDadosPessoais.addEventListener('click', getUserDataSessionAndPutInFormUser);
    }

    if(menuLinkCancelarMinhaConta){
        menuLinkCancelarMinhaConta.addEventListener('click', deleteUser);
    }

    btnCadUser.addEventListener('click', function(){
        formUser.submit();
    })

    btnUpdateUser.addEventListener('click', function(){
        formUser.submit();
    })

    btnLogin.addEventListener('click', function(){
        formLogin.submit();
    })

    btnCadPet.addEventListener('click', function(){
        formPet.submit();
    })

    if(formUser.uf_user.dataset.uf !== undefined){

        const uf = formUser.uf_user.dataset.uf;

        for(let i = 0; i < formUser.uf_user.options.length; i++){

            if(formUser.uf_user.options[i].text === uf){

                formUser.uf_user.selectedIndex = i;
                break;

            }

        }

    }

    if(formPet.uf_pet.dataset.uf !== undefined){

        const uf = formPet.uf_pet.dataset.uf;

        for(let i = 0; i < formPet.uf_pet.options.length; i++){

            if(formPet.uf_pet.options[i].text === uf){

                formPet.uf_pet.selectedIndex = i;
                break;

            }

        }

    }

    btnPesquisarModalRedefSenha.addEventListener('click', submitFormPesquisaUsuario);
    
    btnVoltarModalRedefSenha.addEventListener('click', function(){

        areaReplyModalRedefSenha.classList.toggle('d-none');
        inputEmailModalRedefSenha.classList.toggle('d-none');
        btnPesquisarModalRedefSenha.classList.toggle('d-none');
        btnVoltarModalRedefSenha.classList.toggle('d-none');

    })
    
    function configformUserForNewCadUser(){

        const modalFormUserLabel = document.querySelector('#modalFormUserLabel');
        const formUser = document.querySelector('#form_user');
        const btnCadUser = document.querySelector('#btn_cad_user');
        const btnUpdateUser = document.querySelector('#btn_update_user');

        modalFormUserLabel.textContent = 'Registro de usuários';
        formUser.setAttribute('action', `/usuarios/cadastrar`);
        btnCadUser.style.display = 'block';
        btnUpdateUser.style.display = 'none';
    
    }

    function configFormUserForEditUser(evt){

        const idUser = evt.target.dataset.idUser;
        const modalFormUserLabel = document.querySelector('#modalFormUserLabel');
        const formUser = document.querySelector('#form_user');
        const btnCadUser = document.querySelector('#btn_cad_user');
        const btnUpdateUser = document.querySelector('#btn_update_user');
    
        modalFormUserLabel.textContent = 'Editando seus dados...';
        formUser.setAttribute('action', `/usuarios/update/${idUser}`);
        btnCadUser.style.display = 'none';
        btnUpdateUser.style.display = 'block';
    
    }

    function getUserDataSessionAndPutInFormUser(evt){

        const idUser = evt.target.dataset.idUser;
        const formUser = document.querySelector('#form_user');

        $.ajax({

            url: `/usuarios/${idUser}`,
            method: 'GET',
            cache: false

        }).done(function(reply){

            const userData = reply.userData;

            formUser.nome_user.value = userData.nome_user;
            formUser.cpf.value = userData.cpf;
            formUser.email.value = userData.email;
            formUser.email_confirm.value = userData.email;
            formUser.telefone.value = userData.telefone;
            formUser.whatsapp.value = userData.whatsapp;
            formUser.endereco_user.value = userData.endereco_user;
            formUser.bairro_user.value = userData.bairro_user;
            formUser.cidade_user.value = userData.cidade_user;

            for(let i = 0; i < formUser.uf_user.options.length; i++){

                if(formUser.uf_user.options[i].text === userData.uf_user){

                    formUser.uf_user.selectedIndex = i;
                    break;

                }

            }

        })

    }

    function deleteUser(evt){

        const idUser = evt.target.dataset.idUser;

        window.open(`/usuarios/delete/${idUser}`, '_self');

    }

    function updateMenuNomeUser(){

        const menuLinkNomeUser = document.querySelector('#menu_link_nome_user');
        const menuLinkMeusDadosPessoais = document.querySelector('#menu_link_meus_dados_pessoais');
        
        if(menuLinkNomeUser){
    
            const idUserSession = menuLinkMeusDadosPessoais.dataset.idUser;
    
            $.ajax({
    
                url: `/usuarios/${idUserSession}`,
                method: 'GET',
                cache: false
        
            }).done(function(reply){
        
                const userData = reply.userData;    
                menuLinkNomeUser.textContent = userData.nome_user;
                
            })
    
        }

    }

    function submitFormPesquisaUsuario(evt){

        console.log('submitFormPesquisaUsuario()');
        
        inputEmailModalRedefSenha.classList.toggle('d-none');
        areaReplyModalRedefSenha.classList.toggle('d-none');
        areaReplyModalRedefSenha
        .innerHTML = `<div class="position-relative" style="width: 20%; left: 50%; top: 50%; transform: translate(-50%, -50%);"><img src="img/loading.gif" style="width: 100%;"></div>`;
        
        const formData = $(formPesquisaUsuarioModalRedefSenha).serialize();

        console.log(formData)

        setTimeout(function(){

            $.ajax({
                url: '/redefinicao_senha',
                method: 'POST',
                data: formData,
                cache: false,
                success: function(replyObj){
    
                    console.log(replyObj);
    
                    if(replyObj.type === 'success'){
    
                        areaReplyModalRedefSenha
                        .innerHTML = `<p style="position: relative; top: 50%; transform: translateY(-50%);">${replyObj.msg}</p>`;
    
                        btnPesquisarModalRedefSenha.classList.toggle('d-none');
                        btnVoltarModalRedefSenha.classList.toggle('d-none');
                        
                    } else {
    
                        areaReplyModalRedefSenha.innerHTML = `<p style="position: relative; top: 50%; transform: translateY(-50%);">${replyObj.msg}</p>`;
                        
                        btnPesquisarModalRedefSenha.classList.toggle('d-none');
                        btnVoltarModalRedefSenha.classList.toggle('d-none');

                    }
                    
                }
            })

        }, 2000);

    }
    /*
    function sendTokenMail(btn){
    
        areaReplyModalRedefSenha.innerHTML = `<div class="position-relative" style="width: 20%; left: 50%; top: 50%; transform: translate(-50%, -50%);"><img src="img/loading.gif" style="width: 100%;"></div>`;
    
        $.ajax({
            url: `/send_token_mail?username=${btn.dataset.username}&usermail=${btn.dataset.usermail}`,
            method: 'GET',
            cache: false,
            success: function(replyObj){
    
                if(replyObj.type === 'success'){
    
                    document.querySelector('#btn_envia_email').style.display = 'none';
                    $(areaReplyModalRedefSenha).html(`<div style="position: relative; top: 50%; transform: translateY(-50%);"><p>${replyObj.msg}</p><p class="text-center">${replyObj.usermail}</p></div>`);
                    
                } else {
    
                    $(areaReplyModalRedefSenha).html(replyObj.msg);
                    
                }
                
            }
        })
    
    }
    */
})





 

    

    