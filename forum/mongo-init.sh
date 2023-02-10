set -e

mongosh <<EOF
use forum
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: "readWrite",
      db: "forum",
    },
  ],
});
db.createCollection('posts');
db.createCollection('counters');
db.counters.insert({'_id': 'posts', sequence_value: 1});
EOF
