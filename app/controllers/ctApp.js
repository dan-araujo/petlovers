const mdUsers = require('../models/mdUsers');
const mdPets = require('../models/mdPets');
const formValidator = require('../utils/formValidator');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mailer = require('../../config/mailer');

module.exports = {

    loadHomePage: function(req, res){

        let reply = {};
        let formData = {};
        let userDataSession = {};
        let isAuthenticated = false;

        if(req.session.isAuthenticated){
            isAuthenticated = req.session.isAuthenticated;
            userDataSession = req.session.userDataSession;
        }

        if(!req.session.reply){

            req.session.formData = {};
            req.session.reply = {danger: [], success: []};
            formData = req.session.formData;
            reply = req.session.reply;

        } else {

            formData = req.session.formData;
            req.session.formData = {};
            reply = req.session.reply;
            req.session.reply = {danger: [], success: []};

        }
    
        res.render('home', {isAuthenticated: isAuthenticated, userData: userDataSession, reply: reply, formData: formData});
                
    },

    loadPretendentesPage: function(req, res){

        console.log('CT - loadPretendentesPage()');

        const thisObj = this;

        let isAuthenticated = req.session.isAuthenticated;
        let userData = req.session.userDataSession;

        if(isAuthenticated){

            this.getPetsPretendentes(function(petList){

                console.log('Retornando para CT - loadPretendentesPage() após CT - getPretendentes()');
    
                if(petList.length > 0){
    
                    thisObj.addPropDirTrackWithFileName(true, petList, function(arrPets){
    
                        arrPets.forEach(function(pet){
    
                            pet.disp = 'Pretendentes';
    
                        })
    
                        res.render('pretendentes',
                        {reply: {danger: [], success: []}, formData: {}, isAuthenticated: isAuthenticated, userData: userData, arrPets});
        
                    })
    
                } else {
    
                    let arrPets = [];
    
                    res.render('pretendentes', {reply: {danger: [], success: []}, formData: {}, isAuthenticated: isAuthenticated, userData: userData, arrPets});
    
                }
    
            })

        } else {

            req.session.reply.danger.push({msg: 'Você não está autenticado! Vá até o menu e clique em "Login" para fazer sua autenticação.', type: 'danger'});

            res.redirect('/home');

        }
  
    },

    loadAdocoesPage: function(req, res){

        console.log('CT - loadAdocoesPage()');

        const thisObj = this;

        let isAuthenticated = req.session.isAuthenticated;
        let userData = req.session.userDataSession;

        if(isAuthenticated){

            this.getPetsAdocoes(function(petList){

                if(petList.length > 0){
    
                    thisObj.addPropDirTrackWithFileName(true, petList, function(arrPets){
    
                        arrPets.forEach(function(pet){
                            pet.disp = 'Adoções';
                        })
    
                        res.render('adocoes', {reply: {danger: [], success: []}, formData: {}, isAuthenticated: isAuthenticated, userData: userData, arrPets});
        
                    })
    
                } else {
    
                    let arrPets = [];
    
                    res.render('adocoes',
                    {reply: {danger: [], success: []}, formData: {}, isAuthenticated: isAuthenticated, userData: userData, arrPets});
    
                }
    
            })

        } else {

            req.session.reply.danger.push({msg: 'Você não está autenticado! Vá até o menu e clique em "Login" para fazer sua autenticação.', type: 'danger'});

            res.redirect('/home');

        }
        
    },

    loadMeusPetsPage: function(req, res){

        console.log('CT - loadMeusPetsPage()');

        const thisObj = this;

        let isAuthenticated = req.session.isAuthenticated;

        if(isAuthenticated){

            const userData = req.session.userDataSession;
            
            const reply = req.session.reply;
            req.session.reply = {danger: [], success: []};

            const formData = req.session.formData;
            req.session.formData = {};
            

            this.getMeusPets(userData.id_user, function(petList){

                if(petList.length > 0){

                    console.log('CT - loadMeusPetsPage()/this.getMeusPets()');
                    console.log(petList);

                    thisObj.addPropDirTrackWithFileName(false, petList, function(arrPets){

                        arrPets.forEach(function(pet){
                            if(pet.disp === 'pretendentes'){
                                pet.disp = 'Pretendentes';
                            } else {
                                pet.disp = 'Adoções';
                            }
                        })
    
                        res.render('meus-pets', 
                        {isAuthenticated: isAuthenticated, reply: reply, formData: formData, userData: userData, arrPets});
        
                    })

                } else {

                    let arrPets = [];

                    res.render('meus-pets', 
                    {isAuthenticated: isAuthenticated, reply: reply, formData: formData, userData: userData, arrPets});

                }
    
            })

        } else {

            req.session.reply.danger.push({msg: 'Você não está autenticado! Vá até o menu e clique em "Login" para fazer sua autenticação.', type: 'danger'});

            res.redirect('/home');

        }
        
    },

    authenticateUser: function(req, res){

        console.log('authenticateUser()');

        const formData = req.body;
        let email = '';
        let senhaCrypto = '';
        let erros = false;

        formValidator.validateEmail('E-mail', formData.email, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
                erros = true;
            }
        });
        
        formValidator.validatePassword(formData.password, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
                erros = true;
            }
        })
    
        if(!erros){
    
            email = formData.email;
            senhaCrypto = crypto.createHash('sha1').update(formData.password).digest('hex');
    
            mdUsers.authenticateUser(email, senhaCrypto, function(reply){
    
                if(reply.type === 'danger'){
                    
                    req.session.reply.danger.push(reply);
                    req.session.formData = formData;
                    res.redirect('/home');
               
                } else {

                    const userData = reply.userData;

                    req.session.isAuthenticated = true;
                    req.session.userDataSession = {};
                    req.session.formData = {};
                    req.session.isUploadedFiles = false;
                    req.session.isDeletedUser = false;

                    req.session.userDataSession.id_user = userData.id_user;
                    req.session.userDataSession.nome_user = userData.nome_user;
                    req.session.userDataSession.email = userData.email;
                    req.session.userDataSession.telefone = userData.telefone;
                    req.session.userDataSession.whatsapp = userData.whatsapp;
                    
                    console.log('***********************');
                    console.log('USUÁRIO LOGADO COM SUCESSO!')
                    console.log('***********************');
                    console.log(req.session.userDataSession);
                    console.log('***********************');
    
                    req.session.reply.success.push(reply);
                    
                    if(req.session.isAuthenticated){
                        
                        res.redirect('/home');
                        
                    }
                   
                }
       
            })
    
        } else {

            req.session.formData = formData;
            res.redirect('/home');

        }
    
    },

    logout: function(req, res){
        
        req.session.reply = {success: [{msg:'Usuário desconectado com sucesso!', type: 'success'}], danger: []};
        req.session.formData = {};
        req.session.isAuthenticated = false;

        res.redirect('/home');
        
    },

    getUserById: function(req, res){

        const idUser = req.params.idUser;

        mdUsers.getUserById(idUser, function(userData){

            res.send(userData);

        })

    },

    postUser: function(req, res){

        console.log('CT - postUser()');

        const formData = req.body;

        formValidator.validateFullName('Nome', formData.nome_user, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
            }
        });

        formValidator.validateCPF(formData.cpf, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
            }
        });

        formValidator.validateEmail('E-mail', formData.email, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
            }
        });

        formValidator.compareEmail(formData.email, formData.email_confirm, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
            }
        });

        formValidator.validatePassword(formData.password, function(reply){
            if(reply.type === 'danger'){
                for(let erroObj of reply.erros){
                    req.session.reply.danger.push(erroObj);
                }
            }
        });
        
        formValidator.comparePassword(formData.password, formData.password_confirm, function(reply){
            if(reply.type === 'danger'){
                req.session.reply.danger.push(reply);
            }
        });
        
        if(formData.telefone.length === 0){
            req.session.reply.danger.push({msg: 'O campo [Telefone] precisa ser preenchido!', type: 'danger'});
        } else {
            formValidator.validateTelephone('WhatsApp', formData.telefone, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            })
        }

        if(formData.whatsapp.length > 0){
            formValidator.validateTelephone('WhatsApp', formData.whatsapp, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            })
        }

        if(formData.endereco_user.length === 0){
            req.session.reply.danger.push({msg:'O campo [Endereço] não foi preenchido!', type: 'danger'});
        } else if(formData.endereco_user.length < 3) {
            req.session.reply.danger.push({msg:'O campo [Endereço] possui menos que 3 caracteres!', type: 'danger'});
        } else if(formData.endereco_user.length > 50){
            req.session.reply.danger.push({msg:'O campo [Endereço] possui mais que 50 caracteres!', type: 'danger'});
        }

        if(formData.bairro_user.length === 0){
            req.session.reply.danger.push({msg:'O campo [Bairro] não foi preenchido!', type: 'danger'});
        } else if(formData.bairro_user.length < 3) {
            req.session.reply.danger.push({msg:'O campo [Bairro] possui menos que 3 caracteres!', type: 'danger'});
        } else if(formData.bairro_user.length > 50){
            req.session.reply.danger.push({msg:'O campo [Bairro] possui mais que 50 caracteres!', type: 'danger'});
        }

        if(formData.cidade_user.length === 0){
            req.session.reply.danger.push({msg:'O campo [Cidade] não foi preenchido!', type: 'danger'});
        } else if(formData.cidade_user.length < 3) {
            req.session.reply.danger.push({msg:'O campo [Cidade] possui menos que 3 caracteres!', type: 'danger'});
        } else if(formData.cidade_user.length > 50){
            req.session.reply.danger.push({msg:'O campo [Cidade] possui mais que 50 caracteres!', type: 'danger'});
        }
        
        if(formData.uf_user === '-'){
            req.session.reply.danger.push({msg:'O campo [UF] não foi preenchido!', type: 'danger'});
        }

        if(formData.termos_uso === undefined){
            req.session.reply.danger.push({msg:'Você precisa assinalar a caixa [Temos de Uso do Site]', type: 'danger'});
        }

        if (req.session.reply.danger.length > 0) {
            
            req.session.formData = req.body;
            return res.redirect('/home');

        } else {

            const senhaCrypto = crypto.createHash('sha1').update(formData.password).digest('hex');

            const formDataCopy = Object.assign({}, formData);
            formData.cpf = formData.cpf.replace(/[^0-9]/g, '');
            formData.password = senhaCrypto;
            formData.telefone = formData.telefone.replace(/[^0-9]/g, '');
            formData.whatsapp = formData.whatsapp.replace(/[^0-9]/g, '');
            delete formData.email_confirm;
            delete formData.password_confirm;
            delete formData.termos_uso;

            mdUsers.verifyIfCPFInUse(formData.cpf, function(reply){

                if(reply.type === 'danger'){

                    req.session.reply.danger.push(reply);

                    req.session.formData = formDataCopy;
                    return res.redirect('/home');

                } else {

                    mdUsers.postUser(formData, senhaCrypto, function(reply){

                        if(reply.type === 'danger'){
        
                            req.session.reply.danger.push(reply);
                            req.session.formData = formDataCopy;
                            res.redirect('/home');
        
                        } else {
        
                            req.session.reply.success.push(reply);
                            console.log('Retornando ao CT - postUser() após o MD - postUser()...');
                            console.log(reply);
                            res.redirect('/home');

                            //CRIA A PASTA DO USUÁRIO
                            /*
                            const dirUser = path.join(__filename, `../../public/uploads/user_${reply.idNewUser}`);

                            if(!fs.existsSync(dirUser)){

                                fs.mkdirSync(dirUser);

                            }
                            */
                        }
                        
                    })

                }

            })   

        }     

    },

    updateUser: function(req, res){

        console.log('updateUser()');
        console.log(req.body)

        if(!req.session.isAuthenticated){

            req.session.reply.danger.push({msg: 'Você precisa estar autenticado para poder realizar esta ação! Vá até o Menu e clique em "Entrar" para fazer sua autenticação...', type: 'danger'});

            res.redirect('/home');

        } else {

            const formData = req.body;

            formValidator.validateFullName('Nome', formData.nome_user, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.validateCPF(formData.cpf, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.validateEmail('E-mail', formData.email, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.compareEmail(formData.email, formData.email_confirm, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.validatePassword(formData.password, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.comparePassword(formData.password, formData.password_confirm, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            if(formData.telefone.length === 0){
                req.session.reply.danger.push({msg: 'O campo [Telefone] precisa ser preenchido!', type: 'danger'});
            } else {
                formValidator.validateTelephone('Telefone', formData.telefone, function(reply){
                    if(reply.type === 'danger'){
                        req.session.reply.danger.push(reply);
                    }
                })
            }
    
            if(formData.whatsapp.length > 0){
                formValidator.validateTelephone('WhatsApp', formData.whatsapp, function(reply){
                    if(reply.type === 'danger'){
                        req.session.reply.danger.push(reply);
                    }
                })
            }
    
            if(formData.endereco_user.length === 0){
                req.session.reply.danger.push({msg:'O campo [Endereço] não foi preenchido!', type: 'danger'});
            } else if(formData.endereco_user.length < 3) {
                req.session.reply.danger.push({msg:'O campo [Endereço] possui menos que 3 caracteres!', type: 'danger'});
            } else if(formData.endereco_user.length > 50){
                req.session.reply.danger.push({msg:'O campo [Endereço] possui mais que 50 caracteres!', type: 'danger'});
            }
    
            if(formData.bairro_user.length === 0){
                req.session.reply.danger.push({msg:'O campo [Bairro] não foi preenchido!', type: 'danger'});
            } else if(formData.bairro_user.length < 3) {
                req.session.reply.danger.push({msg:'O campo [Bairro] possui menos que 3 caracteres!', type: 'danger'});
            } else if(formData.bairro_user.length > 50){
                req.session.reply.danger.push({msg:'O campo [Bairro] possui mais que 50 caracteres!', type: 'danger'});
            }
    
            if(formData.cidade_user.length === 0){
                req.session.reply.danger.push({msg:'O campo [Cidade] não foi preenchido!', type: 'danger'});
            } else if(formData.cidade_user.length < 3) {
                req.session.reply.danger.push({msg:'O campo [Cidade] possui menos que 3 caracteres!', type: 'danger'});
            } else if(formData.cidade_user.length > 50){
                req.session.reply.danger.push({msg:'O campo [Cidade] possui mais que 50 caracteres!', type: 'danger'});
            }
            
            if(formData.uf_user === '-'){
                req.session.reply.danger.push({msg:'O campo [UF] não foi preenchido!', type: 'danger'});
            }
    
            if (req.session.reply.danger.length > 0) {
                
                req.session.formData = req.body;
                return res.redirect('/home');
    
            } else {
    
                const senhaCrypto = crypto.createHash('sha1').update(formData.password).digest('hex');
                const formDataCopy = Object.assign({}, formData);
                formData.password = senhaCrypto;
                formData.cpf = formData.cpf.replace(/[^0-9]/g, '');
                formData.telefone = formData.telefone.replace(/[^0-9]/g, '');
                formData.whatsapp = formData.whatsapp.replace(/[^0-9]/g, '');
                delete formData.email_confirm;
                delete formData.password_confirm;
                delete formData.termos_uso;

                const idUserReq = req.params.idUser;

                if(idUserReq != req.session.userDataSession.id_user){

                    req.session.formData = formDataCopy;
                    req.session.reply.danger.push({msg: 'Operação Inválida!', type: 'danger'});
                    return res.redirect('/home');

                } else {

                    mdUsers.getUserByCPF(formData.cpf, function(reply){

                        console.log('AQUI')
                        console.log(reply);

                        if(reply.length > 0 && reply[0].id_user != req.session.userDataSession.id_user){

                            req.session.reply.danger.push({msg: 'CPF já em uso por outro usuário!', type: 'danger'});
    
                            req.session.formData = formDataCopy;
                            return res.redirect('/home');

                        } else {

                            mdUsers.updateUser(idUserReq, formData, function(reply){

                                if(reply.type === 'danger'){
                
                                    req.session.reply.danger.push(reply);
                                    req.session.formData = formDataCopy;
    
                                    return res.redirect('/home');
                
                                } else {
                
                                    req.session.reply.success.push(reply);
                                    res.redirect('/home');
                
                                }
                                
                            })

                        }

                    })

                }
    
            }
            
        }

    },

    deleteUserAndHisPets: function(req, res){

        console.log('CT - deleteUserAndHisPet()');

        if(!req.session.isAuthenticated){

            req.session.reply.danger.push({msg: 'Você precisa estar autenticado para poder realizar esta ação! Vá até o Menu e clique em "Entrar" para fazer sua autenticação...', type: 'danger'});

            return res.redirect('/home');

        }

        const idUser = req.params.idUser;

        if(idUser != req.session.userDataSession.id_user){

            req.session.reply.danger.push({msg: 'Operação inválida!', type: 'danger'});
            return res.redirect('/home');

        }
        
        mdUsers.deleteUserAndHisPets(idUser, function(reply){

            console.log('Chamando mdUsers.deleteUserAndHisPets()...');

            req.session.destroy();
            res.render('reply-deleted-user', {reply: reply});
            
            deleteUserDirectories(idUser);

        })

        function deleteUserDirectories(idUser){

            const userAdocoesDir = path.join(__dirname, `../public/uploads/adocoes/user_${idUser}`);
            const userPretendentesDir = path.join(__dirname, `../public/uploads/pretendentes/user_${idUser}`);
            
            if(fs.existsSync(userAdocoesDir)){

                console.log('Diretório detectado --> ' + userAdocoesDir);

                const petsDirAtAdocoesDir = fs.readdirSync(userAdocoesDir);

                if(petsDirAtAdocoesDir.length > 0){

                    for(let petDir of petsDirAtAdocoesDir){

                        const filesInPetDir = fs.readdirSync(path.join(`${userAdocoesDir}/${petDir}`));

                        if(filesInPetDir.length > 0){

                            for(let file of filesInPetDir){

                                fs.unlinkSync(path.join(`${userAdocoesDir}/${petDir}/${file}`));

                            }

                            fs.rmdirSync(path.join(`${userAdocoesDir}/${petDir}`));

                        }

                    }
                    
                }

                setTimeout(function(){
                    fs.rmdirSync(userAdocoesDir);
                }, 2000)

            } else {

                console.log('Diretório não encontrado --> ' + userAdocoesDir)

            }

            if(fs.existsSync(userPretendentesDir)){

                console.log('Diretório detectado --> ' + userPretendentesDir);

                const petsDirAtPretendentessDir = fs.readdirSync(userPretendentesDir);

                if(petsDirAtPretendentessDir.length > 0){

                    for(let petDir of petsDirAtPretendentessDir){

                        const filesInPetDir = fs.readdirSync(path.join(`${userPretendentesDir}/${petDir}`));

                        if(filesInPetDir.length > 0){

                            filesInPetDir.forEach(function(file){
    
                                fs.unlinkSync(path.join(`${userPretendentesDir}/${petDir}/${file}`));
        
                            })

                        }

                        fs.rmdirSync(path.join(`${userPretendentesDir}/${petDir}`))

                    }

                    setTimeout(function(){
                        fs.rmdirSync(userPretendentesDir);
                    }, 2000)                    

                }

            } else {

                console.log('Diretório não encontrado --> ' + userPretendentesDir)

            }
            
        }
        
    },

    validateFieldsFormPet: function(req, cb){

        console.log('CT - validateFieldsFormPet()');

        if(!req.session.isAuthenticated){

            req.session.reply.danger.push({msg: 'Você precisa estar autenticado para poder realizar esta ação! Vá até o Menu e clique em "Entrar" para fazer sua autenticação...', type: 'danger'});

            cb();

        } else {

            const formData = req.body;

            formValidator.validateFullName('Nome', formData.nome_pet, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.validateFullName('Espécie', formData.especie, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            formValidator.validateFullName('Raça', formData.raca, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            });

            if(formData.sexo === undefined){
                req.session.reply.danger.push({msg: 'Informe o sexo do seu pet!', type: 'danger'});
            }

            if(formData.disp === undefined){
                req.session.reply.danger.push({msg: 'Informe o tipo de disponibilidade (objetivo) para seu pet!', type: 'danger'});
            }

            formValidator.validateBairro(formData.bairro_pet, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            })

            formValidator.validateCity(formData.cidade_pet, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            })

            formValidator.validateUF(formData.uf_pet, function(reply){
                if(reply.type === 'danger'){
                    req.session.reply.danger.push(reply);
                }
            })

            cb();
            
        }

    },

    postPet: function(req, res){

        const formData = req.body;

        console.log('Preparando para envio ao MD...');
                
        formData.id_tutor = req.session.userDataSession.id_user;
        formData.dir_fotos = req.session.userDataSession.dirSavedPetPic;
    
        mdPets.postPet(formData, function(reply){

            if(reply.type === 'danger'){

                req.session.reply.danger.push(reply);
                req.session.formData = formData;

            } else {

                req.session.reply.success.push(reply);

            }

            res.redirect('/meus_pets');
            
        });

    },

    updatePet: function(req, res){

        console.log('CTAPP-UPDATE-PET');

        const formData = req.body;
        formData.dir_fotos = req.session.userDataSession.dirSavedPetPic;

        if(!req.session.isAuthenticated){

            req.session.reply.danger.push({msg: 'Você precisa estar autenticado para poder realizar esta ação! Vá até o Menu e clique em "Entrar" para fazer sua autenticação...', type: 'danger'});

            res.redirect('/home');

        } else {

            console.log('Preparando para envio ao MD...');

            const idPet = req.params.idPet;
        
            mdPets.updatePet(idPet, formData, function(reply){

                if(reply.type === 'danger'){

                    req.session.reply.danger.push(reply);
                    req.session.formData = formData;

                } else {

                    req.session.reply.success.push(reply);

                }

                res.redirect('/meus_pets');
                
            });
            
        }

    },

    deletePet: function(req, res){

        console.log('CT - deletePet()');

        const thisObj = this;

        if(!req.session.isAuthenticated){

            req.session.reply.danger.push({msg: 'Você precisa estar autenticado para poder realizar esta ação! Vá até o Menu e clique em "Entrar" para fazer sua autenticação...', type: 'danger'});

            res.redirect('/home');

        } else {

            const idPet = req.params.idPet;

            mdPets.getPetById(idPet, function(result){

                const petData = result[0];

                thisObj.deletePetDir(petData.dir_fotos);

                mdPets.deletePet(idPet, function(reply){

                    req.session.reply.success.push(reply);
    
                    res.redirect('/meus_pets');                
    
                })

            })
            
        }

    },

    getPetsPretendentes: function(cb){

        console.log('CT - getPetsPretendentes()');

        mdPets.getPetsPretendentes(function(result){
            console.log('Retornando para CT - getPetsPretendentes() após consulta no DB...');
            cb(result);

        })

    },

    getPetsAdocoes: function(cb){

        console.log('CT - getPetsAdocoes()');

        mdPets.getPetsAdocoes(function(result){
            console.log('Retornando para CT - getPetsAdocoes() após consulta no DB...');
            cb(result);

        })

    },

    getMeusPets: function(userId, cb){

        console.log('CT - getMeusPets()');

        mdPets.getMeusPets(userId, function(result){

            cb(result);

        })

    },

    getPetById: function(req, res){

        const idPet = req.params.idPet;

        mdPets.getPetById(idPet, function(result){

            res.send(result[0]);

        })

    },

    addPropDirTrackWithFileName: function(isCardPic, petList, cb){

        console.log('CT - addPropDirTrackWithFileName()');

        if(isCardPic){

            for(let i = 0; i < petList.length; i++){

                this.createDirTrackWithFileName(true, petList[i], function(dirTrackWithFileName){
    
                    petList[i].cardPic = dirTrackWithFileName;
    
                    if(i === petList.length - 1){
                        cb(petList);
                    }   
                    
                })
    
            }

        } else {

            for(let i = 0; i < petList.length; i++){

                this.createDirTrackWithFileName(false, petList[i], function(arrlocalsDirWithFileName){
    
                    petList[i].cardPic = arrlocalsDirWithFileName[0];
                    petList[i].picLocals = arrlocalsDirWithFileName;
    
                    if(i === petList.length - 1){
                        cb(petList);
                    }   
                    
                })
    
            }

        }

    },

    createDirTrackWithFileName: function(isCardPic, pet, cb){

        console.log('CT - createDirTrackWithFileName()');

        if(isCardPic){

            fs.readdir(pet.dir_fotos, function(err, files){
            
                let dirTrackWithFileName = pet.dir_fotos.substring(pet.dir_fotos.indexOf('uploads')) + '/' + files[0];
                cb(dirTrackWithFileName);
                    
            })

        } else {

            fs.readdir(pet.dir_fotos, function(err, files){

                if(err){
                    console.log('Erro na leitura do diretório...')
                    console.log(err);
                } else {

                    const arrlocalsDirWithFileName = [];

                    files.forEach(function(file){
    
                        arrlocalsDirWithFileName.push(pet.dir_fotos.substring(pet.dir_fotos.indexOf('uploads')) + '/' + file);
    
                    })
                    
                    cb(arrlocalsDirWithFileName);

                }
                    
            })

        }

    },

    deletePetDir: function(petDir){

        const petDirName = path.join(__dirname, `../${petDir.substring(petDir.indexOf('public'))}`);
        const filesAtPetDir = fs.readdirSync(petDirName);
        
        filesAtPetDir.forEach(function(file){
            fs.unlinkSync(`${petDirName}/${file}`);
        })

        fs.rmdirSync(petDirName);

    },

    userPwdRedefinition: {
        
        searchUser: function(req, res){

            console.log('CT - userPwdRedefinition.searchUser()');
            
            const thisObj = this;
            const email = req.body.email;

            console.log(email);

            formValidator.validateEmail('E-mail', email, function(reply){

                if(reply.type === 'danger'){

                    res.send(reply);

                } else {

                    mdUsers.getUserByEmail(email, function(result){

                        if(result.length > 0){

                            console.log('CT - E-mail localizado!');
                            
                            thisObj.generateTokenForPwdRedefitionAndSaveOnDB(email, result[0].nome_user, req, res);

                        } else {

                            console.log('E-mail não encontrado ou incorreto!');
            
                            res.send({msg: '<div style="position: relative; top: 40%; transform: translateY(-50%);"><p>Usuário não encontrado!</p><p>Por favor, verifique o e-mail informado.</p></div>', type: 'danger'});
            
                        }
            
                    })

                }

            })

        },

        generateTokenForPwdRedefitionAndSaveOnDB: function(email, nameUser, req, res){

            const thisObj = this;
            const tokenPwd = {token_pwd: crypto.randomBytes(20).toString('hex')};
            
            mdUsers.saveTokenPwd(email, tokenPwd, function(reply){

                if(reply.type === 'success'){
                    
                    thisObj.sendTokenMail(nameUser, email, tokenPwd.token_pwd, req, res);

                } 

            })

        },
    
        sendTokenMail: function(nameUser, email, tokenPwd, req, res){
        
            mailer.sendTokenMail(nameUser, email, tokenPwd, function(mailReply){
                
                res.send(mailReply);
    
            });
        
        },

        redefinePwd: function(req, res){
            
            console.log('CT - userPwdRedefinition.redefinePwd()');

            const method = req.route.stack[0].method;
            
            if(method === 'get'){
        
                const email = req.query.email;
                const tokenPwd = req.query.token;

                console.log(email);
                console.log(tokenPwd);
        
                mdUsers.getUserByEmail(email, function(result){
        
                    if(result.length > 0){
        
                        if(tokenPwd === result[0].token_pwd){
        
                            res.render('redefinir-senha', {reply: [], usermail: email, tokenPwd: tokenPwd, pwd: '', pwdConfirm: ''});
        
                        } else {
        
                            const erro = ['Link inválido! Solicite um novo link de redefinição de senha.'];
        
                            res.render('redefinir-senha', {reply: erro, usermail: email, tokenPwd: tokenPwd, pwd: '', pwdConfirm: ''});
        
                        }
        
                    } else {
        
                        const erro = ['E-mail de cadastro não localizado!'];
        
                        res.render('redefinir-senha', {reply: erro, usermail: email, tokenPwd: tokenPwd, pwd: '', pwdConfirm: ''});
        
                    }
        
                })
        
            } else if(method === 'post'){
                
                const formData = req.body;
                const erros = []
                
                formValidator.validateEmail('E-mail', formData.usermail, function(replyObj){
                    if(replyObj.type === 'danger'){
                        erros.push(replyObj.msg);
                    }
                });

                formValidator.validateToken(formData.pwd_token, function(replyObj){
                    if(replyObj.type === 'danger'){
                        erros.push(replyObj.msg);
                    }
                });

                formValidator.validatePassword(formData.pwd, function(replyObj){
                    if(replyObj.type === 'danger'){
                        for(let obj of replyObj.erros){
                            erros.push(obj.msg);
                        }
                    }
                })

                formValidator.comparePassword(formData.pwd, formData.pwd_confirm, function(replyObj){
                    if(replyObj.type === 'danger'){
                        erros.push(replyObj.msg);
                    }
                });
        
                if(erros.length > 0){
                    
                    console.log(erros);

                    res.render('redefinir-senha', {reply: erros, usermail: formData.usermail, tokenPwd: formData.pwd_token, pwd: formData.pwd, pwdConfirm: formData.pwd_confirm});
        
                } else {
        
                    mdUsers.getUserByEmail(formData.usermail, function(result){
        
                        if(result.length > 0){
        
                            if(formData.pwd_token === result[0].token_pwd){
        
                                const pwdCrypto = crypto.createHash('sha1').update(formData.pwd).digest('hex');
    
                                mdUsers.changePwdByEmail(result[0].email, pwdCrypto, function(reply){
    
                                    if(reply.type === 'success'){
    
                                        res.render('senha-redefinida-sucesso', {reply: {msg: 'Senha redefinida com sucesso!', type: 'success'}});
                                        
                                    } else {
    
                                        erros.push('Erro inesperado durante a redefinição de senha! Tente novamente...');
    
                                        res.render('redefinir-senha', {reply: erros, usermail: formData.usermail, tokenPwd: formData.pwd_token, pwd: formData.pwd, pwdConfirm: formData.pwd_confirm});
    
                                    }
    
                                })
                                
                            } else {
        
                                erros.push('Link inválido! Solicite um novo link de redefinição de senha.');
        
                                res.render('redefinir-senha', {reply: erros, usermail: formData.usermail, tokenPwd: formData.pwd_token, pwd: formData.pwd, pwdConfirm: formData.pwd_confirm});
        
                            }
        
                        } else {
        
                            erros.push('E-mail de cadastro não localizado!');
        
                            res.render('redefinir-senha', {reply: erros, usermail: formData.usermail, tokenPwd: formData.pwd_token, pwd: formData.pwd, pwdConfirm: formData.pwd_confirm});
        
                        }
        
                    })
        
                }
        
            }
            
        }
    
    }

}