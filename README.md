# Step 1 - Setting up your project

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

You have also been provided with a db folder with some data, a `setup.sql` file and a seeds folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

The job of index.js in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like a index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- topicData
- articleData
- userData
- commentData
