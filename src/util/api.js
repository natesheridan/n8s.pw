const axios = require('axios');

export const getProjects = () => {
    return axios.get(`https://getpantry.cloud/apiv1/pantry/63e07715-4844-4e49-bc69-5343c2ef470e/basket/newBasket58`)
    .then (data => data.data.projects)
}