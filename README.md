Follow the README files in the client and server folders to run both the front-end and back-end of the project in the development mode.

But before doing that, make sure you have completed the following:

1. Download and install PostgreSQL.
2. Create a database for the project.
3. Create a config.json file in /server with the following content:
```
{
  "connectionString": "postgresql://postgres:{your-database-password}@localhost:5432/{your-database-name}",
  "gmailEmail": "{your-gmail-address}",
  "gmailPassword": "{your-gmail-password}"
}
```
4. The "gmailEmail" and "gmailPassword" are to send password recovery emails to users.<br/>
You will need to configure your gmail account to allow emails to be sent programmically from your gmail address.
5. Run the DDL statements in /SQL/DDL.sql to create tables in your database.
6. Run the DML statements in /SQL/DML.sql to add data to the tables.
