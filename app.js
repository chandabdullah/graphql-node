const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let events = [];

app.use(
    '/api',
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String
                price: Float
                date: String
            }

            input EventInput {
                title: String!
                description: String
                price: Float
                date: String
            }

            type RootQuery {
                events: [Event!]!
            }
            
            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }    
        `),
        rootValue: {
            events: () => {
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(36).substr(2, 9),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date().toISOString(),
                };
                events.push(event);
                return event;
            }
        },
        graphiql: true,
    }));

app.get('/health', (req, res, next) => {
    res.send('Hello, GraphQL API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));