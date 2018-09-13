const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'user',{
  id: '_id',
  username: 'username',
  name: 'name',
  email: 'email',
  created: 'created',
  meta: 'meta'
});
