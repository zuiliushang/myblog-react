import { normalize, schema } from 'normalizr';
import { camelizeKeys } from 'humps';



const API_ROOT='http://localhost:8080/';

const callApi = (endpoint,schema) => {
    const fullurl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
    return fetch(fullurl)
        .then(
            response =>
                response.json().then(json => {
                    if (!response.ok){
                        return Promise.reject(json);
                    }

                    const camelizedJson = camelizeKeys(json);
                    const nextPageUrl = getNextPageUrl(response);

                    return Object.assign({},
                        normalize(camelizedJson, schema),
                        { nextPageUrl })
                })
        )
}

const getNextPageUrl = (response) => {
    const link = response.headers.get('link')
    console.log(link);
    if (!link) {
        return null
    }

    const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
    if (!nextLink) {
        return null
    }

    return nextLink.split(';')[0].slice(1, -1)
}

const userSchema = new schema.Entity('users',{},{
    idAttribute: user => user.name.toUpperCase()
})

const repoSchema = new schema.Entity('repos',{
    owner: userSchema
},{
    idAttribute: repo => repo.fullName.toUpperCase()
})

export const Schema = {
    USER:userSchema,
    USER_ARRAY: [userSchema],
    REPO: repoSchema,
    REPO_ARRAY: [repoSchema]
}

export const CALL_API = 'Call API';

export default store => next => action => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined'){
        return next(action);
    }
    let { endpoint } = callAPI;
    const { schema, types } = callAPI;

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    if (!schema){
        throw new Error('Specify one of the exported Schemas.')
    }

    if (!Array.isArray(types) || types.length !== 3){
        throw new Error('Expected an array of three action types.')
    }

    if (!types.every( type => typeof type === 'string')){
        throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
        const finalAction = Object.assign({},action,data);
        console.log(finalAction);
        return finalAction;
    }

    const [ requestType, successType, failureType ] = types;
    next(actionWith({type: requestType}));

    return callAPI(endpoint, schema).then(
        response => next (actionWith({
            response,
            type: successType
        })),
        error => next (actionWith({
            type: failureType,
            error: error.message || 'Something bad happened'
        }))
    );
}