const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index')
const should = chai.should();
chai.use(chaiHttp);

// var nodeID = '1bfd50dc-b312-11ec-a7b9-0242ac120002';  // local nodeID
var nodeID = '4d065c17-a424-11ec-ab9b-023e4cce1fdd'; // prod NodeID
// var nodeID; 
const url = 'https://signalsense.link'; 
// const localUrl = http://localhost:3000

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


describe('Test GEt /api/intersection', () => {
  it('it should GET Intersection', (done) => {
    chai.request(url)  
        .get('/api/intersection')
        .end((err, res) => {
              res.should.have.status(200);
              console.log(res.body);
              res.body.should.be.a('array');
              res.body[0].should.have.property('latitude');
              res.body[0].should.have.property('longitude');
              res.body[0].should.have.property('intersectionID');
          done();
        });
  });
});


describe(`Test GEt /api/node/getImage?nodeId=${nodeID}`, () => {
  it('it should GET Intersection Image', (done) => {
    chai.request(url)  
        .get(`/api/getImage/light?nodeId=${nodeID}`)
        .end((err, res) => {
              res.should.have.status(200);
              if (err) return done(err);
        });
  });
});

describe(`Test PATCH /api/node/setLights?node_id=${nodeID}`, () => {
    it('it should PATCH  light', (done) => {
        let light = [
                {
                    lightID: '152',
                    lightPhase: 6,
                    state: 'RED'
                }
            ]
      chai.request(url)
          .patch(`/api/node/setLights?node_id=${nodeID}`)
          .send(light)
          .end((err, res) => {
                res.should.have.status(200);
                if (err) return done(err);
                console.log(res.body);
                res.body.should.be.a('array');
                res.body.should.have.property('lightID').eql('152');
                res.body.should.have.property('lightID');
                res.body.should.have.property('lightPhase');
                res.body.should.have.property('state');
            done();
          });
    });
});

