const dbConnection = require('../../config/dbConnection');

module.exports = {

    getPetsPretendentes: function(cb){

        console.log('MDPETS - getPetsPretendentes()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const getPetsPretendentes = `SELECT * FROM pets JOIN usuarios ON pets.id_tutor = usuarios.id_user WHERE pets.disp = 'pretendentes'`

        db.query(getPetsPretendentes, function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb(result);

            }
            
        })

    },

    getPetsAdocoes: function(cb){

        console.log('MDPETS - getPetsAdocoes()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const getPetsAdocoes = `SELECT * FROM pets JOIN usuarios ON pets.id_tutor = usuarios.id_user WHERE pets.disp = "adocoes"`

        db.query(getPetsAdocoes, function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb(result);

            }
            
        })

    },

    getMeusPets: function(userId, cb){

        console.log('MDPETS - getMeusPets()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const getMeusPets = `SELECT * FROM pets JOIN usuarios ON pets.id_tutor = usuarios.id_user WHERE pets.id_tutor = ${userId}`

        db.query(getMeusPets, function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                return cb(result);

            }
            
        })

    },

    getPetById: function(idPet, cb){

        console.log('MDPETS - getPetById()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const getPet = `SELECT * FROM pets WHERE id_pet = ${idPet}`

        db.query(getPet, function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb(result);

            }
            
        })

    },

    getLastIdPet: function(cb){

        console.log('MDPETS - getLastIdPet()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const getLastIdPet = `SELECT MAX(id_pet) FROM pets`

        db.query(getLastIdPet, function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb(result[0]['MAX(id_pet)']);

            }
            
        })

    },

    updatePet: function(idPet, formData, cb){

        console.log('MDPETS - updatePet()');

        const dbConnect = dbConnection();
        const db = dbConnect();

        const updatePet = `UPDATE pets SET ? WHERE id_pet = ?`

        db.query(updatePet, [formData, idPet], function(err, result){

            if(err){

                db.end();
                console.log('Erro na consulta SQL!');
                console.log(err);

            } else {

                db.end();
                console.log('Consulta realizada com sucesso!');
                return cb({msg: 'Pet atualizado com sucesso!', type: 'success'});

            }
            
        })
                
    },

    postPet: function(formData, cb){

        console.log('MDPETS - postPet()')

        const dbConnect = dbConnection();
        const db = dbConnect();

        const insertPet = `INSERT INTO pets SET ?`

        db.query(insertPet, formData, function(err, result){

            if(err){

                db.end();
                console.log(err);

            } else {

                db.end();
                return cb({msg: 'Pet cadastrado com sucesso!', type: 'success'});

            }
            
        })
                
    },

    deletePet: function(idPet, cb){

        console.log('MDPETS - deletePet()')

        const dbConnect = dbConnection();
        const db = dbConnect();

        const deletePet = `DELETE FROM pets WHERE id_pet = ${idPet}`

        db.query(deletePet, function(err, result){

            if(err){

                db.end();
                console.log(err);

            } else {

                db.end();
                return cb({msg: 'Pet excluído com sucesso!', type: 'success'});

            }
            
        })
                
    }

}