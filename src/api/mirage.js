import {belongsTo, createServer, hasMany, Model} from "miragejs";

export const mirageServer = () => createServer({
    environment: 'development',
    models: {
        datum: Model.extend({
            characteristic: hasMany(),
            rule: hasMany()
        }),
        rule: Model.extend({
            datum: belongsTo()
        }),
        characteristic: Model.extend({
            datum: belongsTo()
        })
    },
    routes() {
        this.namespace = 'api';

        this.get('/datum', (schema, request) => {
            return schema.data.first().attrs
        })

        // this.delete('/delete/:id', (schema, request) => {
        //     const id = request.params.id;
        //     schema.
        // })
    },

    seeds(server) {
        const datumOne = server.create('datum', {id: 1});

        server.create('characteristic', {
            datum: datumOne,
            id: "weight",
            min: null,
            max: null,
            eq: null,
            measure: 0
        });

        server.create('characteristic', {
            datum: datumOne,
            id: "length",
            min: null,
            max: null,
            eq: null,
            measure: 1
        });

        server.create('rule', {
            datum: datumOne,
            id: "inner_diameter",
            min: 100,
            max: null,
            eq: null,
            grade: "premium",
        });

        server.create('rule', {
            datum: datumOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "premium"
        });

        server.create('rule', {
            datum: datumOne,
            id: "inner_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "secondary"
        });

        server.create('rule', {
            datum: datumOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "secondary"
        });

        server.create('rule', {
            datum: datumOne,
            id: "inner_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "reject"
        });

        server.create('rule', {
            datum: datumOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "reject"
        });
    }
})