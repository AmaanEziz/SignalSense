const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index')
const should = chai.should();

chai.use(chaiHttp);
// const functions=require('../feature.js');
// // Requirement 2.1.10 
// // Test for SINGLETON Movie 
// describe('SINGLETON:  Movie tests',function(){
//     it('check that there is only one best picture winner for 2010', async () =>{
//         await functions.getMovieList(null,"best picture","2010","true").then(data=>{
//             // console.log(data);
            // expect(data.length).to.equal(1);
            // expect(data[0]).to.have.property('category', "BEST PICTURE");
            // expect(data[0].year_ceremony).equals(2010);
            // expect(data[0].winner).equals('true');
//         })

//     })

// })

// https://betterprogramming.pub/writing-unit-tests-for-your-nodejs-api-13257bd0e46b
// https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

const NodeController = require('../controllers/nodeController');
const LightController = require('../controllers/lightController');
const FileController = require('../controllers/fileController');

// const nodeController = NodeController(Node);
const lightController = LightController();


// describe('Node Controller Test', function(){
//     it('test case 1', async () => {
//         await nodeController.getAll().then(data => {
//             console.log(data);
//             expect(data.length).to.equal(1);
//             expect(data[0]).to.have.property('nodeID', 1);
//             expect(data[0].light_id).equals(2);
//         })
//     })
// })

// describe('Test GEt /api/node/light', function(){
//     it('it should GET all light', async () => {
//         await lightController.getAll().then(data => {
//             console.log(data);
//         })
//     })
// })
let nodeID = '1bfd50dc-b312-11ec-a7b9-0242ac120002';

describe('Test GEt /api/node/list', () => {
    it('it should GET Nodes List', (done) => {
      chai.request('http://localhost:3000')  
    //   chai.request(server)
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
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
});

console.log(nodeID)
describe(`Test GEt /api/node/light?nodeId=${nodeID}`, () => {
    it('it should GET all light', (done) => {
      chai.request('http://localhost:3000')  
    //   chai.request(server)
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

describe(`Test PATCH /api/node/setLights?node_id=${nodeID}`, () => {
    // it('it should not patchLights a light without state field', (done) => {
    //     let light = {
    //         lightID: '1',
    //         lightPhase: 6
    //     }
    // //   chai.request(server)
    //   chai.request('http://localhost:3000')
    //       .post('/api/node/light')
    //       .send(light)
    //       .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('errors');
    //             res.body.errors.should.have.property('state');
    //         done();
    //       });
    // });
    it('it should PATCH  light', (done) => {
        let light = [
                {
                    lightID: '152',
                    lightPhase: 6,
                    state: 'RED'
                }
            ]
    //   chai.request(server)
      chai.request('http://localhost:3000')
          .patch(`/api/node/setLights?node_id=${nodeID}`)
          .send(light)
          .end((err, res) => {
                // res.should.have.status(200);
                if (err) return done(err);
                console.log(res.body);
                res.body.should.be.a('array');
                // res.body.should.have.property('lightID').eql('152');
                res.body.should.have.property('lightID');
                res.body.should.have.property('lightPhase');
                res.body.should.have.property('state');
            done();
          });
    });
});

// describe('Test GEt /api/node/light', () => {
//     it('it should GET all light', (done) => {
//       chai.request('http://localhost:3000')  
//     //   chai.request(server)
//           .get('/api/node/light')
//           .end((err, res) => {
//                 // res.should.have.status(200);
//                 if (err) return done(err);
//                 res.body.should.be.a('object');
                
//                 // res.body.length.should.be.eql(0);
//                 // res.body.should.have.property('lightID');
//                 // res.body.should.have.property('nodeID');
//                 // res.body.should.have.property('lightPhase');
//                 // res.body.should.have.property('lightRowID');
//                 // res.body.should.have.property('state');
//                 // res.body.errors.pages.should.have.property('kind').eql('required');
//                 done();
//           });
//     });
// });