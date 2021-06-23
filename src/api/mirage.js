import {belongsTo, createServer, hasMany, Model} from "miragejs";

export const mirageServer = () => createServer({
    environment: 'development',
    models: {
        data: Model.extend({
            characteristics: hasMany(),
            rules: hasMany()
        }),
        rules: Model.extend({
            data: belongsTo()
        }),
        characteristics: Model.extend({
            data: belongsTo()
        })
    },
    routes() {
        this.namespace = 'api';

        this.get('/data', (schema, request) => {
            return schema.data.all()
        })

        // this.delete('/delete/:id', (schema, request) => {
        //     const id = request.params.id;
        //     schema.
        // })
    },

    seeds(server) {
        const dataOne = server.create('data', {id: 1});

        server.create('characteristics', {
            data: dataOne,
            id: "weight",
            min: null,
            max: null,
            eq: null,
            measure: 0
        });

        server.create('characteristics', {
            data: dataOne,
            id: "length",
            min: null,
            max: null,
            eq: null,
            measure: 1
        });

        server.create('characteristics', {
            data: dataOne,
            id: "inner_diameter",
            min: 100,
            max: null,
            eq: null,
            grade: "premium",
        });

        server.create('characteristics', {
            data: dataOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "premium"
        });

        server.create('characteristics', {
            data: dataOne,
            id: "inner_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "secondary"
        });

        server.create('characteristics', {
            data: dataOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "secondary"
        });

        server.create('characteristics', {
            data: dataOne,
            id: "inner_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "reject"
        });

        server.create('characteristics', {
            data: dataOne,
            id: "outer_diameter",
            min: null,
            max: null,
            eq: null,
            grade: "reject"
        });
    }
})