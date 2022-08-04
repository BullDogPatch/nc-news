const db = require('../db/connection')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app')
const request = require('supertest')
require('jest-sorted')

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

describe('GET api/users', () => {
  test('Returns an array of objects of all the users with username, avatar_url and name properties', () => {
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
})

describe('GET /api/articles/:article_id', () => {
  test('200: should respond with correct number of comments for the given article id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(res => {
        expect(res.body.article.comment_count).toBe('11')
      })
  })
  test('200: should respond with correct number of comments for the given article id', () => {
    return request(app)
      .get('/api/articles/9')
      .expect(200)
      .then(res => {
        expect(res.body.article.comment_count).toBe('2')
      })
  })
  test('200: should respond with correct number of comments for the given article id', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(res => {
        expect(res.body.article.comment_count).toBe('2')
      })
  })
  describe('GET /api/articles/:article_id', () => {
    test('200: should respond with an', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(res => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          )
          expect(res.body.article.comment_count).toBe('11')
        })
    })
  })
})

describe('GET /api/articles', () => {
  test('Responds with an array of user objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(12)
        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          )
        })
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  test('GET Responds with an array of comment objects for the correct article with the comment_id, votes, created_at, author and body properties', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(res => {
        expect(res.body.comments).toBeInstanceOf(Array)
        res.body.comments.forEach(comment => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
          })
        })
      })
  })
  test(`Returns a 400 and 'bad request' if trying to get comments of invalid article`, () => {
    return request(app)
      .get('/api/articles/blorp/comments')
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe('bad request')
      })
  })
  test('responds with 404 if passed with valid iD but not present in database', () => {
    return request(app)
      .get('/api/articles/10000')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found')
      })
  })
})
