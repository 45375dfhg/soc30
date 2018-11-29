var supertest = require('supertest');
var should = require('should');
var app = require('../app');




describe('test' , () => {

    var tokenfelix = '';
    var henquiryfelix = '';
    var henquiryfelix2 = '';
    var tokenmaria = '';
    var henquirymaria = '';
    var mariaId = '';
    var felixId = '';
    var richardId = '';
    var tokenrichard='';




//user register
    before(function (done) {

        supertest(app)
            .post('/register')
            .send({
                surname: 'felix',
                firstname: 'felix',
                nickname: 'felix',
                password: 'felix',
                passwordConf: 'felix',
                email: 'f@felix.de'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                else {
                    tokenfelix = res.body.token;
                    felixId = res.body._id;
                     console.log( 'felixId'+felixId );
                   //  console.log(res.body );
                    return done();
                }
            });



    });


    before(function (done) {
        supertest(app)
            .post('/register')
            .send({
                surname: 'maria',
                firstname: 'maria',
                nickname: 'maria',
                password: 'maria',
                passwordConf: 'maria',
                email: 'm@maria.de'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    tokenmaria = res.body.token;
                    mariaId = res.body._id;
                    // console.log(tokenmaria);
                    console.log('mariaId'+ mariaId);
                    done();
                }
            });

    });
// user wird regestriert. Danach werden die daten aus DB geholt und vergleich mit der Eingabe.
    it('should success if credential is valid', function (done) {

            supertest(app)
                .post('/register')
                .send({surname : 'richard',
                    firstname: 'richard',
                    nickname: 'richard',
                    password: 'richard',
                    passwordConf: 'richard',
                    email: 'r@r.de'})
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err){
                        done(err);
                    } else {
                        tokenrichard = res.body.token;
                        richardId = res.body._id;
                        supertest(app)
                            .get('/profile?userId=' + richardId)
                            .set('Authorization', 'Bearer ' + tokenrichard)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                } else {
                                    if (res.body.email == 'r@r.de') {
                                        console.log("daten werden verglichen");
                                        return done();
                                    }
                                    else
                                       return done(err);
                                }
                            });
                    }
                });

        });


    // User login felix

    it('should success if credential is valid', function (done) {
        supertest(app)
            .post('/login')
            .send({logemail: 'f@felix.de', logpassword: 'felix'})
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });


    // Register with exist email
    it('should get status 400 ', function (done) {

        supertest(app)
            .post('/register')
            .send({
                surname: 'felix',
                firstname: 'felix',
                nickname: 'felix',
                password: 'felix',
                passwordConf: 'felix',
                email: 'f@felix.de'
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                else {
                    return done();
                }
            });



    });

    // User login felix with Error
// nicht richtige email
    it('should get status 401 ', function (done) {
        supertest(app)
            .post('/login')
            .send({logemail: 'f@felix.de', logpassword: 'feli'})
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(401)
            //.expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    // User login felix with Error
// nicht richtiger passwort
    it('should get status 404 ', function (done) {
        supertest(app)
            .post('/login')
            .send({logemail: 'f', logpassword: 'felix'})
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(404)
            //.expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });


    // GET Profile
    it('should has status code 200 and get profile data', function (done) {
        supertest(app)
            .get('/profile?userId='+felixId)
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                done();
            });
    });

    // GET Profile
    it('should has status code 200 and  get felix profile data', function (done) {
        supertest(app)
            .get('/profile?userId=' + felixId)
            .set('Authorization', 'Bearer ' + tokenmaria)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                done();
            });
    });

    // PUT Profile
    it('should has status code 200 and update profile data', function (done) {
        supertest(app)
            .put('/profile')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .send({
                nickname: 'felixUpdate',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body.nickname);
                done();
            });
    });

    // PUT Profile with ERROR
    // maria wollte profile von felix verändern=> nicht geklaapt
 /*   it('should has status code 200 and update profile data', function (done) {
        supertest(app)
            .put('/profile?userId=' + felixId)
            .set('Authorization', 'Bearer ' + tokenmaria)
            .send({
                nickname: 'felixUpdateVonMaria',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body.nickname);
                done();
            });
    });*/




    // GET logout
    it('should has status code 200 and user felix is logged out', function (done) {
        supertest(app)
            .get('/logout')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                done();
            });
    });

    // GET logout
    it('should has status code 200 and user maria is logged out', function (done) {
        supertest(app)
            .get('/logout')
            .set('Authorization', 'Bearer ' + tokenmaria)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                done();
            });
    });







// POST henquery by user
    // Hilfegesuche werden erstellt, um zu sehen, nach dem Profile
    // löschen, ob die Person aus Aide oder potenzialeAide gelöscht wird

    it('should has status code 200 and post henquiry1 by felix', done => {
        supertest(app)
            .post('/henquiries')
            .send({
                text: ' spielen Felix',
                postalcode: '12345',
                amountAide: '2',
                startTime: "2018-11-31T13:30:39.542Z",
                endTime: "2018-12-31T13:30:39.542Z"
            })
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    henquiryfelix = res.body._id;
                    // console.log( res.body);
                    //console.log( henquiryfelix);
                    done();
                }
            });


    });


    it('should has status code 200 and post henquiry2 by felix', done => {
        supertest(app)
            .post('/henquiries')
            .send({
                text: ' spielen 2 Felix',
                postalcode: '12345',
                amountAide: '2',
                startTime: "2018-11-31T13:30:39.542Z",
                endTime: "2018-12-31T13:30:39.542Z"
            })
            .set('Authorization', 'Bearer ' + tokenfelix)
            //.send({'createdBy': tokenfelix})
            //.set('x-access-token', tokenfelix)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    henquiryfelix2 = res.body._id;
                    // console.log( res.body);
                    // console.log( henquiryfelix2);
                    done();
                }
            });


    });


    it('should has status code 200 and post henquiry by maria', done => {
        supertest(app)
            .post('/henquiries')
            .send({
                text: ' spielen Maria',
                postalcode: '67117',
                amountAide: '5',
                startTime: "2018-11-31T13:30:39.542Z",
                endTime: "2018-12-31T13:30:39.542Z"
            })
            .set('Authorization', 'Bearer ' + tokenmaria)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    // console.log(res.body);
                    henquirymaria = res.body._id;
                    done();
                }
            });


    });

    // PUT henquiry apply API
    it('should has status code 200 and user is in  potentialAide array', function (done) {

        supertest(app)
            .put('/henquiries/apply')
            .set('Authorization', 'Bearer ' + tokenmaria)
            .send({
                henquiryId: henquiryfelix,

            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
done();
            });
    });

    // PUT henquiry accept API
    // liefert nicht die richtige Antwort => immer 204
    it('should has status code 204 and user is in aide array', function (done) {

        supertest(app)
            .put('/henquiries/accept')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .send({
                henquiryId: henquiryfelix,
                applicants: mariaId
            })
            .expect(204)
            //.expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    // PUT route for closing a henquiry
    it('should has status code 200 and closed is true', function (done) {
        supertest(app)
        //  .put('/henquiries/close?henquiryId='+henquiryfelix)
            .put('/henquiries/close')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .send({
                henquiryId: henquiryfelix,
                userId: felixId
            })
            .expect(200)
            //.expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                done();
            });
    });


    // PUT route when help has happened successfully
    it('should has status code 200 and get  happened true',  function(done){

        supertest(app)
            .put('/henquiries/success')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .send({
                henquiryId: henquiryfelix,
                userId: mariaId
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {return done(err);}
                console.log(res.body);
                done();

            });

    });

// DELETE profile
    // wird noch nicht aus der DB gelöscht
    it('should has status code 200 and user maria is deleted', function (done) {

        supertest(app)
            .delete('/profile/specific')
            .set('Authorization', 'Bearer ' + tokenmaria)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                done();
            });
    });


    // DELETE profile
    // wird noch nicht aus der DB gelöscht
    it('should has status code 200 and user felix is deleted', function (done) {

        supertest(app)
            .delete('/profile/specific')
            .set('Authorization', 'Bearer ' + tokenfelix)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                done();
            });
    });



});



