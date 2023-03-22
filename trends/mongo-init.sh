mongosh <<EOF
use trendsdata
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: "readWrite",
      db: "trendsdata",
    },
  ],
});

EOF
