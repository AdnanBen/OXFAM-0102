mongosh <<EOF
use auth
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: "readWrite",
      db: "auth",
    },
  ],
});

EOF
