const db = require('../db/connection')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app')
const request = require('supertest')

// Seeding
beforeEach(() => seed(testData))
afterAll(() => db.end())

// GET / api / topics
describe('GET /api/topics', () => {
  test('returns an array of all the topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(res => {
        expect(res.body.topics).toBeInstanceOf(Array)
        expect(res.body.topics.length).toBe(3)
      })
  })
})

// describe('GET /api/topics', () => {
//   test('returns an array of all the topics', () => {
//     return request(app)
//       .get('/api/topics')
//       .expect(200)
//       .then(res => {
//         expect(res.body.topics).toBeInstanceOf(Array)
//         expect(res.body.topics.length).toBe(3)
//         topics.forEach(topic => {
//           expect(topic).toEqual(
//             expect.objectContaining({
//               description: expect.any(String),
//               slug: expect.any(String),
//             })
//           )
//         })
//       })
//   })
// })
