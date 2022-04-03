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

describe('Test GEt /api/node', () => {
    it('it should GET node', (done) => {
      chai.request('http://localhost:3000')  
    //   chai.request(server)
          .get('/api/node')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                // res.body.length.should.be.eql(0);
                res.body.should.have.property('nodeID');
                res.body.should.have.property('nodeDescription');
                res.body.should.have.property('intersectionID');
                res.body.should.have.property('ipAddress');
                res.body.should.have.property('isAlive');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
});

describe('Test GEt /api/node/light', () => {
    it('it should GET all light', (done) => {
      chai.request('http://localhost:3000')  
    //   chai.request(server)
          .get('/api/node/light')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                // res.body.length.should.be.eql(0);
                res.body.should.have.property('lightID');
                res.body.should.have.property('nodeID');
                res.body.should.have.property('lightPhase');
                res.body.should.have.property('lightRowID');
                res.body.should.have.property('state');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
});

describe('Test POST /api/node/light', () => {
    it('it should not POST a light without state field', (done) => {
        let light = {
            lightID: '1',
            lightPhase: 6
        }
    //   chai.request(server)
      chai.request('http://localhost:3000')
          .post('/api/node/light')
          .send(light)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('state');
                res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
    it('it should POST a light', (done) => {
        let light = {
            lightID: '1',
            lightPhase: 6,
            state: 'RED'
        }
    //   chai.request(server)
      chai.request('http://localhost:3000')
          .post('/api/node/light')
          .send(light)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.should.have.property('lightID');
                res.body.should.have.property('lightPhase');
                res.body.should.have.property('state');
            done();
          });
    });
});
