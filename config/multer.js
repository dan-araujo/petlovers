const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ctApp = require('../app/controllers/ctApp');
const mdPets = require('../app/models/mdPets');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        console.log('MULTER.JS - DESTINATION');

        const idUser = req.session.userDataSession.id_user;
        const idPet = req.params.idPet;
        const petDisp = req.body.disp;

        const dirPetDisp = path.join(__filename, `../../app/public/uploads/${petDisp}`);
        const dirPetDispUserId = `${dirPetDisp}/user_${idUser}`;
        let dirPetDispUserIdNewIdPet = '';

        // SE FOR UNDEFINED, É PORQUE O FOI UM NOVO CADASTRO
        if(idPet === undefined){

            mdPets.getLastIdPet(function(lastIdPet){

                dirPetDispUserIdNewIdPet = `${dirPetDispUserId}/pet_${lastIdPet + 1}`;
                dirPetDispUserIdNewIdPet = dirPetDispUserIdNewIdPet.replace(/\\/g, '/');
    
                //Verifica se não existe
                if (!fs.existsSync(dirPetDisp)){
                    //Efetua a criação do diretório
                    fs.mkdirSync(dirPetDisp);
                }
    
                if (!fs.existsSync(dirPetDispUserId)){
                    //Efetua a criação do diretório
                    fs.mkdirSync(dirPetDispUserId);
                }
    
                if (!fs.existsSync(dirPetDispUserIdNewIdPet)){
                    //Efetua a criação do diretório
                    fs.mkdirSync(dirPetDispUserIdNewIdPet);
                }
    
                console.log('DIR --> ' + dirPetDispUserIdNewIdPet);
                req.session.userDataSession.dirSavedPetPic = dirPetDispUserIdNewIdPet;
    
                console.log(req.session.userDataSession);
    
                cb(null, dirPetDispUserIdNewIdPet);
    
            })
        // SE TEVE idPet, TRATA-SE DE UMA EDIÇÃO DE CADASTRO DE UM PET
        } else {

            console.log('MULTER - mdPets.getPetById()');

            mdPets.getPetById(idPet, function(result){

                const petData = result[0];
                const actualDirFotosPet = path.join(__dirname, `../../${petData.dir_fotos.substring(petData.dir_fotos.indexOf('app'))}`);

                const formPetSelectedDir = path.join(dirPetDispUserId, `/pet_${idPet}`);

                if(actualDirFotosPet === formPetSelectedDir){

                    console.log('O mesmo diretório...')

                    const filesAtActualDirFotosPet = fs.readdirSync(actualDirFotosPet);

                    filesAtActualDirFotosPet.forEach(function(file){
                        console.log('Excluindo arquivo --> ' + file);
                        fs.unlinkSync(path.join(`${actualDirFotosPet}/${file}`));
                    })

                    req.session.userDataSession.dirSavedPetPic = actualDirFotosPet;

                    cb(null, actualDirFotosPet);

                } else {

                    console.log('Diretório diferente...')

                    const filesAtActualDirFotosPet = fs.readdirSync(actualDirFotosPet);

                    filesAtActualDirFotosPet.forEach(function(file){
                        fs.unlinkSync(path.join(`${actualDirFotosPet}/${file}`));
                    })

                    fs.rmdirSync(actualDirFotosPet);

                    //CRIAR O NOVO CAMINHO
                    if (!fs.existsSync(dirPetDisp)){
                        //Efetua a criação do diretório
                        fs.mkdirSync(dirPetDisp);
                    }

                    if (!fs.existsSync(dirPetDispUserId)){
                        //Efetua a criação do diretório
                        fs.mkdirSync(dirPetDispUserId);
                    }

                    if (!fs.existsSync(path.join(dirPetDispUserId, `/pet_${idPet}`))){
                        //Efetua a criação do diretório
                        fs.mkdirSync(path.join(dirPetDispUserId, `/pet_${idPet}`));
                    }

                    console.log('Novo diretório de destino...')
                    console.log(path.join(dirPetDispUserId, `/pet_${idPet}`))

                    req.session.userDataSession.dirSavedPetPic = path.join(dirPetDispUserId, `/pet_${idPet}`);

                    cb(null, path.join(dirPetDispUserId, `/pet_${idPet}`));

                }
                
            })

        }

    },

    filename: function (req, file, cb) {
        
        console.log('MULTER - fileName');
        
        // Extração da extensão do arquivo original:
        //const extensionFile = file.originalname.split('.')[1];
        const extensionFile = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        // Cria um código randômico que será o nome do arquivo
        const newNameFile = 'img_' + Date.now();
        // Determina o formato do nome e extensão do arquivo
        const fileNameWithExtension = newNameFile + '.' + extensionFile;
        // Indica o novo nome do arquivo:
        cb(null, fileNameWithExtension);
    }

});
// 1A
const upload = multer({

    storage: storage,
    // 1B
    fileFilter: function(req, file, cb){

        req.session.isUploadedFiles = true;

        console.log('Multer - FileFilter...');

        let fileName = file.originalname;

        console.log('Original Name...');
        console.log(file.originalname);
        debugger

        let extFile = fileName.substring(fileName.lastIndexOf('.') + 1);
        const allowedExts = ['jpg', 'jpeg', 'png'];

        ctApp.validateFieldsFormPet(req, function(){
            
            console.log('Retornando ao fileFilter...');

            console.log(`Analisando o tipo do arquivo: ${fileName}...`);

            if(!allowedExts.includes(extFile)){

                console.log(`Arquivo: ${fileName} possui uma extensão não aceita!`);
            
                req.session.reply.danger.push({msg: `Você tentou inserir um arquivo diferente de uma imagem/foto, ou o formato do seu arquivo de imagem não pode ser aceito! \nOs formatos aceitos são: .jpg | .jpeg | .png`, type: 'danger'});
            
            }

            if(req.session.reply.danger.length > 0){

                console.log(req.session.reply.danger);
                return cb(true, false);
    
            } else {
    
                cb(null, true);
    
            }

        })

    },
    // 1C
    limits: {

        fileSize: 7000000

    }

}).fields([{name: 'foto1', maxCount: 1}])

module.exports = upload;