module.exports = {

    emailChars: 'ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz0123456789-_@.',
    letterChars: 'ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz',
    numberChars: '1234567890',
    specialChars: '!?@#$%*.-_',
    allAcceptChars: 'ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz1234567890!?@#$%*.-_',

    validateUserName: function(username, cb){

        const RegEx = /[^A-z\d\-._]/;

        if (username.length === 0){
            cb({msg: 'O campo [Usuário de Acesso] não foi preenchido!', type: 'danger'});
        } else if (username.length < 3 || username.length > 20){
            cb({msg: 'O campo [Usuário de Acesso] deve possuir entre 3 e 20 caracteres', type: 'danger'});
        } else if (RegEx.test(username) || /`/.test(username)){
            cb({msg: 'O campo [Usuário de Acesso] possui espaços ou caracteres inválidos! Caracteres aceitos: letras, números e os caracteres especiais: ( - ), ( . ), ( _ )', type: 'danger'});
        } else {
            cb({msg: '', type: 'success'});
        }

    },

    validateNameAndSurname: function(nameAndSurname, cb){

        const RegEx = /[^A-zÀ-ü ]/;

        if (nameAndSurname.length === 0) {

            return cb({msg: 'O campo [Nome] não foi preenchido!', type: 'danger'});

        } else if (RegEx.test(nameAndSurname) || /`/.test(nameAndSurname)) {

            return cb({msg: 'O campo [Nome] possui caracteres inválidos, digite apenas letras!', type: 'danger'});

        } else if (nameAndSurname.length > 30) {

            return cb({msg: 'Campo [Nome] ultrapassou o limite de caracteres! Máximo 40 caracteres.', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateFullName: function(fieldName, fullName, cb) {

        const RegEx = /[^A-zÀ-ü- ]/;

        if (fullName.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if (fullName.length < 3) {

            return cb({msg: `Campo [${fieldName}] deve conter no mínimo 3 caracteres!`, type: 'danger'});

        }else if (fullName.length > 50) {

            return cb({msg: `Campo [${fieldName}] ultrapassou o limite de caracteres! Máximo 50 caracteres.`, type: 'danger'});

        } else if (RegEx.test(fullName) || /`/.test(fullName) || /\\/.test(fullName) || /_/.test(fullName)) {

            return cb({msg: `O campo [${fieldName}] possui caracteres inválidos, digite apenas letras!`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateCompanyName: function(companyName, cb) {

        const RegEx = /[^A-zÁ-ü ]/;

        if (companyName.length === 0) {

            return cb({msg: 'O campo [Razão Social] não foi preenchido!', type: 'danger'});

        } else if (companyName.length > 50) {

            return cb({msg: 'Campo [Razão Social] ultrapassou o limite de caracteres! Máximo 50 caracteres.', type: 'danger'});

        } else if (RegEx.test(companyName) || /`/.test(companyName)) {

            return cb({msg: 'O campo [Razão Social] possui caracteres inválidos, digite apenas letras!', type: 'danger'});

        }  else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateTelephone: function(fieldName, telephone, cb) {

        const RegEx = /[^\d\s()-]/;
        const tempTelephone = telephone.replace(/[^0-9]/g, '');

        if (telephone.length < 8) {

            return cb({msg: `O campo [${fieldName}] possui menos que 8 caracteres!`, type: 'danger'});

        } else if (telephone.length > 16) {

            return cb({msg: `O campo [${fieldName}] possui mais que 16 caracteres!`, type: 'danger'});

        } else if (tempTelephone.length < 10) {

            return cb({msg: `O campo [${fieldName}] precisa conter no mínimo 10 dígitos com DDD!`, type: 'danger'});

        } else if (tempTelephone.length > 11) {

            return cb({msg: `O campo [${fieldName}] deve conter no máximo 11 dígitos com DDD!`, type: 'danger'});

        } else if (RegEx.test(telephone)) {

            return cb({msg: `O campo [${fieldName}] possui caracteres inválidos!`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    compareEmail: function(email, emailConfirm, cb){

        if(email.length === 0 || emailConfirm.length === 0){
            cb({msg: 'Os campos de e-mail precisam estar preenchidos!', type: 'danger'});
        } else if(email !== emailConfirm){
            cb({msg: 'E-mails divergentes! Favor verifique os e-mails digitados.', type: 'danger'});
        } else {
            cb({msg: '', type: 'success'});
        }

    },

    validateEmail: function(fieldName, email, cb){
        
        let isEqual = false;
        let error = '';
        let qtdArr = 0;
        let qtdPointsAfterArr = 0;
        let isInvalidMail = false;

        for (let i = 0; i < email.length; i++) {

            if(email[i] === '@'){
                qtdArr++;
            }

            for(let j = 0; j < this.emailChars.length; j++){

                if(email[i] === this.emailChars[j]){
                    isEqual = true;
                    break;
                } else {
                    isEqual = false;
                } 

            }
            
            if(isEqual === false){

                error = email[i];
                break;
                
            } else {
                continue;
            }
            
        }

        if(qtdArr === 1){

            const userMail = email;
            const posArr = userMail.indexOf('@');
            const stringAfterArr = userMail.substring(posArr+1, userMail.length);
            const posFirstPointAfterArr = stringAfterArr.indexOf('.');
            
            for(let val of stringAfterArr){
                if(val === '.'){
                    qtdPointsAfterArr++;
                }
            }

            if(stringAfterArr[0] === '.' || stringAfterArr[posFirstPointAfterArr+1] === '.' || userMail[userMail.length-1] === '.'){
                isInvalidMail = true;
            }
            
        }
        
        if (email.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if (email.length < 7) {

            return cb({msg: `O campo [${fieldName}] precisa ter no mínimo 7 caracteres!`, type: 'danger'});

        } else if (email.length > 50) {

            return cb({msg: `O campo [${fieldName}] ultrapssou o limite de caracteres! Máximo 50 caracteres.`, type: 'danger'});

        } else if (!isEqual) {
            
            return cb({msg: `O campo [${fieldName}] contém espaços ou caracteres inválidos!`, type: 'danger'});

        } else if (qtdArr === 0 || qtdArr > 1 || qtdPointsAfterArr === 0 || qtdPointsAfterArr > 2 || isInvalidMail) {

            return cb({msg: `Campo [${fieldName}]: E-mail inválido!`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    comparePassword: function(password, passwordConfirm, cb){

        if(password.length === 0 || passwordConfirm.length === 0){
            cb({msg: 'Os campos de senha precisam estar preenchidos!', type: 'danger'});
        } else if(password !== passwordConfirm){
            cb({msg: 'Senhas divergentes! Favor verifique as senhas digitadas!', type: 'danger'});
        } else {
            cb({msg: '', type: 'success'});
        }

    },

    validatePassword: function(password, cb){

        const erros = [];

        if(password.length === 0){
            erros.push({msg: 'Digite sua senha!', type: 'danger'});
            return cb({erros: erros, type: 'danger'});
        }

        let haveNumber = false;
        let haveLetter = false;
        let haveSpecialChar = false;
        let haveInvalidChar = false;

        for(let i = 0; i < password.length; i++){

            if(!haveNumber){

                for(let j = 0; j < this.numberChars.length; j++){

                    if(password[i] === this.numberChars[j]){
                        haveNumber = true;
                        break;
                    }

                }

            }

            if(!haveLetter){

                for(let k = 0; k < this.letterChars.length; k++){

                    if(password[i] === this.letterChars[k]){
                        haveLetter = true;
                        break;
                    }

                }

            }

            if(!haveSpecialChar){

                for(let l = 0; l < this.specialChars.length; l++){

                    if(password[i] === this.specialChars[l]){
                        haveSpecialChar = true;
                        break;
                    }

                }

            }

            if(!haveInvalidChar){

                let isEqual = false;

                for(let m = 0; m < this.allAcceptChars.length; m++){

                    if(password[i] === this.allAcceptChars[m]){
                        isEqual = true;
                        break;
                    }

                }

                if(!isEqual){
                    haveInvalidChar = true;
                }

            }

        }

        if(password.length < 8 || password.length > 12) {
            erros.push({msg: 'A senha deve conter entre 8 e 12 caracteres!', type: 'danger'});
        }
        
        if(!haveNumber){
            erros.push({msg: 'A senha precisa conter ao menos um número!', type: 'danger'});
        }
        
        if(!haveLetter){
            erros.push({msg: 'A senha precisa conter ao menos uma letra!', type: 'danger'});
        }
        
        if(!haveSpecialChar){
            erros.push({msg: 'A senha precisa conter ao menos um dos caracteres especiais: ( ! ), ( ? ), ( @ ), ( # ), ( $ ), ( % ), ( * ), ( _ ), ( - ), ( . )', type: 'danger'});
        }
        
        if(haveInvalidChar){
            erros.push({msg: 'A senha digitada contém espaços ou caracteres especiais inválidos. Os caracteres especiais válidos são: ( ! ), ( ? ), ( @ ), ( # ), ( $ ), ( % ), ( * ), ( _ ), ( - ), ( . )', type: 'danger'});
        } 
        
        if(erros.length > 0){
            return cb({erros: erros, type: 'danger'});
        } else {
            return cb({erros: erros, type: 'success'});
        }
        
    },

    validatePrivileges: function(formData, cb){

        let noHavePriv = true;

        for(let key in formData){
            if(/priv/.test(key)){
                noHavePriv = false;
            }
        }

        if(noHavePriv){
        
            cb({msg: 'O usuário precisa ter ao menos um privilégio!', type: 'danger'});

        } else {

            cb({msg: '', type: 'success'});

        }

    },

    validateToken: function(token, cb){

        const RegEx = /[^A-z\d]/;

        if(token.length === 0){
            return cb({msg: 'Erro: Token não recebido pelo Servidor!', type: 'danger'});
        } else if(token.length < 40){
            return cb({msg: 'Erro: O Token contém menos que 40 caracteres!', type: 'danger'});
        }else if(RegEx.test(token)){
            return cb({msg: 'Erro: Token inválido!', type: 'danger'});
        } else {
            return cb({msg: '', type: 'success'});
        }

    },

    validateCPF: function(cpf, cb){

        const invalidCPF = {msg: 'CPF Inválido', type: 'danger'};
        const validCPF = {msg: 'CPF validado com sucesso!', type: 'success'};

        const regEx = /[^\d\-.]/;
        const CPFStringNumbers = cpf.replace(/[^\d]+/g,'');

        if (cpf.length === 0) {

            return cb({msg: 'O campo [CPF] não foi preenchido', type: 'danger'});

        } else if (cpf.length > 14 || CPFStringNumbers.length !== 11) {

            return cb(invalidCPF);

        } else  if (regEx.test(cpf)) {
            
            return cb({msg: 'O campo [CPF] possui caracteres inválidos!', type: 'danger'});

        } else if (CPFStringNumbers == "00000000000" || CPFStringNumbers == "11111111111" || 
            CPFStringNumbers == "22222222222" || CPFStringNumbers == "33333333333" || 
            CPFStringNumbers == "44444444444" || CPFStringNumbers == "55555555555" || 
            CPFStringNumbers == "66666666666" || CPFStringNumbers == "77777777777" || 
            CPFStringNumbers == "88888888888" || CPFStringNumbers == "99999999999") {

            return cb(invalidCPF);

        } else {

            calcValidationCPF(CPFStringNumbers);

        }

        function calcValidationCPF(CPFStringNumbers){
            
            (function validateFirstVerificatorDigit(){

                const first9digits = [];
                const multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
                const resMultiplication = [];
                let sumResMultiplication = 0;
                let restDivision = 0;

                for(let i = 0; i <= 8; i++){
                    first9digits.push(Number(CPFStringNumbers[i]));
                }

                for(let i = 0; i < multipliers.length; i++){
                    resMultiplication.push(first9digits[i] * multipliers[i]);
                }

                for(val of resMultiplication){
                    sumResMultiplication += val;
                }

                restDivision = (sumResMultiplication * 10) % 11;

                restDivision = restDivision === 10 || restDivision === 11 ? 0 : restDivision;

                if(restDivision === Number(CPFStringNumbers[CPFStringNumbers.length - 2])){

                    console.log(restDivision + ' - ' + Number(CPFStringNumbers[CPFStringNumbers.length - 2]))

                    validateSecondVerificatorDigit(CPFStringNumbers);

                } else {

                    console.log('1º digito inválido!');
                    return cb(invalidCPF);
                    
                }

            })();

            function validateSecondVerificatorDigit(CPFStringNumbers){

                console.log('Validando o 2º digito verificador do CPF...')

                const first10digits = [];
                const multipliers = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                const resMultiplication = [];
                let sumResMultiplication = 0;
                let restDivision = 0;

                for(let i = 0; i <= 9; i++){
                    first10digits.push(Number(CPFStringNumbers[i]));
                }

                for(let i = 0; i < multipliers.length; i++){
                    resMultiplication.push(first10digits[i] * multipliers[i]);
                }

                for(val of resMultiplication){
                    sumResMultiplication += val;
                }

                restDivision = (sumResMultiplication * 10) % 11;

                restDivision = restDivision === 10 || restDivision === 11 ? 0 : restDivision;

                if(restDivision === Number(CPFStringNumbers[CPFStringNumbers.length - 1])){

                    console.log(restDivision + ' - ' + Number(CPFStringNumbers[CPFStringNumbers.length - 1]))

                    return cb(validCPF);

                } else {

                    return cb(invalidCPF);
                    
                }

            }
            
        }

    },

    validateCNPJ: function(cnpj, cb) {

        const invalidCNPJ = {msg: 'CNPJ Inválido', type: 'danger'};
        const validCNPJ = {msg: 'CNPJ validado com sucesso!', type: 'success'};

        const regEx = /[^\d\-.\/]/;
        const cnpjStringNumbers = cnpj.replace(/[^\d]+/g,'');
        
        if (cnpj.length === 0) {

            return cb({msg: 'O campo [CNPJ] não foi preenchido', type: 'danger'});

        } else if (cnpj.length > 18 || cnpjStringNumbers.length !== 14) {

            return cb(invalidCNPJ);

        } else if (regEx.test(cnpj)) {

            return cb({msg: 'O campo [CNPJ] possui caracteres inválidos!', type: 'danger'});

        } else if (cnpjStringNumbers == "00000000000000" || cnpjStringNumbers == "11111111111111" || 
            cnpjStringNumbers == "22222222222222" || cnpjStringNumbers == "33333333333333" || 
            cnpjStringNumbers == "44444444444444" || cnpjStringNumbers == "55555555555555" || 
            cnpjStringNumbers == "66666666666666" || cnpjStringNumbers == "77777777777777" || 
            cnpjStringNumbers == "88888888888888" || cnpjStringNumbers == "99999999999999") {

            return cb(invalidCNPJ);

        } else {

            calcValidationCNPJ(cnpjStringNumbers);

        }

        function calcValidationCNPJ(cnpjStringNumbers) {
            
            (function validateFirstVerificatorDigit() {

                const first12Digits = cnpjStringNumbers.substring(0, 12);
                const invertedFirst12Digits = first12Digits.split('').reverse();
                const multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
                const resMultiplication = [];
                let sumResMultiplication = 0;
                let restDivision = 0;
                
                for (let i = 0; i < multipliers.length; i++) {
                    resMultiplication.push(invertedFirst12Digits[i] * multipliers[i]);
                }

                for (val of resMultiplication) {
                    sumResMultiplication += val;
                }

                restDivision = sumResMultiplication % 11;

                let validFirstVerificatorDigit = 0;

                if (restDivision === 0 || restDivision === 1) {

                    validFirstVerificatorDigit = 0;

                } else {

                    validFirstVerificatorDigit = 11 - restDivision;

                }

                if (validFirstVerificatorDigit === Number(cnpjStringNumbers[cnpjStringNumbers.length - 2])) {

                    validateSecondVerificatorDigit(cnpjStringNumbers);

                } else {

                    console.log('1º digito verificador do CNPJ inválido!');
                    return cb(invalidCNPJ);
                    
                }

            })()

            function validateSecondVerificatorDigit(cnpjStringNumbers) {
                
                const first13Digits = cnpjStringNumbers.substring(0, 13);
                const invertedFirst13Digits = first13Digits.split('').reverse();
                const multipliers = [2,3,4,5,6,7,8,9,2,3,4,5,6];
                const resMultiplication = [];
                let sumResMultiplication = 0;
                let restDivision = 0;
                
                for (let i = 0; i < multipliers.length; i++) {
                    resMultiplication.push(invertedFirst13Digits[i] * multipliers[i]);
                }

                for (val of resMultiplication) {
                    sumResMultiplication += val;
                }
                
                restDivision = sumResMultiplication % 11;

                let validSecondVerificatorDigit = 0;

                if (restDivision === 0 || restDivision === 1) {

                    validSecondVerificatorDigit = 0;

                } else {

                    validSecondVerificatorDigit = 11 - restDivision;

                }

                if (validSecondVerificatorDigit === Number(cnpjStringNumbers[cnpjStringNumbers.length - 1])) {

                    return cb(validCNPJ);

                } else {

                    console.log('2º digito inválido!');
                    console.log(validSecondVerificatorDigit + ' - ' + Number(cnpjStringNumbers[cnpjStringNumbers.length - 1]));
                    return cb(invalidCNPJ);
                    
                }
                
            }
        
        }
         
    },

    validateIE: function(ie, cb) {

        const regEx = /[^\d\-.\/]/;

        if (ie.length > 0 && ie.length < 6) {

            return cb({msg: 'O campo [Inscrição Estadual] possui menos que 6 caracteres!', type: 'danger'});

        } else if (ie.length > 0 && ie.length > 20) {

            return cb({msg: 'O campo [Inscrição Estadual] ultrapassou o limite de 20 caracteres!', type: 'danger'});

        } else if (regEx.test(ie)) {

            return cb({msg: 'O campo [Inscrição Estadual] possui espaços ou caractéres inválidos!', type: 'danger'});

        }

    },

    validateIM: function(im, cb) {

        const regEx = /[^0-9A-z\.\/\-]/;

        if (im.length > 0 && im.length < 6) {

            return cb({msg: 'O campo [Inscrição Municipal] possui menos que 6 caracteres!', type: 'danger'});

        } else if (im.length > 0 && im.length > 20) {

            return cb({msg: 'O campo [Inscrição Municipal] ultrapassou o limite de 20 caracteres!', type: 'danger'});

        } else if (regEx.test(im) || /`/.test(im)) {

            return cb({msg: 'O campo [Inscrição Municipal] possui espaços ou caractéres inválidos!', type: 'danger'});

        }

    },

    validateAddress: function(address, cb) {

        const regEx = /[^A-zÀ-ü\-\. ]/;

        if (address.length === 0) {

            return cb({msg: 'O campo [Endereço] não foi preenchido!', type: 'danger'});

        } else if (address.length > 50) {

            return cb({msg: 'O campo [Endereço] ultrapassou o limite de caracteres! Máximo 50 caracteres.', type: 'danger'});

        } else if (address.length < 4) {

            return cb({msg: 'O campo [Endereço] precisa ter no mínimo 4 caracteres.', type: 'danger'});

        } else if(/[\d]/.test(address)) {

            return cb({msg: 'O campo [Endereço] não pode conter números! Se necessário, descreva o número por extenso. Ex: R. Vinte e Um de Abril', type: 'danger'});

        } else if (regEx.test(address) || /`/.test(address)) {

            return cb({msg: 'O campo [Endereço] possui caracteres inválidos!', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateAddressNumber: function(addressNumber, cb) {

        if (addressNumber.length === 0) {

            return cb({msg: 'O campo [Número] não foi preenchido!', type: 'danger'});

        } else if (addressNumber.length > 6) {

            return cb({msg: 'O campo [Número] ultrapassou o limite de caracteres! Máximo 6 caracteres', type: 'danger'});

        } else if(/[^\d]/.test(addressNumber)) {

            return cb({msg: 'O campo [Número] deve conter apenas números! Se necessário, utilize o campo [Complemento]', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateAddressComplement: function(complemento, cb) {

        const regEx = /[^0-9A-zÀ-ü\-\. ]/;

        if (complemento.length > 0) {

            if (complemento.length > 30) {

                return cb({msg: 'O campo [Complemento] ultrapassou o limite de caracteres! Máximo 30 caracteres.', type: 'danger'});
    
            } else if (regEx.test(complemento) || /`/.test(complemento)) {

                return cb({msg: 'O campo [Complemento] possui caracteres inválidos!', type: 'danger'});
    
            } else {
    
                return cb({msg: '', type: 'success'});
    
            }

        } 

    },

    validateBairro: function(bairro, cb) {

        const RegEx = /[^0-9A-zÀ-ü\-' ]/;

        if (bairro.length === 0) {

            return cb({msg: 'O campo [Bairro] não foi preenchido!', type: 'danger'});

        } else if (bairro.length < 2) {

            return cb({msg: 'O campo [Bairro] deve conter no mínimo 2 caracteres!', type: 'danger'});

        } else if (bairro.length > 30) {

            return cb({msg: 'O campo [Bairro] ultrapassou o limite de caracteres! Máximo 30 caracteres', type: 'danger'});

        } else if (RegEx.test(bairro) || /[`]/.test(bairro)) {

            return cb({msg: 'O campo [Bairro] contém caracteres inválidos! Digite apenas letras, números e/ou hífen (-). Caso esteja digitando o nome do Bairro com abreviações, remova as abreviações e digite o nome do Bairro completo.', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateCity: function(cidade, cb) {

        const RegEx = /[^A-zÀ-ü\-' ]/;

        if (cidade.length === 0) {

            return cb({msg: 'O campo [Cidade] não foi preenchido!', type: 'danger'});

        } else if (cidade.length < 2) {

            return cb({msg: 'O campo [Cidade] deve conter no mínimo 2 caracteres!', type: 'danger'});

        } else if (cidade.length > 30) {

            return cb({msg: 'O campo [Cidade] ultrapassou o limite de caracteres! Máximo 30 caracteres', type: 'danger'});

        } else if(RegEx.test(cidade) || /[`]/.test(cidade)) {

            return cb({msg: 'O campo [Cidade] contém caracteres inválidos! Digite apenas letras e/ou hífen (-). Caso o nome da Cidade seja formado por um número, digite o número por extenso. Ex: Três Corações', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateUF: function(uf, cb) {

        const RegEx = /[^A-Z\-]/;

        if (uf.length === 0 || uf === '-') {

            return cb({msg: 'O campo [UF] não foi preenchido!', type: 'danger'});

        } else if (uf !== '-' && uf.length !== 2) {

            return cb({msg: 'O campo [UF] deve conter exatamente 2 caracteres!', type: 'danger'});

        } else if (RegEx.test(uf) || /[`]/.test(uf)) {

            return cb({msg: 'O campo [UF] contém caracteres inválidos!', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateCEP: function(cep, cb) {

        const RegEx = /[^0-9\-]/;
        const cepDigits = cep.replace(/[^0-9]/g, '');
        let RegEx2 = cep.match(/-/g);

        if (cep.length === 0) {

            return cb({msg: 'O campo [CEP] não foi preenchido!', type: 'danger'});

        } else if (cep.length < 8) {

            return cb({msg: 'O campo [CEP] deve conter no mínimo 8 caracteres!', type: 'danger'});

        } else if (cep.length > 9) {

            return cb({msg: 'O campo [CEP] deve conter no máximo 9 caracteres!', type: 'danger'});

        } else if (cepDigits.length !== 8) {

            return cb({msg: 'O campo [CEP] deve conter exatamente 8 dígitos!', type: 'danger'});

        } else if (RegEx2 !== null && RegEx2.length > 1) {

            return cb({msg: 'O campo [CEP] possui mais de um hífen ( - )!', type: 'danger'});

        } else if (RegEx.test(cep) || /[`]/.test(cep)) {

            return cb({msg: 'O campo [CEP] contém caracteres inválidos!', type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateSite: function(fieldName, site, cb) {

        const RegEx = /[^0-9A-z\/\._:-]/;

        if (site.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if(site.length < 5 || site.length > 50) {

            return cb({msg: `O campo [${fieldName}] deve possuir entre 5 e 50 caracteres`, type: 'danger'});

        } else if(RegEx.test(site) || /`/.test(site) || /\\/.test(site)){

            return cb({msg: `O campo [${fieldName}] possui espaços ou caracteres inválidos! Caracteres aceitos: letras, números e os caracteres especiais: ( - ), ( . ), ( : ), ( _ ), ( / )`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateFaceOrInstagram: function(fieldName, socialMediaUsername, cb) {

        const RegEx = /[^0-9A-z\._@-]/;

        if (socialMediaUsername.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if(socialMediaUsername.length < 4 || socialMediaUsername.length > 30) {

            return cb({msg: `O campo [${fieldName}] deve possuir entre 4 e 30 caracteres`, type: 'danger'});

        } else if(RegEx.test(socialMediaUsername) || /`/.test(socialMediaUsername) || /\\/.test(socialMediaUsername)) {

            return cb({msg: `O campo [${fieldName}] possui espaços ou caracteres inválidos! Caracteres aceitos: letras sem acentos, números e os caracteres especiais: ( @ ), ( - ), ( . ), ( _ )`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },

    validateWorkFunction: function(fieldName, cargo, cb) {

        const RegEx = /[^0-9A-zÀ-ü \-]/;

        if (cargo.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if (cargo.length < 3) {

            return cb({msg: `Campo [${fieldName}] deve conter no mínimo 3 caracteres!`, type: 'danger'});

        }else if (cargo.length > 30) {

            return cb({msg: `Campo [${fieldName}] ultrapassou o limite de caracteres! Máximo 30 caracteres.`, type: 'danger'});

        } else if (RegEx.test(cargo) || /`/.test(cargo) || /\\/.test(cargo) || /_/.test(cargo)) {

            return cb({msg: `O campo [${fieldName}] possui caracteres inválidos, digite apenas letras, números e/ou hífen ( - )!`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    },
    
    validateTextArea: function(fieldName, text, cb) {

        const RegEx = /[{}\[\]<>]/;

        if (text.length === 0) {

            return cb({msg: `O campo [${fieldName}] não foi preenchido!`, type: 'danger'});

        } else if (text.length > 150) {

            return cb({msg: `Campo [${fieldName}] ultrapassou o limite de caracteres! Máximo 150 caracteres.`, type: 'danger'});

        } else if (RegEx.test(text)) {

            return cb({msg: `O campo [${fieldName}] possui caracteres inválidos! Caracteres não permitidos: ( { ), ( } ), ( [ ), ( ] ), ( < ), ( > )`, type: 'danger'});

        } else {

            return cb({msg: '', type: 'success'});

        }

    }
    
}