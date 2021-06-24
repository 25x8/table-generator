import {belongsTo, createServer, hasMany, JSONAPISerializer, Model} from "miragejs";

export const mirageServer = () => createServer({
    environment: 'development',
    models: {
        idList: Model,
        lastId: Model
    },
    serializers: {
        application: JSONAPISerializer,
    },
    routes() {
        this.namespace = 'api';

        this.post('edit/:id', (schema, request) => {

        });

        this.put('add', (schema, request) => {
            const lastId = schema.lastIds.first();
            const val = lastId.val + 1;
            lastId.update({val});
            schema.idLists.create({val})
            return {id: val};
        });

        this.delete('/delete/:id', (schema, request) => {
            const id = request.params.id;
            schema.idLists.find(id).destroy();
            return schema.idLists.all()
        })
    },

    seeds(server) {
        server.create('idList', {val: 1});
        server.create('lastId', {val: 1});
    }
})
