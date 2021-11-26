const ctApp = require('../controllers/ctApp');
const mdPets = require('../models/mdPets');
const upload = require('../../config/multer');
const fs = require('fs');
const path = require('path');

module.exports = function(server){

    // CARREGA A HOME - ENTRADA DO PORTAL - ÁREA PÚBLICA
    server.get('/', function(req, res){
        ctApp.loadHomePage(req, res);
    })
    // CARREGA A HOME - ENTRADA DO PORTAL - ÁREA PÚBLICA
    server.get('/home', function(req, res){
        ctApp.loadHomePage(req, res);
    })

    server.get('/pretendentes', function(req, res){
        ctApp.loadPretendentesPage(req, res);
    })

    server.get('/adocoes', function(req, res){
        ctApp.loadAdocoesPage(req, res);
    })

    server.get('/meus_pets', function(req, res){
        ctApp.loadMeusPetsPage(req, res);
    })

    server.get('/pets/:idPet', function(req, res){
        ctApp.getPetById(req, res);
    })
    
    server.post('/pets/cadastrar', function(req, res){

        console.log('RT - /pets/cadastrar...');
        
        upload(req, res, function(err){

            console.log('Retornando ao RT - upload...');

            if(req.session.isUploadedFiles){

                if(err){

                    if(typeof(err) === 'boolean'){
    
                        console.log('Erros detectados na validação do formPet!');
                        req.session.isUploadedFiles = false;
                        req.session.formData = req.body;
                        return res.redirect('/meus_pets');
    
                    } else {
                        
                        req.session.isUploadedFiles = false;
                        req.session.reply.danger.push({msg: 'Uma de suas imagens excederam o limite de 1 MB!', type: 'danger'});
                        req.session.formData = req.body;
                        return res.redirect('/meus_pets');
    
                    }
    
                } else {
                    
                    req.session.isUploadedFiles = false;
                    ctApp.postPet(req, res);
    
                }

            } else {

                ctApp.validateFieldsFormPet(req, function(){

                    req.session.reply.danger.push({msg: 'Insira ao menos 1 foto do seu pet!', type: 'danger'});
                    req.session.formData = req.body;
                    return res.redirect('/meus_pets');

                })

            }
        
        })
        
    })

    server.post('/pets/update/:idPet', function(req, res){

        console.log('RT - /pets/update/:idPet...');
        
        upload(req, res, function(err){

            console.log('Retornando ao RT - upload...');

            if(req.session.isUploadedFiles){

                if(err){

                    if(typeof(err) === 'boolean'){
    
                        console.log('Erros detectados na validação do formPet!');
                        req.session.isUploadedFiles = false;
                        req.session.formData = req.body;
                        return res.redirect('/meus_pets');
    
                    } else {
                        
                        console.log('Uma de suas imagens excederam o limite de 1 MB!');
                        req.session.isUploadedFiles = false;
                        req.session.reply.danger.push({msg: 'Uma de suas imagens excederam o limite de 1 MB!', type: 'danger'});
                        req.session.formData = req.body;
                        return res.redirect('/meus_pets');
    
                    }
    
                } else {
                    
                    req.session.isUploadedFiles = false;
                    ctApp.updatePet(req, res);
    
                }

            } else {

                ctApp.validateFieldsFormPet(req, function(){

                    if(req.session.reply.danger.length > 0){

                        req.session.formData = req.body;
                        return res.redirect('/meus_pets');

                    } else {

                        console.log('RT - /pets/update/:idPet / atualização sem arquivos...')

                        const idUser = req.session.userDataSession.id_user;
                        const idPet = req.params.idPet;
                        const formPetDisp = req.body.disp;
                        
                        let petData = {};
                        const newDirFotosPet = 
                        path.join(__dirname, `../public/uploads/${formPetDisp}/user_${idUser}/pet_${idPet}`);
                        let actualDirFotosPet = '';

                        mdPets.getPetById(idPet, function(result){

                            petData = result[0];
                            actualDirFotosPet = path.join(__dirname, `../${petData.dir_fotos.substring(petData.dir_fotos.indexOf('public'))}`);

                            if(actualDirFotosPet === newDirFotosPet){

                                console.log('O mesmo diretório...')
                                req.session.userDataSession.dirSavedPetPic = actualDirFotosPet;
                                ctApp.updatePet(req, res);
            
                            } else {
            
                                console.log('Diretório diferente...')
            
                                const filesAtActualDirFotosPet = fs.readdirSync(actualDirFotosPet);
                                const dirPetDisp = path.join(__dirname, `../public/uploads/${formPetDisp}`);
                                const dirPetDispUserId = path.join(dirPetDisp, `/user_${idUser}`);
                                const dirPetDispUserIdPetId = path.join(dirPetDispUserId, `/pet_${idPet}`);

                                if (!fs.existsSync(dirPetDisp)){
                                    //Efetua a criação do diretório
                                    fs.mkdirSync(dirPetDisp);
                                }
            
                                if (!fs.existsSync(dirPetDispUserId)){
                                    //Efetua a criação do diretório
                                    fs.mkdirSync(dirPetDispUserId);
                                }
            
                                if (!fs.existsSync(dirPetDispUserIdPetId)){
                                    //Efetua a criação do diretório
                                    fs.mkdirSync(dirPetDispUserIdPetId);
                                }
            
                                filesAtActualDirFotosPet.forEach(function(file){

                                    fs.copyFileSync(path.join(`${actualDirFotosPet}/${file}`), path.join(`${newDirFotosPet}/${file}`));

                                })
                                
                                filesAtActualDirFotosPet.forEach(function(file){
                                    fs.unlinkSync(path.join(`${actualDirFotosPet}/${file}`));
                                })
                                
                                fs.rmdirSync(actualDirFotosPet);
                                
                                req.session.userDataSession.dirSavedPetPic = newDirFotosPet;
                                
                                ctApp.updatePet(req, res);
                                
                            }

                        })

                    }

                })

            }
        
        })

    })
    
    server.get('/pets/delete/:idPet', function(req, res){
        ctApp.deletePet(req, res);
    })

    server.get('/usuarios/:idUser', function(req, res){
        ctApp.getUserById(req, res);
    })
    
    server.post('/usuarios/cadastrar', function(req, res){
        ctApp.postUser(req, res);
    })

    server.post('/usuarios/update/:idUser', function(req, res){
        ctApp.updateUser(req, res);
    })

    server.get('/usuarios/delete/:idUser', function(req, res){
        ctApp.deleteUserAndHisPets(req, res);
    })

    // REQUISIÇÃO FEITA ATRAVÉS DO MODAL FORM DE LOGIN - APÓS AUTENTICAR, LIBERA NO MENU OS LINKS CADASTRAR PET
    server.post('/usuarios/autenticar', function(req, res){
        ctApp.authenticateUser(req, res);
    })

    server.get('/sair', function(req, res){
        ctApp.logout(req, res);
    })

    /*************************************************************/

    server.post('/redefinicao_senha', function(req, res){
        ctApp.userPwdRedefinition.searchUser(req, res);
    })

    server.get('/redefinir_senha', function(req, res){
        ctApp.userPwdRedefinition.redefinePwd(req, res);
    })

    server.post('/redefinir_senha', function(req, res){
        ctApp.userPwdRedefinition.redefinePwd(req, res);
    })

    /****************************************************************/
    
}