const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index')
const should = chai.should();
chai.use(chaiHttp);

var nodeID = '1bfd50dc-b312-11ec-a7b9-0242ac120002';  // local nodeID
// var nodeID = '4d065c17-a424-11ec-ab9b-023e4cce1fdd'; // prod NodeID
// var nodeID; 
// const url = 'https://signalsense.link'; 
const url = 'http://localhost:3000'

describe('Test GEt /api/node/list', () => {
    it('it should GET Node List', (done) => {
      chai.request(url)  
          .get('/api/node/list')
          .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body);
                res.body.should.be.a('array');
                res.body[0].should.have.property('nodeID');
                // nodeID = res.body[0].nodeID;
                res.body[0].should.have.property('nodeDescription');
                res.body[0].should.have.property('intersectionID');
                res.body[0].should.have.property('ipAddress');
                res.body[0].should.have.property('isAlive');
            done();
          });
    });
});


describe(`Test GEt /api/node/light?nodeId=${nodeID}`, () => {
    it('it should GET all light', (done) => {
      chai.request(url)  
          .get(`/api/node/light?nodeId=${nodeID}`)
          .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body);
                if (err) return done(err);
                res.body.should.be.a('array');
                res.body[0].should.have.property('lightID');
                res.body[0].should.have.property('nodeID');
                res.body[0].should.have.property('lightPhase');
                res.body[0].should.have.property('lightRowID');
                res.body[0].should.have.property('state');
                // res.body.errors.pages.should.have.property('kind').eql('required');
                done();
          });
    });
});


// describe('Test GEt /api/intersection', () => {
//   it('it should GET Intersection', (done) => {
//     chai.request(url)  
//         .get('/api/intersection')
//         .end((err, res) => {
//               res.should.have.status(200);
//               console.log(res.body);
//               res.body.should.be.a('array');
//               res.body[0].should.have.property('latitude');
//               res.body[0].should.have.property('longitude');
//               res.body[0].should.have.property('intersectionID');
//           done();
//         });
//   });
// });


// describe(`Test GEt /api/node/getImage?nodeId=${nodeID}`, () => {
//   it('it should GET Intersection Image', (done) => {
//     chai.request(url)  
//         .get(`/api/node/getImage?nodeId=${nodeID}`)
//         .end((err, res) => {
//               res.should.have.status(200);
//               if (err) return done(err);
//         });
//   });
// });

describe(`Test POST ${url}/api/node/admin`, () => {
  it('it should POST a node', (done) => {
      let nodes =         {
        "location": "State University Ave",
        "intersectionID": "97c81ccc-b4a2-11ec-9049-0242ac120002",
        "ipaddress": "000.000.0.0",
        "isalive": true
      };
    chai.request(url)
        .post(`/api/node/admin`)
        .send(nodes)
        .end((err, res) => {
              res.should.have.status(201);
              // console.log(res.body);
              res.body.should.be.a('array');
              res.body[0].should.have.property('nodeID');
              nodeID = res.body[0].nodeID;
              res.body[0].should.have.property('nodeDescription');
              res.body[0].should.have.property('intersectionID');
              res.body[0].should.have.property('ipAddress');
              res.body[0].should.have.property('isAlive');
          done();
        });
  
      })
      it(`it should REMOVE Node: ${nodeID}`, (done) => {
        chai.request(url)  
            .delete(`/api/node/admin?nodeId=${nodeID}`)
            .end((err, res) => {
                  res.should.have.status(200);
                  console.log(res.body);
                  if (err) return done(err);
            });
      });
});


describe(`Test PATCH /api/node/setLights?node_id=${nodeID}`, () => {
    it('it should PATCH a list of lights', (done) => {
        let lights = [
                {
                  "lightID" : "41",
                  "nodeID" : "4d065c17-a424-11ec-ab9b-023e4cce1fdd",
                  "lightPhase" : 21,
                  "lightRowID" : 7,
                  "state" : "GREEN"
                },
                {
                  "lightID": '42',
                  "nodeID": '4d065c17-a424-11ec-ab9b-023e4cce1fdd',
                  "lightPhase": 22,
                  "lightRowID": 8,
                  "state" : 'YELLOW'
                },
               {
                  "lightID": '43',
                  "nodeID": '4d065c17-a424-11ec-ab9b-023e4cce1fdd',
                  "lightPhase": 23,
                  "lightRowID": 9,
                  "state": 'YELLOW'
                }
            ]
      chai.request(url)
          .patch(`/api/node/setLights?node_id=${nodeID}`)
          .send(lights)
          .end((err, res) => {
                res.should.have.status(200);
                if (err) return done(err);
                // console.log(res.body);
                res.body.should.be.a('array');
                res.body[0].should.have.property('lightID');
                // nodeID = res.body[0].nodeID;
                res.body[0].should.have.property('nodeID');
                res.body[1].should.have.property('lightPhase');
                res.body[2].should.have.property('lightRowID');
                res.body[2].should.have.property('state');
            done();
          });
    });
});

