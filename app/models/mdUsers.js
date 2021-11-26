const { assign } = require('nodemailer/lib/shared');
const dbConnection = require('../../config/dbConnection');

module.exports = {

    getUserById: function(userId, cb){

        console.log('MD - getUserById()');
        
        const dbConnect = dbConnection();
        const db = dbConnect();

        const selectByUserId = `SELECT * FROM usuarios WHERE id_user = '${userId}'`

        db.query(selectByUserId, function(err, result){
            
            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();

                console.log('Consulta realizada com sucesso!');

                if(result.length === 0){

                    return cb({msg: 'Código de usuário não encontrado!', type: 'danger'});

                } else {

                    console.log(result[0]);
                    
                    return cb({userData: assign({}, result[0]), type: 'success'});
                }
                
            }

        })

    },

    getUserByEmail: function(email, cb){

        console.log('getUserByEmail()')

        const dbConnect = dbConnection();
        const db = dbConnect();

        const selectUserByEmail = `SELECT * FROM usuarios WHERE email = '${email}'`

        db.query(selectUserByEmail, function(err, result){
            
            if(err){
                db.end();
                console.log(err);
            } else {
                db.end();
                return cb(result);
            }
            
        })

    },

    getUserByCPF: function(cpf, cb){

        console.log('MDUSERS - getUserByCPF()');
        console.log(cpf);
  
        const dbConnect = dbConnection();
        const db = dbConnect();

        const searchUserByCPF = `SELECT * FROM usuarios WHERE cpf = '${cpf}'`

        db.query(searchUserByCPF, function(err, result){

            console.log('searchUserByCPF()');
            console.log(result)
            
            if(err){
    
                db.end();
                console.log('Erro na consulta SQL!');
                return console.log(err);
    
            } else {
    
                db.end();
                console.log('Consulta SQL realizada com sucesso!');
                return cb(result);
    
            } 

        })

    },

    verifyIfCPFInUse: function(cpf, cb){

        console.log('MDUSERS - verifyIfCPFInUse()');
  
        const dbConnect = dbConnection();
        const db = dbConnect();

        const searchUserByCPF = `SELECT * FROM usuarios WHERE cpf = '${cpf}'`

        db.query(searchUserByCPF, function(err, result){
            
            if(err){
    
                db.end();
                console.log('Erro na consulta SQL!');
                return console.log(err);
    
            } else if(result.length > 0){
    
                db.end();
                console.log('Consulta SQL realizada com sucesso!');
                return cb({msg: 'Já existe um usuário cadastrado com este CPF!', type: 'danger'});
    
            } else {

                db.end();
                console.log('Consulta SQL realizada com sucesso!');
                return cb({msg: 'CPF liberado para cadastro!', type: 'success'});

            }

        })

    },

    postUser: function(formData, senhaCrypto, cb){

        console.log('MDUSERS - POSTUSER')
  
        const dbConnect = dbConnection();
        const db = dbConnect();
    
        const selectUserByEmail = `SELECT * FROM usuarios WHERE email = '${formData.email}'`
        //const searchUserByCPF = `SELECT * FROM usuarios WHERE cpf = '${formData.cpf}'`
        const insertUser = `INSERT INTO usuarios SET ?`
        
        db.query(selectUserByEmail, function(err, result){

            console.log('MDUSERS - QUERY - SELECT USER-EMAIL')
            
            if(err){
    
                db.end();
                return console.log(err);
    
            } else if(result.length > 0){
    
                db.end();
                return cb({msg: 'Já existe um usuário cadastrado com este e-mail!', type: 'danger'});
    
            } 

            db.beginTransaction(function(err){
            
                console.log('MD - postUser() - beginTransaction()');

                if(err){
                    
                    db.end();
                    console.log('Erro na beginTransaction()...');
                    return console.log(err);

                }

                db.query(insertUser, formData, function(err, result){

                    console.log('MD - postUser() - Query insertUser');
        
                    if(err){

                        db.end();
                        console.log('Erro na execução da Query insertUser');
                        return console.log(err);

                    } else {

                        console.log('Query insertUser realizada com sucesso!');

                        const getLastIdUser = `SELECT MAX(id_user) FROM usuarios`

                        db.query(getLastIdUser, function(err, result){

                            if(err){

                                db.rollback(function(err2){

                                    if(err2){

                                        db.end();
                                        console.log('Erro na execução do Rollback da Query getLastIdUser');
                                        return console.log(err2);

                                    } else {

                                        db.end();
                                        console.log('Erro na durante a execução da Query getLastIdUser');
                                        console.log(err);

                                    }

                                })

                            } else {

                                db.commit(function(err){

                                    if(err){

                                        db.rollback(function(err2){

                                            if(err2){

                                                db.end();
                                                console.log('Erro na execução do Rollback do db.commit - getLastIdUser');
                                                return console.log(err2);

                                            } else {

                                                db.end();
                                                console.log('Erro na execução do db.commit - getLastIdUser');
                                                return console.log(err);

                                            }

                                        })

                                    } else {

                                        db.end();
                                        console.log(`Usuário cadastrado com sucesso sob o ID --> ${result[0]['MAX(id_user)']}`);
                                        return cb({msg: 'Usuário cadastrado com sucesso!', type: 'success', idNewUser: result[0]['MAX(id_user)']});

                                    }

                                })

                            }
                            
                        })

                    }
                    
                })
                
            })
    
        })
    
    },

    updateUser: function(idUser, formData, cb){

        console.log('MD-USERS - updateUser()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const updateUser = `UPDATE usuarios SET ? WHERE id_user = ?`

        db.query(updateUser, [formData, idUser], function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb({msg: 'Dados atualizado com sucesso!', type: 'success'});

            }
            
        })
                
    },

    deleteUserAndHisPets: function(userId, cb){

        console.log('MD - deleteUserAndHisPet()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const deleteUserPets = `DELETE FROM pets WHERE id_tutor = ${userId}`
        const deleteUser = `DELETE FROM usuarios WHERE id_user = ${userId}`
        
        db.beginTransaction(function(err){

            console.log('beginTransaction()');

            if(err){
                
                db.end();
                console.log('Erro na beginTransaction()...');
                return console.log(err);

            } 
            
            console.log('Query deleteUserPets');

            db.query(deleteUserPets, function(err){

                if(err){

                    db.rollback(function(err2){

                        if(err2){

                            db.end();
                            console.log('Erro na Query deleteUserPets... Erro no Rollback...');
                            return console.log(err2);

                        } else {

                            db.end();
                            console.log('Erro na Query deleteUserPets... Rollback executado com sucesso!');
                            return console.log(err);

                        }
                        
                    })

                } else {

                    console.log('Query deleteUser...');

                    db.query(deleteUser, function(err, result){

                        if(err){

                            db.rollback(function(err2){

                                if(err2){

                                    console.log('Erro na Query deleteUser... Erro no Rollback...');
                                    return console.log(err2);

                                } else {

                                    db.end();
                                    console.log('Erro na Query deleteUser... Rollback executada com sucesso!');
                                    return console.log(err);

                                }
                                
                            })

                        } else {

                            console.log('Query commit()...');
                            
                            db.commit(function(err){

                                if(err){

                                    db.rollback(function(err2){

                                        if(err2){

                                            console.log('Erro no db.commit()... Erro no Rollback...');
                                            return console.log(err2);

                                        } else {

                                            console.log('Erro no db.commit()... Rollback executado com sucesso!');
                                            return console.log(err2);

                                        }

                                    })

                                } else {

                                    console.log('db.commit() executado com sucesso!');
                                    return cb({msg: 'Usuário excluído com sucesso!', type: 'success'});

                                }

                            })
                            
                        }
    
                    })
                    
                }

            })    

        })
        
    },

    saveTokenPwd: function(email, tokenPwd, cb){

        console.log('MDUSERS - saveToken()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const querySaveToken = `UPDATE usuarios SET ? WHERE email = ?`

        db.query(querySaveToken, [tokenPwd, email], function(err){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Token salvo com sucesso!');
                return cb({msg: 'Token salvo com sucesso!', type: 'success'});

            }

        })

    },

    changePwdByEmail: function(email, newPwdCrypto, cb){

        const dbConnect = dbConnection();
        const db = dbConnect();
    
        const updatePwdQuery = `UPDATE usuarios SET password = '${newPwdCrypto}' WHERE email = '${email}'`
    
        db.query(updatePwdQuery, function(err, result){
    
            if(err){
                db.end();
                console.log(err);
            } else {
                db.end();
                cb({msg: 'Senha alterada com sucesso!', type: 'success'});
            }
    
        })
    
    },

    authenticateUser: function(email, password, cb){
        
        const dbConnect = dbConnection();
        const db = dbConnect();
    
        const searchUserQuery = `SELECT * FROM usuarios WHERE email = '${email}'`
        const selectUserQuery = `SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}'`

        db.query(searchUserQuery, function(err, result){

            console.log(result);
    
            if(err){
    
                db.end();
                console.log(err);
                
            } else if(result.length === 0) {
    
                db.end();
                return cb({msg: 'Usuário de Acesso não encontrado!', type: 'danger'});
    
            } else {
    
                db.query(selectUserQuery, function(err, result){
            
                    if(err){
    
                        db.end();
                        console.log(err);
                        
                    } else if(result.length === 0) {
                        
                        db.end();
                        return cb({msg: 'Senha incorreta!', type: 'danger'});
            
                    } else {
                        
                        db.end();
                        return cb({userData: result[0], msg: 'Usuário autenticado com sucesso!', type: 'success'});
            
                    }
            
                })
    
            }
    
        })
    
    }

}