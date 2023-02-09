mongosh <<EOF
use resources
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: "readWrite",
      db: "resources",
    },
  ],
});

EOF