const db = require('../db/connection')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/topics', () => {
  test('Returns an array of all the topics with description and slug properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(res => {
        const topics = res.body.topics
        expect(topics).toBeInstanceOf(Array)
        expect(topics.length).toBe(3)
        topics.forEach(topic => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          )
        })
      })
  })
})

describe('GET/api/articles/:article_id', () => {
  test('status:200 and responds with an article object by requested id ', () => {
    const articleId = 1
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(response => {
        expect(typeof response.body.article).toBe('object')
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: articleId,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2020-07-09T20:11:00.000Z',
          })
        )
      })
  })
  test('Status:400 returns "bad request"', () => {
    return request(app)
      .get('/api/articles/abc')
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe('bad request')
      })
  })
  test('Status:404 and returns "Article not found"', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(response => {
        expect(response.body.msg).toEqual('Article not found')
      })
  })
})

describe('GET api/users', () => {
  test('Returns an array of all the users with username, avatar_url and name properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(res => {
        const users = res.body.users
        expect(users).toBeInstanceOf(Array)
        expect(users.length).toBe(4)
        users.forEach(user => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            })
          )
        })
      })
  })
  test('Status:404 returns "Not Found"', () => {
    return request(app)
      .get('/api/users/abc')
      .expect(404)
      .then(response => {
        expect(response.body.msg).toBe('Not Found')
      })
  })
})
