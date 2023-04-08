const mongoose = require('mongoose');
const request = require('supertest'); 

const app = require('../../app'); 
const { User } = require('../../models/user');
const { DB_TEST_HOST, PORT = 3000 } = process.env; 

describe('test auth routes', () => {
  let server;
  beforeAll(() => (server = app.listen(PORT))); 
  afterAll(() => server.close());

  beforeEach(done => {
 jest.setTimeout(6000);
    mongoose.connect(DB_TEST_HOST).then(() => done()); 
  });

  afterEach(done => {
    mongoose.connection.db.dropCollection(() => {
      mongoose.connection.close(() => done()); 
    });
  });

  
  test('test login route', async () => {
    const newUser = {
      email: 'mytest1@gmail.com',
      password: '1234567',
    };
    const user = await User.create(newUser); 

    const loginUser = {
      email: 'mytest1@gmail.com',
      password: '1234567',
    };
    
    const response = await request(app).post('/api/auth/login').send(loginUser);
    
    expect(response.statusCode).toBe(200);

    
    const { body } = response;
    expect(body.token).toByTruthy(); 

    const { token } = await User.findById(user._id);
    expect(body.token).toBe(token); 

    
  });
});