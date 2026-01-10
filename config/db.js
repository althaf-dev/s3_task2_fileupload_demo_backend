const Mongose = require('mongoose');

function connectDb(url) {
  Mongose.connect(url).then(() => {
    console.log('connected to mongo succssfully');
  });
}

const schema = Mongose.Schema({
  fileName: String,
  objectKey: String,
});

const Image = Mongose.model("image",schema);


module.exports = {
  connectDb,
  Image
}
