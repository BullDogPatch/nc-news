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
      .then(({ body }) => {
        expect(typeof body.article).toBe('object')
        expect(body.article).toEqual(
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe('bad request')
      })
  })
  test('Status:404 and returns "Article not found"', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Article not found')
      })
  })
})

describe('PATCH /api/articles/:article_id', () => {
  test('should increment vote for the given article id', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: 5 })
      .expect(200)
      .then(res => {
        expect(res.body.article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          body: 'some gifs',
          votes: 5,
          topic: 'mitch',
          author: 'icellusedkars',
          created_at: '2020-11-03T09:12:00.000Z',
        })
      })
  })
  test('PATCH: should decrement vote for the given article id', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: -5 })
      .expect(200)
      .then(res => {
        expect(res.body.article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          body: 'some gifs',
          votes: -5,
          topic: 'mitch',
          author: 'icellusedkars',
          created_at: '2020-11-03T09:12:00.000Z',
        })
      })
  })
  test('PATCH check whether the request body is there when passed in something other than a number"', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: 'blorp' })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('bad request')
      })
  })

  test('Status:400 returns "bad request"', () => {
    return request(app)
      .patch('/api/articles/abc')
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('bad request')
      })
  })

  test('throws an error if request body is empty', () => {
    const articleID = 2
    return request(app).patch(`/api/articles/${articleID}`).send().expect(400)
  })
  test('throws an error if article ID does not exist', () => {
    const articleID = 666
    const newVote = { inc_votes: 2 }
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(404)
  })
})
