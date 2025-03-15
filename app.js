const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

            type RootQuery {
                events: [Event!]!
            }
            
            type RootMutation {
                createEvent(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }    
        `),
        rootValue: {
            events: () => {
                return ['Event 1', 'Event 2', 'Event 3'];
            },
            createEvent: (args) => {
                const name = args.name;
                return `Event name '${name}' has been created!`;
            }
        },
        graphiql: true,
    }));

app.get('/health', (req, res, next) => {
    res.send('Hello, GraphQL API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));