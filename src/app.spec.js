/* tslint:disable:only-arrow-functions no-invalid-this */
const App = require('./app');
const request = require('supertest');
const expect = require('chai').expect;

let TestApplication;

describe('App', () => {

  before('Init app', () => {
    TestApplication = new App();
  });

	after('Init app', (done) => {
		TestApplication.stop().then(done);
	});

  it('starts successfully', function (done) {
    TestApplication.run().then(done).catch(done);
  });

  it('responds to requests', function (done) {
    request(TestApplication.app)
      .get('/')
      .expect(200)
      .end(done);
  });

	describe('users controller', () => {
		describe('list api', () => {
			it('responds to requests', function (done) {
		    request(TestApplication.app)
		      .get('/users')
		      .expect(200)
					.then(response => {
						const users = response.body;

						expect(Array.isArray(users)).to.be.eq(true);
						expect(users[0].name).to.be.eq('James Lin');
						expect(users[0].role).to.be.eq('Developer');
						done();
					})
					.catch(done);
		  });

			it('reponds with paginated result', done => {
				request(TestApplication.app)
					.get('/users?limit=2')
					.expect(200)
					.then(({ body }) => {
						expect(Array.isArray(body)).to.be.eq(true);
						expect(body.length).to.be.eq(2);
						done();
					})
					.catch(done);
			});
		});
		describe('create api', () => {
			it('responds to requests', done => {
		    request(TestApplication.app)
		      .post('/users')
					.send({name: 'Anton', role: 'manager'})
		      .expect(201)
					.end(done);
		  });
			it('responds with 422 status when invalid parameter', done => {
				request(TestApplication.app)
		      .post('/users')
					.send({role: 'manager'})
		      .expect(422)
					.end(done);
			});
		});
	})
});
