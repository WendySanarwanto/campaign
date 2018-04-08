const routes = require(`next-routes`)();

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:campaignAddress', '/campaigns/show')
    .add('/campaigns/:campaignAddress/requests', 'campaigns/requests/index');

module.exports = routes;