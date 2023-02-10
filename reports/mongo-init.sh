mongosh <<EOF
use reportdata
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [
    {
      role: "readWrite",
      db: "reportdata",
    },
  ],
});

EOF